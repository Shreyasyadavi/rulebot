# RuleBot — Rule-Based Assistant

A portfolio-grade, deterministic rule-based conversational assistant built with a Python rule engine, FastAPI/Express backend architecture, and a modern React + TypeScript interface.

---

## 1. Project Overview

**RuleBot** was developed as part of the **CodeOrbit AI/ML Internship** (Rule-Based Chatbot Task). It demonstrates an end-to-end, enterprise-ready deterministic chatbot architecture that processes user queries with exact, pattern, and keyword matching algorithms without relying on opaque black-box models.

### Key Highlights
- **Deterministic Python Rule Engine**: All conversational rules, patterns, priorities, and responses are executed via a dedicated Python rule engine.
- **55 Predefined Intents**: Spanning 7 distinct domains including Greetings, Python Programming, AI & Machine Learning, Data Science, Web Development, General Tech, and Conversational dialogue.
- **Multi-Strategy Rule Matching**: Evaluates input strings through exact string comparison, regex pattern matching, and tokenized keyword scoring.
- **Controlled Local Fallback**: When an unrecognized question is asked, RuleBot generates a deterministic local fallback response.
- **Gemini Status**: Gemini API integration is **intentionally disabled** in the current release to keep the chatbot strictly deterministic and self-contained.

---

## 2. Features

- **Deterministic Conversational Chat**: Fast, reliable responses with message streaming states, timestamps, response source tags, and retry capability.
- **55 Predefined Rule Catalog**: Fully categorized intent library with search, category filtering, and a slide-out intent inspector showing regex patterns and sample responses.
- **Real-Time RuleBot Logic Inspector**: A live telemetry HUD attached to the chat workspace displaying the matched intent, matching strategy, confidence rating (0–99%), session ID, and active 4-stage pipeline execution step.
- **4-Stage Rule Processing Pipeline**: Visualizes request lifecycle from `Input Received` &rarr; `Intent Matching` &rarr; `Logic Execution` &rarr; `Response Delivery`.
- **Local Analytics Dashboard**: Displays session metrics, total messages, rule match vs. fallback rates, Recharts-powered response distributions, top matched intents, and daily activity timeline based on real conversation logs.
- **Conversation History Catalog**: Chronological session logs with search, filtering by match status (`ALL`, `RESOLVED`, `FALLBACK`), transcript viewing modal, and a confirmed history wipe dialog.
- **Local Settings & Preferences**: Custom bot display name, persona description, response style selector (`Formal`, `Friendly`, `Concise`), session memory toggle, data retention policies (`Keep All`, `30 Days`, `7 Days`, `Session Only`), chat density (`Comfortable` vs `Compact`), logic inspector toggle, and default reset dialog.
- **Theme System**: Stitch dark-first interface with full support for Light, Dark, and System color schemes, persisting across browser sessions.
- **Accessibility & Responsive Design**: Keyboard-navigable controls (`Escape` to close modals, `Tab` order, visible focus rings), ARIA semantics, and fluid layouts for desktop, tablet, and mobile devices.

---

## 3. Rule Processing Architecture

### Supported Input Flow
```
User Input
    │
    ▼
Input Normalization (lowercase, strip punctuation, tokenization)
    │
    ▼
Rule Engine Matching (Exact Match ➔ Regex Pattern ➔ Keyword Scoring)
    │
    ▼
Deterministic Response Selection (based on priority & confidence)
    │
    ▼
Response Delivery with Telemetry Metadata (intent, confidence, matchType)
```

### Unmatched Fallback Flow
```
User Input
    │
    ▼
Rule Matching (no rules satisfy threshold)
    │
    ▼
Controlled Local Fallback Generator
    │
    ▼
Response Delivery (responseType="fallback", confidence=0.0, intent=null)
```

*Note: Gemini and external LLM services are NOT called.*

---

## 4. Technology Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **Visualizations**: Recharts

### Backend & Server
- **Server**: Node.js with Express & TSX (Development & API Gateway)
- **Engine**: Python 3.10+
- **API Framework**: FastAPI, Pydantic v2, Uvicorn
- **Bundler**: esbuild (Production CommonJS server compilation)

