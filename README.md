# Mondokroma Canvas

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zeidalqadri/mndkrm.trvl)

Mondokroma Canvas is a visually striking, single-page application designed to revolutionize bespoke travel planning. It presents a minimalist, brutalist interface for users to input their core travel desires: destination, timing, and duration. Behind this simple form lies a powerful, orchestrated pipeline on Cloudflare Workers. Upon submission, the application constructs a prompt, enriches it via a context engine, and dispatches it to two leading AI models to generate diverse itinerary drafts. The core innovation is a deterministic reconciliation engine that merges these drafts into a single, coherent, and comprehensive 'mondokroma_itinerary'. This final document is rendered for the user to review, edit inline, and approve, providing a seamless journey from a simple idea to a polished, travel-ready plan.

## Key Features

-   **AI-Powered Itinerary Generation**: Transforms simple inputs (Where, When, How long) into a detailed, day-by-day travel plan.
-   **Multi-Model Reconciliation**: Leverages two different AI models to create diverse drafts and merges them into a single, superior itinerary.
-   **Interactive & Editable**: Users can review and edit every detail of their itinerary inline, without page reloads.
-   **Brutalist UI/UX**: A stark, minimalist, and visually striking design that is fully responsive and accessible.
-   **Serverless Architecture**: Built entirely on the Cloudflare stack for global performance and scalability.
-   **Three-Stage Flow**: A clear user journey from `Input` -> `Processing` -> `Review` all on a single page.

## Technology Stack

-   **Frontend**:
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [Framer Motion](https://www.framer.com/motion/) for animations
    -   [React Hook Form](https://react-hook-form.com/) for form handling
-   **Backend**:
    -   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
-   **Core**:
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Zod](https://zod.dev/) for schema validation

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mondokroma_canvas
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**

    Create a `.dev.vars` file in the root of the project by copying the example:
    ```bash
    cp .dev.vars.example .dev.vars
    ```

    Update `.dev.vars` with your Cloudflare and AI provider credentials. This file is used by Wrangler for local development.
    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

### Running the Development Server

To start the local development server, which includes the Vite frontend and the Cloudflare Worker backend, run:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Development

-   **Frontend**: All frontend code is located in the `src/` directory. The main application component is `src/pages/HomePage.tsx`.
-   **Backend**: The Cloudflare Worker code, including API routes and business logic, is in the `worker/` directory.
-   **Linting**: To check for code quality and style issues, run:
    ```bash
    bun run lint
    ```

## Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Build the project:**
    This command bundles the frontend application and prepares the worker for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged into your Cloudflare account via the Wrangler CLI (`npx wrangler login`). Then, run the deploy command:
    ```bash
    bun run deploy
    ```

    Wrangler will handle the process of uploading your static assets and worker code to the Cloudflare network.

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zeidalqadri/mndkrm.trvl)