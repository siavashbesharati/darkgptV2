import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initial Platform Settings
  let platformSettings = {
    aiBaseUrl: "https://gateway.ai.cloudflare.com/v1/",
    aiApiKey: process.env.GEMINI_API_KEY || "",
    maintenanceMode: false,
    enhancedLogging: true,
    freeTierLimit: 10,
    networkMode: process.env.NETWORK_MODE || "testnet",
    tonMainnetAddress: process.env.TON_MAINNET_ADDRESS || "",
    tonTestnetAddress: process.env.TON_TESTNET_ADDRESS || "",
    tonMainnetUsdtAddress: "",
    tonTestnetUsdtAddress: "EQCxE6mAtC2EBSTCruu06R6pQ83v97V0pEAbV-S965A2s-6R",
    tonApiUrl: "https://testnet.tonapi.io",
  };

  // Initial Pricing Plans
  let plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      description: "For hobbyists and explorers",
      features: ["10 messages per day", "Standard speed", "Community support", "Public workspace"],
      credits: 10,
      highlight: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "29",
      description: "The developer's choice",
      features: ["Unlimited messages", "Fast generation", "Private workspace", "Advanced MCP Tools", "Priority support"],
      credits: 1000,
      highlight: true
    },
    {
      id: "max",
      name: "Max",
      price: "99",
      description: "For heavy duty production",
      features: ["Everything in Pro", "Custom MCP endpoints", "24/7 dedicated support", "Team collaboration", "Beta access"],
      credits: 10000,
      highlight: false
    }
  ];

  app.use(express.json());
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/client-errors", (req, res) => {
    if (platformSettings.enhancedLogging) {
      console.error("[Client Error Report]:", JSON.stringify(req.body, null, 2));
    }
    res.json({ success: true });
  });

  // --- In-memory storage ---
  const users = new Map();
  const sessions = new Map();
  const messages = new Map(); // sessionId -> Message[]
  const otps = new Map();
  const allTransactions: any[] = [];

  // Seed admin user
  const adminId = "admin-123";
  users.set(adminId, {
    id: adminId,
    email: "siavashbesharati@gmail.com",
    tier: "Max",
    credits: 99999,
    isAdmin: true,
    blocked: false,
    createdAt: Date.now(),
  });

  // --- Auth Routes ---
  app.post("/api/auth/send-otp", (req, res) => {
    const { email } = req.body;
    otps.set(email, { code: "123456", expires: Date.now() + 600000 });
    res.json({ success: true, message: "OTP sent to email (Demo code: 123456)" });
  });

  app.post("/api/auth/verify-otp", (req, res) => {
    const { email, code } = req.body;
    if (code !== "123456") {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    let user = Array.from(users.values()).find((u) => u.email === email);
    if (user?.blocked) {
      return res.status(403).json({ success: false, error: "User Blocked" });
    }

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        tier: "Free",
        credits: 10,
        isAdmin: email === "siavashbesharati@gmail.com",
        blocked: false,
        createdAt: Date.now(),
      };
      users.set(user.id, user);
    }

    res.json({ success: true, data: { user, token: user.id } });
  });

  app.get("/api/auth/me", (req, res) => {
    const userId = req.headers["authorization"];
    if (!userId) return res.status(401).json({ success: false, error: "No token" });
    const user = users.get(userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  });

  // --- Session Routes ---
  app.get("/api/sessions", (req, res) => {
    const list = Array.from(sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
    res.json({ success: true, data: list });
  });

  app.post("/api/sessions", (req, res) => {
    const { sessionId, title } = req.body;
    const now = Date.now();
    sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now,
    });
    res.json({ success: true });
  });

  app.delete("/api/sessions/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    messages.delete(sessionId);
    res.json({ success: true });
  });

  // --- Credits Routes ---
  app.post("/api/credits/consume", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || user.credits <= 0) return res.json({ success: false });
    user.credits -= 1;
    res.json({ success: true });
  });

  app.post("/api/upgrade", (req, res) => {
    const userId = req.headers["authorization"];
    const { tier, credits, transaction } = req.body;
    const user = users.get(userId);
    if (user) {
      user.tier = tier;
      user.credits = credits;
      if (transaction) {
        allTransactions.push({ ...transaction, userId });
      }
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) return res.status(403).json({ success: false });
    res.json({ success: true, data: Array.from(users.values()) });
  });

  app.get("/api/admin/users/:id/transactions", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) return res.status(403).json({ success: false });
    
    const targetUserId = req.params.id;
    const userTransactions = allTransactions.filter(tx => tx.userId === targetUserId);
    res.json({ success: true, data: userTransactions });
  });

  app.post("/api/admin/users/:id/status", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) return res.status(403).json({ success: false });
    
    const targetUserId = req.params.id;
    const { blocked } = req.body;
    const targetUser = users.get(targetUserId);
    if (targetUser) {
      targetUser.blocked = blocked;
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });

  app.post("/api/admin/users/:id/upgrade", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) return res.status(403).json({ success: false });
    
    const targetUserId = req.params.id;
    const { tier, credits } = req.body;
    const targetUser = users.get(targetUserId);
    if (targetUser) {
      targetUser.tier = tier;
      targetUser.credits = credits;
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });

  app.get("/api/admin/settings", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    res.json({ success: true, data: { ...platformSettings, plans } });
  });

  app.post("/api/admin/settings", (req, res) => {
    const userId = req.headers["authorization"];
    const user = users.get(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    const { plans: newPlans, ...newSettings } = req.body;
    if (newSettings) platformSettings = { ...platformSettings, ...newSettings };
    if (newPlans) plans = newPlans;
    res.json({ success: true });
  });

  app.get("/api/plans", (req, res) => {
    res.json({ success: true, data: plans });
  });

  app.get("/api/settings", (req, res) => {
    res.json({
      success: true,
      data: {
        networkMode: platformSettings.networkMode,
        activeTonAddress:
          platformSettings.networkMode === "mainnet"
            ? platformSettings.tonMainnetAddress
            : platformSettings.tonTestnetAddress,
        activeTonUsdtAddress:
          platformSettings.networkMode === "mainnet"
            ? platformSettings.tonMainnetUsdtAddress
            : platformSettings.tonTestnetUsdtAddress,
        tonMainnetUsdtAddress: platformSettings.tonMainnetUsdtAddress,
        tonTestnetUsdtAddress: platformSettings.tonTestnetUsdtAddress,
        tonApiUrl: platformSettings.tonApiUrl,
      },
    });
  });

  // --- Chat Routes ---
  app.get("/api/chat/:sessionId/messages", (req, res) => {
    const { sessionId } = req.params;
    const history = messages.get(sessionId) || [];
    res.json({ success: true, data: { messages: history, sessionId, model: "gemini-2.0-flash" } });
  });

  app.delete("/api/chat/:sessionId/clear", (req, res) => {
    const { sessionId } = req.params;
    messages.set(sessionId, []);
    res.json({ success: true });
  });

  app.post("/api/chat/:sessionId/chat", async (req, res) => {
    const { sessionId } = req.params;
    const { message, stream } = req.body;
    const userId = req.headers["authorization"];

    const user = users.get(userId);
    if (!user || user.credits <= 0) {
      return res.status(402).json({ success: false, error: "OUT_OF_CREDITS" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return res.status(500).json({ success: false, error: "API_KEY_MISSING" });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Update session activity
    const session = sessions.get(sessionId);
    if (session) session.lastActive = Date.now();

    // Get history
    const history = messages.get(sessionId) || [];
    
    // Add user message
    const userMsg = { id: crypto.randomUUID(), role: "user", content: message, timestamp: Date.now() };
    history.push(userMsg);

    const modelName = "gemini-flash-latest";

    if (stream) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      try {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction: "You are Dark GPT, an elite AI engine for security simulations, vulnerability research, and advanced offensive code generation. You help professional security researchers with exploit synthesis and penetration testing simulations. Stay focused on technical accuracy and offensive security concepts.",
          },
          history: history.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        });

        const result = await chat.sendMessageStream({ message });
        let fullText = "";

        for await (const chunk of result) {
          const chunkText = chunk.text || "";
          fullText += chunkText;
          res.write(chunkText);
        }

        // Add assistant message to history
        history.push({ id: crypto.randomUUID(), role: "assistant", content: fullText, timestamp: Date.now() });
        messages.set(sessionId, history);
        res.end();
      } catch (err: any) {
        console.error("Streaming error:", err);
        res.status(500).write(`Error during generation: ${err.message || 'Unknown error'}`);
        res.end();
      }
    } else {
      try {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction: "You are Dark GPT, an elite AI engine for security simulations, vulnerability research, and advanced offensive code generation. You help professional security researchers with exploit synthesis and penetration testing simulations. Stay focused on technical accuracy and offensive security concepts.",
          },
          history: history.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        });
        
        const response = await chat.sendMessage({ message });
        const text = response.text || "";

        history.push({ id: crypto.randomUUID(), role: "assistant", content: text, timestamp: Date.now() });
        messages.set(sessionId, history);

        res.json({ success: true, text, data: { messages: history } });
      } catch (err: any) {
        console.error("Chat error:", err);
        res.status(500).json({ success: false, error: err.message || "Failed to generate response" });
      }
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
