# Domain Strategy Dashboard

AI-powered domain name generator for multi-brand trading companies. Uses Google Gemini to create brandable domain names, checks availability, filters by budget, and links directly to MainReg for purchase.

## Quick Start

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_key_here

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for domain name generation |
| `MAINREG_API_KEY` | No | MainReg API key for real availability checks |
| `MAINREG_API_SECRET` | No | MainReg API secret |
| `WHOAPI_KEY` | No | WhoAPI key (fallback domain checker) |

When no domain checker API keys are configured, the app uses a mock checker that simulates availability and pricing.

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme)
│   ├── page.tsx                # Dashboard (client component)
│   ├── globals.css             # Tailwind + custom dark theme
│   └── api/generate/route.ts   # POST endpoint
├── lib/
│   ├── gemini.ts               # Gemini name generation service
│   └── domain.ts               # Domain availability checker (modular)
└── components/
    ├── SearchForm.tsx           # Input form
    ├── ResultsTable.tsx         # Results table with filtering
    ├── StatusBadge.tsx          # Available/Taken badge
    └── BuyButton.tsx            # MainReg deep-link button
```

### Data Flow

1. User fills in target audience, keywords, TLD, language, and budget
2. Client POSTs to `/api/generate`
3. Server calls Gemini 1.5 Flash to generate 20 domain names
4. Server checks each domain via the configured `DomainService` checker
5. Client receives results and filters by budget
6. "Buy Now" opens MainReg with the domain pre-filled

### Domain Checker Strategy

The `DomainService` class uses a strategy pattern to select the checker:

- **`MockDomainChecker`** (default) - deterministic simulation for development
- **`MainRegChecker`** (stub) - activated when `MAINREG_API_KEY` is set
- **`WhoAPIChecker`** (stub) - activated when `WHOAPI_KEY` is set

To integrate a real checker, implement the `IDomainChecker` interface:

```typescript
interface IDomainChecker {
  check(domain: string): Promise<{
    domain: string;
    available: boolean;
    price: number;
    currency: string;
  }>;
}
```

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **TypeScript**
- **@google/generative-ai** (Gemini 1.5 Flash)

## Supported Languages

English, French, German, Spanish, Arabic, Portuguese, Italian, Dutch, Japanese. Each language adjusts the Gemini prompt to generate culturally relevant brand names.
