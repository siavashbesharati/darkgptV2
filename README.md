# 🥷 Dark GPT - Full-Stack AI Chat Agent

A production-ready, high-performance full-stack AI chat application built with **Express**, **React**, and **TypeScript**. Optimized for the shadows, powered by **Gemini 2.0 Flash**.

## ✨ Key Features

- **🥷 Ninja-Style UI**: Sleek, high-contrast dark interface with motion-driven transitions.
- **🚀 Ultra-Fast Chat**: Real-time streaming responses powered by Gemini 2.0 Flash.
- **💎 Multi-Tier Economy**: Integrated crypto-payment simulation (TON/USDT) for credit-based usage.
- **🔧 App Gallery**: Pre-built attack vector presets (SQLi, DDoS, Social Engineering) ready to inject into workspace.
- **🛡️ Admin Command Center**: Manage targets (users), view on-chain transactions, and monitor cluster health.
- **📈 Scalable Architecture**: Express backend with Vite middleware, ready for containerized deployment.
- **🔑 Secure Session Management**: JWT-based authentication with persistent state.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, Google Generative AI (@google/genai)
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, motion (framer-motion), Lucide React
- **Economy**: TON/USDT Payment UI with QR generation
- **State**: Custom Zustand store for cross-component synchronization
- **Dev Tools**: TypeScript, ESLint, esbuild (for server bundling)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd dark-gpt

# Install dependencies
npm install
```

### Configure Environment

Dark GPT is designed to be fully manageable via the **Admin Dashboard**. There is **no need** to set environment variables on your server/hosting platform.

1. Start the application.
2. Log in with the admin email (`siavashbesharati@gmail.com`).
3. Navigate to the **Command Center** (Admin Dashboard).
4. Go to **Settings** and configure your AI API keys, network modes, and wallet addresses.

Settings are persisted in a `settings.json` file in the root directory.

### Local Development

```bash
# Start the full-stack dev server (Vite + Express)
npm run dev

# Open http://localhost:3000
# Go to Admin -> Settings to configure your API keys
```

## ☁️ Deployment

### 1. Build for Production

```bash
npm run build
```
This command generates:
- `dist/index.html` & assets (Frontend)
- `dist/server.cjs` (Bundled Node.js backend)

### 2. Launch

```bash
npm start
```

### Platform Specifics

#### **Vercel**
This project is set up as a custom server app. For Vercel, you should use the `vercel.json` provided (or create one) to point to the output. Note: Vercel prefers Serverless Functions, so a long-running Express server might require [Vercel CLI legacy support](https://vercel.com/docs/functions/runtimes/node-js) or conversion to API routes.

#### **Railway / Render / Heroku**
1. Connect your GitHub repository.
2. Set the **Build Command**: `npm run build`
3. Set the **Start Command**: `npm start`
4. Add your Environment Variables (`GEMINI_API_KEY`, etc.).
5. Ensure the platform maps to port `3000`.

#### **Own Server (Docker/VPS)**
```bash
# Run with PM2 or Docker
pm2 start dist/server.cjs --name dark-gpt
```

## 📱 API Reference

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/chat` | POST | User | Send message and get streamed Gemini response |
| `/api/auth/login` | POST | Public | Authenticate or Register user |
| `/api/upgrade` | POST | User | Process simulated payment and upgrade tier |
| `/api/admin/users` | GET | Admin | List all registered targets |
| `/api/admin/users/:id/transactions` | GET | Admin | View history of a specific target |

## 🤝 Contributing

1. Fork the codebase.
2. Create your feature branch (`git checkout -b feature/stealth-mode`).
3. Commit your changes (`git commit -m 'Add stealth mode'`).
4. Push to the branch (`git push origin feature/stealth-mode`).
5. Open a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

Built with 🥷 by the Dark GPT team. Questions? Contact the shadows.