---

## 5. Project Structure

```
.
├── backend/                        # Python Rule Engine & FastAPI Service
│   ├── app/
│   │   ├── chatbot/
│   │   │   ├── engine.py           # Core RuleEngine matcher & tokenizer
│   │   │   ├── fallback.py         # Local fallback generator
│   │   │   ├── rules.py            # 55 Predefined rule definitions
│   │   │   └── runner.py           # CLI execution bridge
│   │   ├── routes/
│   │   │   └── chat.py             # FastAPI chat route handlers
│   │   ├── main.py                 # FastAPI application entry
│   │   └── schemas.py              # Pydantic request/response models
│   ├── tests/                      # Pytest unit tests for engine & API
│   └── requirements.txt            # Python dependencies
├── src/                            # Frontend Application (React + TypeScript)
│   ├── components/
│   │   ├── analytics/              # Analytics metric cards, charts & tables
│   │   ├── chat/                   # Message list, input box & badges
│   │   ├── history/                # History session cards, modals & filters
│   │   ├── inspector/              # Live Logic Inspector HUD & pipeline stepper
│   │   ├── intents/                # Intent catalog grid, filters & detail drawer
│   │   ├── layout/                 # Sidebar navigation & app header
│   │   └── settings/               # Settings form controls & reset dialog
│   ├── hooks/                      # Custom hooks (useChat, useSettings, etc.)
│   ├── pages/                      # 5 Main workspace views
│   │   ├── Chat.tsx
│   │   ├── Intents.tsx
│   │   ├── Analytics.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── services/                   # Client-side API & LocalStorage persistence
│   ├── types/                      # TypeScript shared interfaces
│   ├── App.tsx                     # Main application routing & theme state
│   └── main.tsx                    # React DOM root entry
├── server.ts                       # Express backend server & Vite middleware
├── package.json                    # Node dependencies and build scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── metadata.json                   # Application metadata
```

---

## 6. Application Views

The application provides exactly five dedicated workspace views without external authentication, sign-out barriers, or unnecessary sub-pages:

1. **Chat (`/`)**: Main conversation interface with real-time response generation, message badge metadata, and the live Logic Inspector.
2. **Intents (`/intents`)**: Catalog of all 55 predefined rules with category filters, search bar, keyword badges, and rule inspection side panel.
3. **Analytics (`/analytics`)**: Operational dashboard calculating Rule Match Rate %, Fallback Rate %, message counts, response breakdown charts, and top matched intents.
4. **History (`/history`)**: Searchable archive of prior conversations with transcript details, status pills, and history deletion tools.
5. **Settings (`/settings`)**: Local workspace configuration for appearance themes, bot persona, retention limits, density, inspector visibility, and default resets.

---

## 7. API Endpoints

The backend exposes the following clean JSON REST endpoints:

### `GET /api/health`
Health check endpoint returning system status.
```json
{
  "status": "ok",
  "service": "RuleBot"
}
```

### `POST /api/chat`
Processes user messages through the Python rule engine.
- **Request Body**:
  ```json
  {
    "message": "What is Python?",
    "sessionId": "session-1740000000"
  }
  ```
- **Response Body**:
  ```json
  {
    "response": "Python is a high-level, interpreted, general-purpose programming language renowned for its clean syntax, readability, and vast ecosystem in AI, web backend, and data science.",
    "responseType": "rule",
    "intent": "python_definition",
    "category": "Python",
    "matchType": "exact",
    "confidence": 0.99,
    "sessionId": "session-1740000000",
    "pipelineStep": "response_delivery"
  }
  ```

### `GET /api/intents`
Retrieves all 55 predefined intent definitions and sample patterns.

### `GET /api/analytics`
Returns operational metrics and intent catalog summaries.

---

## 8. Chat Response Metadata

Every response delivered by RuleBot includes comprehensive structured metadata:

