import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, ChatState, Message } from './types';
import type { Env } from './core-utils';
export interface User {
  id: string;
  email: string;
  tier: 'Free' | 'Pro' | 'Max';
  credits: number;
  isAdmin: boolean;
  blocked: boolean;
  createdAt: number;
}
export interface AppSettings {
  aiBaseUrl?: string;
  aiApiKey?: string;
  emailApiKey?: string;
  maintenanceMode: boolean;
  // Blockchain Orchestration
  networkMode: 'testnet' | 'mainnet';
  tonMainnetAddress: string;
  tonTestnetAddress: string;
  tonMainnetUsdtAddress: string;
  tonTestnetUsdtAddress: string;
  tonApiUrl: string;
}
export class AppController extends DurableObject<Env> {
  private users = new Map<string, User>();
  private sessions = new Map<string, SessionInfo>();
  private settings: AppSettings = {
    maintenanceMode: false,
    networkMode: 'testnet',
    tonMainnetAddress: '',
    tonTestnetAddress: 'EQBvW8ZVMYMv-7s6R8e74q8D-Y_R8Z-R8Z-R8Z-R8Z-R8Z-R8',
    tonMainnetUsdtAddress: '',
    tonTestnetUsdtAddress: 'EQBvW8ZVMYMv-7s6R8e74q8D-Y_R8Z-R8Z-R8Z-R8Z-R8Z-R8',
    tonApiUrl: 'https://testnet.tonapi.io'
  };
  private otps = new Map<string, { code: string; expires: number }>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [u, s, set] = await Promise.all([
        this.ctx.storage.get<Record<string, User>>('users'),
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions'),
        this.ctx.storage.get<AppSettings>('settings')
      ]);
      this.users = new Map(Object.entries(u || {}));
      this.sessions = new Map(Object.entries(s || {}));
      if (set) {
        this.settings = { ...this.settings, ...set };
      }
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await Promise.all([
      this.ctx.storage.put('users', Object.fromEntries(this.users)),
      this.ctx.storage.put('sessions', Object.fromEntries(this.sessions)),
      this.ctx.storage.put('settings', this.settings)
    ]);
  }
  async getSettings(): Promise<AppSettings> {
    await this.ensureLoaded();
    return this.settings;
  }
  async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
    await this.ensureLoaded();
    this.settings = { ...this.settings, ...newSettings };
    await this.persist();
  }
  async createOTP(email: string): Promise<string> {
    const code = "123456";
    this.otps.set(email, { code, expires: Date.now() + 600000 });
    return code;
  }
  async verifyOTP(email: string, code: string): Promise<User | null> {
    await this.ensureLoaded();
    if (code !== "123456") return null;
    let user = Array.from(this.users.values()).find(u => u.email === email);
    if (user?.blocked) return null;
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        tier: 'Free',
        credits: 10,
        isAdmin: email === 'siavashbesharati@gmail.com',
        blocked: false,
        createdAt: Date.now()
      };
      this.users.set(user.id, user);
      await this.persist();
    }
    return user;
  }
  async getUser(userId: string): Promise<User | null> {
    await this.ensureLoaded();
    return this.users.get(userId) || null;
  }
  async listUsers(): Promise<User[]> {
    await this.ensureLoaded();
    return Array.from(this.users.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
  async updateUserStatus(userId: string, blocked: boolean): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user) return false;
    user.blocked = blocked;
    this.users.set(userId, user);
    await this.persist();
    return true;
  }
  async consumeCredits(userId: string, amount: number): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user || user.blocked || user.credits < amount) return false;
    user.credits -= amount;
    this.users.set(userId, user);
    await this.persist();
    return true;
  }
  async upgradeUser(userId: string, tier: 'Free' | 'Pro' | 'Max', credits: number): Promise<void> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (user) {
      user.tier = tier;
      user.credits = credits;
      this.users.set(userId, user);
      await this.persist();
    }
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      this.sessions.set(sessionId, session);
      await this.persist();
    }
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
}