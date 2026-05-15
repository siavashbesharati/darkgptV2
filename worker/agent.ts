import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage, createStreamResponse, createEncoder } from './utils';
import { getAppController, registerSession, updateSessionActivity } from './core-utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.0-flash'
  };
  async onStart(): Promise<void> {
    const controller = getAppController(this.env);
    const settings = await controller.getSettings();
    this.chatHandler = new ChatHandler(
      settings.aiBaseUrl || this.env.CF_AI_BASE_URL,
      settings.aiApiKey || this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = request.headers.get('Authorization');
    // CRITICAL SECURITY: Immediate return for blocked users
    if (userId) {
      const controller = getAppController(this.env);
      const user = await controller.getUser(userId);
      if (user?.blocked) {
        console.warn(`[AUDIT] Blocked user attempt: ${user.email} (ID: ${userId}) on session ${this.state.sessionId}`);
        return Response.json({ success: false, error: 'USER_BLOCKED' }, { status: 403 });
      }
    }
    if (this.state.sessionId) {
      await updateSessionActivity(this.env, this.state.sessionId);
    }
    if (request.method === 'POST' && url.pathname === '/chat') {
      if (!userId) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const controller = getAppController(this.env);
      const canProceed = await controller.consumeCredits(userId, 1);
      if (!canProceed) {
        return Response.json({ success: false, error: 'OUT_OF_CREDITS' }, { status: 402 });
      }
      return this.handleChatMessage(await request.json());
    }
    if (request.method === 'GET' && url.pathname === '/messages') {
      return Response.json({ success: true, data: this.state });
    }
    if (request.method === 'DELETE' && url.pathname === '/clear') {
      this.setState({ ...this.state, messages: [] });
      return Response.json({ success: true });
    }
    return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
  }
  private async handleChatMessage(body: { message: string; model?: string; stream?: boolean }): Promise<Response> {
    const { message, model, stream } = body;
    if (!message?.trim()) {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    if (this.state.messages.length === 0) {
      const title = message.trim().slice(0, 40) + (message.trim().length > 40 ? '...' : '');
      await registerSession(this.env, this.state.sessionId, title);
    }
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    const userMessage = createMessage('user', message.trim());
    this.setState({ ...this.state, messages: [...this.state.messages, userMessage], isProcessing: true });
    try {
      if (stream) {
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = createEncoder();
        (async () => {
          try {
            let fullContent = '';
            const response = await this.chatHandler!.processMessage(message, this.state.messages, (chunk) => {
              fullContent += chunk;
              writer.write(encoder.encode(chunk));
            });
            const assistantMessage = createMessage('assistant', response.content);
            this.setState({ ...this.state, messages: [...this.state.messages, assistantMessage], isProcessing: false });
          } catch (err) {
            console.error('[CRITICAL] Stream failure in agent handleChatMessage:', err);
            this.setState({ ...this.state, isProcessing: false });
          } finally {
            writer.close();
          }
        })();
        return createStreamResponse(readable);
      }
      const response = await this.chatHandler!.processMessage(message, this.state.messages);
      const assistantMsg = createMessage('assistant', response.content);
      this.setState({ ...this.state, messages: [...this.state.messages, assistantMsg], isProcessing: false });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      this.setState({ ...this.state, isProcessing: false });
      console.error('[CRITICAL] Non-stream failure in agent handleChatMessage:', error);
      return Response.json({ success: false, error: API_RESPONSES.PROCESSING_ERROR }, { status: 500 });
    }
  }
}