| Field | Type | Description |
| :--- | :--- | :--- |
| `response` | `string` | Predefined rule response or local fallback text |
| `responseType` | `"rule" \| "fallback"` | Indicates whether a rule matched or local fallback was triggered |
| `intent` | `string \| null` | Unique intent key (e.g. `python_definition`, `greeting_hello`) |
| `category` | `string \| null` | Intent domain category (e.g. `Python`, `Greetings`, `AI / Machine Learning`) |
| `matchType` | `"exact" \| "pattern" \| "keyword" \| "fallback"` | The matching strategy that satisfied the query |
| `confidence` | `number` | Confidence score between `0.0` and `0.99` |
| `sessionId` | `string` | Unique identifier for tracking conversational context |
| `pipelineStep` | `string` | Final stage in execution (`response_delivery`) |

---

## 9. Local Fallback Mechanism

When a user submits a query outside the 55 predefined rule domains, RuleBot gracefully catches the query without errors:
- **No external AI request is initiated**.
- **No API keys or internet dependencies are required**.
- **Example Fallback Response**:
  > *"I don't have a predefined rule for that question yet. Try asking me about Python, AI, Machine Learning, or another supported topic."*

---

## 10. Security & Privacy

- **No GEMINI_API_KEY Required**: Operates completely offline/locally without requiring external AI API keys or third-party credentials.
- **Zero Hardcoded Secrets**: All source code is clean of API keys, tokens, or private secrets.
- **Environment Isolation**: `.env` and environment variables are protected under `.gitignore`.
- **Local Storage Security**: Session history, analytics metrics, and preferences are stored purely in the client's browser (`localStorage`).

---

## 11. Installation & Setup

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **npm** or **bun**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rulebot.git
cd rulebot
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Install Python Dependencies
```bash
pip install -r backend/requirements.txt
```

---

## 12. Running the Project

### Start Development Server
Starts the Express API server and Vite client with live reloading on `http://localhost:3000`:
```bash
npm run dev
```

### Type Checking & Linting
```bash
npm run lint
```

### Build for Production
Compiles the React frontend to `dist/` and bundles `server.ts` into a standalone Node server:
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## 13. Verification & Testing

The project has undergone comprehensive end-to-end testing across 18 test suites:

- **Type Safety**: `tsc --noEmit` &rarr; **0 errors**
- **Production Build**: `vite build` &rarr; **Success**
- **Rule Matching**: All 55 intents verified for exact, pattern, and keyword triggers.
- **Fallback Verification**: Tested out-of-scope questions; confirmed zero external calls.
- **API Tests**: Verified `GET /api/health`, `POST /api/chat`, `GET /api/intents`, and `GET /api/analytics`.
- **Accessibility**: Keyboard navigation, contrast ratios, and modal focus traps validated.
- **Responsive Layout**: Verified on Mobile (<768px), Tablet (768px–1024px), and Desktop (>1280px).

---

## 14. Gemini Integration Status

> **Current Status**: **Disabled / Inactive**

Gemini integration is intentionally disabled for this release to maintain RuleBot as a standalone, deterministic rule-based assistant. While the modular architecture is designed to support an optional secondary LLM fallback in the future, **no Gemini API key or external service is required to run RuleBot**.

---

## 15. Internship Context

This application was designed and engineered as part of the **CodeOrbit AI/ML Internship** for the **Rule-Based Chatbot** task submission. It highlights fundamental natural language processing principles, deterministic state management, clean software architecture, and modern full-stack UI engineering.

---

## 16. Future Roadmap

- **Optional Cloud / LLM Fallback**: Configurable hybrid mode routing unhandled queries to Gemini.
- **Rule Management UI**: Visual builder to add, update, and test custom regex rules directly from the interface.
- **Expanded Intent Packs**: Domain-specific rule libraries for Data Engineering, DevOps, and Algorithms.
- **Database Persistence**: Optional PostgreSQL / SQLite storage for multi-user conversation history.

---

## 17. License

This project is submitted for the CodeOrbit AI/ML Internship evaluation. All rights reserved.
