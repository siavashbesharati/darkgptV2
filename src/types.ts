export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
  result: any;
}

export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}

export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
}

export interface MCPResult {
  tool: string;
  output: string;
}

export interface ErrorResult {
  error: string;
  detail?: string;
}
