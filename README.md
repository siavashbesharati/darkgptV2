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

Dark GPT requires a few key secrets to operate in production:

1. **Gemini API Key**: Set `GEMINI_API_KEY` in your hosting platform's environment variables.
2. **Firebase Config**: Ensure `firebase-applet-config.json` is present in the root (for client-side) and `firebase-admin` is initialized (for server-side).
3. **Admin Email**: The first user to log in with `siavashbesharati@gmail.com` will automatically be granted Admin privileges.

Additional platform settings (AI Model, Network Mode, etc.) can be configured via the **Admin Dashboard** in the app.

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

### Platform Specifics

#### **🌐 Custom Domains & Subdomains**
To run Dark GPT on your own subdomain (e.g., `chat.yourdomain.com`):
1. **Hosting Choice**: Use **Railway** or **Render** for the most seamless experience with this full-stack Express architecture.
2. **DNS Configuration**: 
   - Go to your Domain Provider (GoDaddy, Namecheap, Cloudflare).
   - Add a `CNAME` record for your subdomain (e.g., `chat`) pointing to the domain provided by your hosting platform (e.g., `dark-gpt.up.railway.app`).
3. **SSL/HTTPS**: Most platforms like Railway and Vercel will automatically provision an SSL certificate for your custom subdomain once the DNS propagates.

#### **🚅 Railway (Recommended for Full-Stack)**
1. Connect your GitHub repository to [Railway](https://railway.app/).
2. Railway will automatically detect the `package.json`.
3. Go to **Settings** -> **Domains** -> **Add Custom Domain** to link your subdomain.
4. Ensure `GEMINI_API_KEY` and any Firebase secrets are added in the **Variables** tab.

#### **▲ Vercel**
1. Connect your repo to Vercel.
2. Vercel is optimized for Serverless. Since this app uses a long-running Express server, you may need a `vercel.json` to route all requests to the server:
   ```json
   {
     "version": 2,
     "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
   }
   ```
3. Add your custom subdomain in **Project Settings** -> **Domains**.

#### **☁️ Google Cloud Run (Self-Hosted)**
This app is natively compatible with Cloud Run.
1. Build the Docker image using the provided `package.json`.
2. Deploy to Cloud Run and map your custom domain via **Manage Custom Domains** in the GCP Console.

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
