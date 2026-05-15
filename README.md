# Cloudflare AI Chat Agent

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/siavashbesharati/darkgpt-ai)

A production-ready full-stack AI chat application powered by Cloudflare Workers, Agents, and React. Features multi-session conversations, streaming responses, tool calling with MCP integration, and persistent session management using Durable Objects.

## ✨ Key Features

- **Multi-Session Chat**: Create, switch, and manage unlimited chat sessions with automatic title generation.
- **Streaming Responses**: Real-time token-by-token streaming for natural conversation feel.
- **Tool Calling**: Built-in tools (weather, web search) + extensible MCP (Model Context Protocol) integration.
- **AI Gateway Ready**: Seamless integration with Cloudflare AI Gateway for models like Gemini.
- **Modern UI**: Responsive React app with Tailwind CSS, shadcn/ui components, and dark mode.
- **Session Persistence**: Durable Objects handle state with automatic activity tracking.
- **Production Optimized**: Type-safe TypeScript, error boundaries, client error reporting.
- **Easy Deployment**: One-click deploy to Cloudflare Workers with Pages integration.

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers, Hono, Agents SDK, Durable Objects
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query
- **AI/ML**: Cloudflare AI Gateway, OpenAI SDK, MCP SDK
- **State**: Zustand, Immer
- **Tools**: SerpAPI integration, custom web scraping
- **Dev Tools**: Bun, TypeScript, ESLint, Wrangler

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- Cloudflare account with [AI Gateway](https://developers.cloudflare.com/ai-gateway/) configured
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest`)

### Installation

```bash
# Clone or download the project
git clone <your-repo> aethercode-ai
cd aethercode-ai

# Install dependencies
bun install

# Generate Worker types
bunx wrangler types
```

### Local Development

```bash
# Start dev server (frontend + worker)
bun dev

# Open http://localhost:3000 (or your configured PORT)
```

### Configure Environment

Update `wrangler.jsonc`:

```json
{
  "vars": {
    "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
    "CF_AI_API_KEY": "{your-api-key}",
    "SERPAPI_KEY": "{your-serpapi-key}",
    "OPENROUTER_API_KEY": "{optional}"
  }
}
```

Add secrets for production:

```bash
bunx wrangler secret put CF_AI_BASE_URL
bunx wrangler secret put CF_AI_API_KEY
bunx wrangler secret put SERPAPI_KEY
```

## 📱 Usage

### Chat Sessions API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions` | GET | List all sessions |
| `/api/sessions` | POST | Create new session `{title?, firstMessage?}` |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/title` | PUT | Update title `{title}` |
| `/api/chat/:sessionId/chat` | POST | Send message `{message, model?, stream?}` |
| `/api/chat/:sessionId/messages` | GET | Get conversation |
| `/api/chat/:sessionId/clear` | DELETE | Clear messages |

### Frontend

- Chat interface auto-manages sessions
- Model selection (Gemini Flash/Pro)
- Streaming UI with typing indicators
- Session sidebar with search/delete

## 🔧 Development Workflow

```bash
# Type checking
bun tsc --noEmit

# Lint
bun lint

# Build for production
bun build

# Preview production build
bun preview
```

**Hot reload**: Frontend auto-reloads. Worker changes require `Ctrl+C` + `bun dev`.

**Custom Tools**: Extend `worker/tools.ts` or add MCP servers to `worker/mcp-client.ts`.

**UI Customization**: Edit `src/pages/HomePage.tsx`, use shadcn components (`@/components/ui/*`).

## ☁️ Deployment

1. **Configure** `wrangler.jsonc` with your AI Gateway details
2. **Build** assets: `bun build`
3. **Deploy**:

```bash
bunx wrangler deploy
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/siavashbesharati/darkgpt-ai)

**Custom Domain**: `bunx wrangler pages publish dist --project-name=your-pages-project`

**Workers for Platforms**: Integrates seamlessly with Pages Functions or standalone Workers.

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch: `git checkout -b feature/awesome-tool`
4. Commit changes: `git commit -m 'Add awesome tool'`
5. Push & PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Agents SDK](https://developers.cloudflare.com/agents/)

Built with ❤️ by Cloudflare Templates. Questions? [Cloudflare Discord](https://discord.cloudflare.com/)