# AGENTS.md — Developer & AI Agent Guidelines

This document provides operational specifications, architectural context, and invariant rules for autonomous AI coding agents and human developers contributing to this repository.

---

## 1. System & Clinical Domain Context

- **System**: National Children's Hospital — PCOS Ultrasound Clinical Decision Support System.
- **Clinical Mission**: Assist clinicians, radiologists, and sonographers in identifying Polycystic Ovary Syndrome (PCOS) from transvaginal and pelvic ultrasound scan imagery using deep learning classification and explainable Grad-CAM heatmaps.
- **Role-Based Access Control (RBAC)**:
  - **`admin`** (`/admin/*`): Staff user provisioning, account activations/deactivations, and role assignment.
  - **`doctor`** (`/doctor/*`): Patient registration, ultrasound image upload, ML diagnostic inference triggering, clinician diagnostic review, clinical notes recording, and branded PDF report generation.
  - **`patient`** (`/patient/*`): Secure patient portal to inspect confirmed diagnostic findings, ultrasound scans, doctor notes, and downloadable PDF reports.

---

## 2. Architecture & Technical Stack

- **Frontend & Web API**:
  - Next.js 16 (App Router, Turbopack)
  - React 19
  - TypeScript 5.9 (Strict mode enabled)
  - Tailwind CSS v4 with Radix UI component primitives
  - Server Actions validated via `next-safe-action` (`src/lib/actions.ts`)
  - Data Access Layer (`src/lib/dal.ts`)
- **Machine Learning Backend**:
  - Python 3.10+ Flask microservice (`index.py`)
  - TensorFlow MobileNetV2 architecture (`MobileNetModelPCOS.h5`)
  - OpenCV Grad-CAM heatmap visualization
  - Local service runs on `http://127.0.0.1:5000/api/`, proxied in Next.js development via `/flask-api/:path*`
- **Database & Persistence**:
  - PostgreSQL (Neon / Vercel Postgres)
  - Drizzle ORM with TypeScript schema definitions (`src/lib/db-schema.ts`, `drizzle-kit`)
- **Asset Storage**:
  - Vercel Blob (`@vercel/blob`) for raw ultrasound scans and generated Grad-CAM heatmap overlays
- **Authentication & Security**:
  - Encrypted JWT session cookies (`jose`)
  - Password hashing with `bcrypt`
  - Token-based secure password reset workflows (`passwordResetTokens`)

---

## 3. Critical Agent Constraints & Invariants

All agents must strictly obey the following rules:

1. **Commit Message Length Limitation (`header-max-length`)**:
   - The repository configures Conventional Commits with a strict limit:
     `"header-max-length": [2, "always", 49]`
   - **Subject lines MUST be under 50 characters (49 characters max)**.
   - Any commit message subject >= 50 characters will fail commitlint and pre-commit hooks.
   - Example compliant messages:
     - `docs: create AGENTS.md developer guide` (39 chars)
     - `fix: validate ultrasound scan file type` (41 chars)

2. **Package Manager**:
   - **Always use `bun`** (`bun install`, `bun run dev`, `bun run lint`, `bun run format`, `bun x ...`).
   - **Never run `npm` or `yarn`** for installation or script execution.

3. **Multi-Tenant Data Scoping & Isolation**:
   - Every database query in `src/lib/dal.ts` and mutation in `src/lib/actions.ts` must enforce tenant and role isolation (`user_id`, `doctor_id`, or `patient_id`).
   - Never return un-scoped cross-tenant clinical or personal health information.

4. **Diagnostic Ground Truth**:
   - Diagnostic outputs in the `results` table (`diagnosis`, `percentage`, `status`) must never be mocked, fabricated, or randomized at runtime.
   - Clinical safety requires genuine inference from the ML microservice followed by clinician review.

5. **Secrets & Environment Safety**:
   - Never commit or log `.env` values, JWT secrets, database connection strings, or cloud storage tokens.

---

## 4. Key Commands & Verification Gates

Run these commands using `bun`:

| Command                  | Purpose                                                 |
| :----------------------- | :------------------------------------------------------ |
| `bun x tsc --noEmit`     | Typecheck TypeScript codebase                           |
| `bun run lint`           | ESLint lint check                                       |
| `bun run format`         | Prettier code formatting                                |
| `bun run dev`            | Launch Next.js dev server & Drizzle Studio concurrently |
| `python index.py`        | Start Flask ML inference backend (port 5000)            |
| `bun run drizzle:studio` | Open Drizzle Studio database viewer (port 4983)         |
| `bun run drizzle:push`   | Push schema migrations to PostgreSQL                    |

---

## 5. Repository Directory Map

```
├── src/
│   ├── app/                 # Next.js App Router routes segregated by role
│   │   ├── (auth)/          # Authentication routes (login, register, forgot-password)
│   │   ├── admin/           # Administrator dashboard & user management
│   │   ├── doctor/          # Doctor clinical workflow & scan evaluation
│   │   ├── patient/         # Patient portal for report inspection
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   └── ui/              # Radix UI and shared UI components
│   └── lib/                 # Core domain logic, DAL, and infrastructure
│       ├── actions.ts       # Validated Next.js Server Actions
│       ├── dal.ts           # Data Access Layer with tenant scoping
│       ├── db-schema.ts     # Drizzle ORM PostgreSQL schema
│       ├── email.ts         # Transactional email service (Nodemailer)
│       └── session.ts       # JWT session creation and validation
├── index.py                 # Python Flask ML inference microservice
├── MobileNetModelPCOS.h5    # Pre-trained MobileNetV2 PCOS classification model
├── plans/                   # Implementation plans generated by /improve
├── requirements.txt         # Python dependencies for ML microservice
└── AGENTS.md                # This specification
```
