# National Children's Hospital — PCOS Ultrasound Clinical Decision Support System

An intelligent clinical decision support platform designed for the National Children's Hospital to assist radiologists and attending physicians in identifying Polycystic Ovary Syndrome (PCOS) from transvaginal and pelvic ultrasound scans. The system combines deep learning classification with explainable visual Grad-CAM heatmaps, physician review workflows, and a secure patient portal.

---

## Key Capabilities

- **Deep Learning Inference**: Automated binary classification (PCOS positive vs. healthy/normal) powered by a fine-tuned MobileNetV2 architecture trained on ovarian ultrasound scans.
- **Explainable AI (Grad-CAM)**: Visual gradient-weighted class activation mapping (Grad-CAM) that overlays heatmaps directly onto scans to highlight ovarian follicles and clinical regions of interest.
- **Clinician Review Workflow**: Attending physicians review automated findings, record diagnostic notes, and assign clinical statuses (`CONFIRMED`, `REJECTED`, `PENDING_REVIEW`).
- **Patient Portal**: Dedicated, secure portal allowing patients to view confirmed diagnostic evaluations, scan imagery, doctor notes, and clinical status updates.
- **Standardized Medical Reports**: Generation of branded, printable diagnostic clinical reports formatted for medical record archives.
- **Transactional Email Notifications**: Automated email delivery for report readiness alerts and secure token-based password reset workflows.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│             (Admin, Doctor, and Patient Portals)            │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP / JSON                  │
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│              Next.js 16 Application Server                  │
│       (App Router, React 19, Server Actions, Jose JWT)      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     Proxied Inference Requests               │ Drizzle ORM Queries
     (/flask-api/* -> :5000)                  │
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│    Flask ML Microservice     │ │   PostgreSQL Database      │
│   (MobileNetV2, OpenCV,      │ │ (Neon / Vercel Postgres)   │
│       TensorFlow, Grad-CAM)  │ └────────────────────────────┘
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Vercel Blob Storage     │
│   (Raw Scans & Grad-CAM)     │
└──────────────────────────────┘
```

- **Frontend & Web Services**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4, and Radix UI.
- **Machine Learning Microservice**: Python 3.10+ Flask application (`index.py`) loading `MobileNetModelPCOS.h5` and generating Grad-CAM heatmaps.
- **Database**: PostgreSQL managed via Drizzle ORM schema and migrations (`src/lib/db-schema.ts`).
- **Object Storage**: Vercel Blob (`@vercel/blob`) for raw ultrasound uploads and generated diagnostic heatmap overlays.

---

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- [Bun](https://bun.sh/) (v1.1 or later) — Primary package manager and runtime
- [Node.js](https://nodejs.org/) (v20+ LTS recommended for toolchain compatibility)
- [Python](https://www.python.org/) (v3.10+ for the Flask ML service)
- [PostgreSQL](https://www.postgresql.org/) database (local instance or cloud database such as Neon or Vercel Postgres)

---

## Local Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/joaquinvaldezzz/capstone.git
cd capstone
```

### 2. Install Frontend Dependencies

```bash
bun install
```

### 3. Set Up Python Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a local environment file from the template:

```bash
cp .env.example .env.local
```

Key environment variables:

| Variable                     | Description                                                  |
| :--------------------------- | :----------------------------------------------------------- |
| `POSTGRES_URL`               | PostgreSQL connection string (pooled or non-pooled)          |
| `JWT_SECRET`                 | Secret key used to encrypt and verify user session tokens    |
| `BLOB_READ_WRITE_TOKEN`      | Vercel Blob token for storing ultrasound images and heatmaps |
| `SMTP_HOST`, `SMTP_PORT`     | SMTP server connection settings for transactional emails     |
| `SMTP_USER`, `SMTP_PASSWORD` | Credentials for the transactional email provider             |
| `EMAIL_FROM`                 | Sender address for system notifications                      |
| `APP_URL`                    | Base application URL (e.g. `http://localhost:3000`)          |

### 5. Initialize the Database Schema

Push the Drizzle ORM schema to your PostgreSQL database:

```bash
bun run drizzle:push
```

---

## Running the Application

### 1. Start the Machine Learning Microservice

In your activated Python virtual environment:

```bash
python index.py
```

The Flask microservice will launch on `http://127.0.0.1:5000`.

### 2. Start Next.js Development Server

In a separate terminal:

```bash
bun run dev
```

This concurrently launches:

- Next.js development server at `http://localhost:3000`
- Drizzle Studio database viewer at `http://localhost:4983` (or `https://local.drizzle.studio`)

---

## Available Scripts

| Script           | Command                  | Purpose                                                     |
| :--------------- | :----------------------- | :---------------------------------------------------------- |
| `dev`            | `bun run dev`            | Runs Next.js with Turbopack and Drizzle Studio concurrently |
| `build`          | `bun run build`          | Compiles and builds Next.js production bundle               |
| `start`          | `bun run start`          | Runs the compiled Next.js production server                 |
| `lint`           | `bun run lint`           | Lints repository files using ESLint                         |
| `lint:fix`       | `bun run lint:fix`       | Automatically fixes autofixable ESLint errors               |
| `format`         | `bun run format`         | Formats codebase using Prettier                             |
| `drizzle:push`   | `bun run drizzle:push`   | Pushes Drizzle schema changes to the database               |
| `drizzle:studio` | `bun run drizzle:studio` | Launches standalone Drizzle Studio database manager         |

---

## Contributing & Agent Guidelines

- **AI Agent Specification**: Refer to [`AGENTS.md`](./AGENTS.md) for architectural guidelines, tenant isolation requirements, and operational boundaries.
- **Commit Message Constraints**: The project enforces Conventional Commits with a strict limit:
  - **Subject lines must strictly be less than 50 characters** (`header-max-length: 49`).
  - Example: `docs: modernize README and add AGENTS.md`
- **Package Manager Invariant**: All contributors and automation tools must use `bun`. Do not use `npm` or `yarn`.
