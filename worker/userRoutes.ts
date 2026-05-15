import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const token = c.req.header('Authorization');
            if (!token) {
                return c.json({ success: false, error: 'Unauthorized' }, 401);
            }
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            const newReq = new Request(url.toString(), {
                method: c.req.method,
                headers: {
                  ...c.req.header(),
                  'Authorization': token
                },
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            });
            return agent.fetch(newReq);
        } catch (error) {
            console.error('Agent routing error:', error);
            return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, 500);
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.post('/api/auth/send-otp', async (c) => {
        const { email } = await c.req.json();
        const controller = getAppController(c.env);
        await controller.createOTP(email);
        return c.json({ success: true, message: 'OTP sent to email (Demo code: 123456)' });
    });
    app.post('/api/auth/verify-otp', async (c) => {
        const { email, code } = await c.req.json();
        const controller = getAppController(c.env);
        const user = await controller.verifyOTP(email, code);
        if (!user) return c.json({ success: false, error: 'Invalid OTP or User Blocked' }, 400);
        return c.json({ success: true, data: { user, token: user.id } });
    });
    app.get('/api/auth/me', async (c) => {
        const userId = c.req.header('Authorization');
        if (!userId) return c.json({ success: false, error: 'No token' }, 401);
        const controller = getAppController(c.env);
        const user = await controller.getUser(userId);
        if (!user) return c.json({ success: false, error: 'User not found' }, 404);
        return c.json({ success: true, data: user });
    });
    app.post('/api/credits/consume', async (c) => {
        const userId = c.req.header('Authorization');
        if (!userId) return c.json({ success: false, error: 'Unauthorized' }, 401);
        const controller = getAppController(c.env);
        const success = await controller.consumeCredits(userId, 1);
        return c.json({ success });
    });
    // Public Payment Config
    app.get('/api/config/payment', async (c) => {
        const controller = getAppController(c.env);
        const settings = await controller.getSettings();
        return c.json({
            success: true,
            data: {
                networkMode: settings.networkMode,
                activeTonAddress: settings.networkMode === 'mainnet' ? settings.tonMainnetAddress : settings.tonTestnetAddress,
                activeTonUsdtAddress: settings.networkMode === 'mainnet' ? settings.tonMainnetUsdtAddress : settings.tonTestnetUsdtAddress,
                tonApiUrl: settings.tonApiUrl,
            }
        });
    });
    // Admin Routes
    app.get('/api/admin/users', async (c) => {
        const controller = getAppController(c.env);
        const users = await controller.listUsers();
        return c.json({ success: true, data: users });
    });
    app.post('/api/admin/users/:id/status', async (c) => {
        const userId = c.req.param('id');
        const { blocked } = await c.req.json();
        const controller = getAppController(c.env);
        const success = await controller.updateUserStatus(userId, blocked);
        return c.json({ success });
    });
    app.post('/api/admin/users/:id/upgrade', async (c) => {
        const targetUserId = c.req.param('id');
        const { tier, credits } = await c.req.json();
        const controller = getAppController(c.env);
        await controller.upgradeUser(targetUserId, tier, credits);
        return c.json({ success: true });
    });
    app.get('/api/admin/settings', async (c) => {
        const controller = getAppController(c.env);
        return c.json({ success: true, data: await controller.getSettings() });
    });
    app.post('/api/admin/settings', async (c) => {
        const settings = await c.req.json();
        const controller = getAppController(c.env);
        await controller.updateSettings(settings);
        return c.json({ success: true });
    });
    app.post('/api/upgrade', async (c) => {
        const userId = c.req.header('Authorization');
        if (!userId) return c.json({ success: false, error: 'Unauthorized' }, 401);
        const { tier, credits } = await c.req.json();
        const controller = getAppController(c.env);
        // Log environment for audit
        const settings = await controller.getSettings();
        console.log(`[PAYMENT] Upgrade to ${tier} for user ${userId} on ${settings.networkMode}`);
        await controller.upgradeUser(userId, tier, credits);
        return c.json({ success: true });
    });
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const { sessionId, title } = await c.req.json();
        const controller = getAppController(c.env);
        await controller.addSession(sessionId, title);
        return c.json({ success: true });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const controller = getAppController(c.env);
        const success = await controller.removeSession(sessionId);
        return c.json({ success });
    });
}