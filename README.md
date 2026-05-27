# 🗓️ DayOnes — Megaplan README

> **Repo:** https://github.com/kevincoj/DayOnes
> **Course:** CS 35L, Spring 2026

---

## Table of Contents

1. [What Is DayOnes?](#1-what-is-dayones)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Feature Commitments & User Stories](#4-feature-commitments--user-stories)
5. [Database Schema (Draft)](#5-database-schema-draft)
6. [API Routes (Draft)](#6-api-routes-draft)
7. [Pages & UI Structure](#7-pages--ui-structure)
8. [Milestones & Timeline](#8-milestones--timeline)
9. [Rubric Coverage Checklist](#9-rubric-coverage-checklist)
10. [How to Run Locally](#10-how-to-run-locally)
11. [Testing Plan](#11-testing-plan)
12. [Open Questions & Decisions Log](#12-open-questions--decisions-log)

---

## 1. What Is DayOnes?

DayOnes is a **habit-formation web app** that goes beyond simple streak tracking. It helps users build positive routines and break negative ones by:

- Providing **relapse prevention** through if-then obstacle planning and micro-versions of habits
- Adding a **social layer** — accountability partners, shared habits, and a live feed of progress posts
- Showing **meaningful progress** through streak tracking and completion stats so users can see how far they've come

The core insight: most habit apps track whether you did the thing. DayOnes helps you figure out *when you won't* — and plans for it in advance.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React (Vite) | Component-based UI, fast iteration |
| Backend | Node.js + Express | Full control over API logic; satisfies "significant server code" rubric requirement |
| Database | PostgreSQL | Relational data fits our habit/user/partner model well |
| Auth | JWT (JSON Web Tokens) | Stateless, easy to implement, satisfies rubric security requirement |
| ORM | Prisma | Schema-as-code, readable migrations, integrates cleanly with Postgres |
| Styling | Tailwind CSS | Rapid UI development |
| Testing | Playwright (E2E) | Satisfies rubric requirement for 2+ automated end-to-end tests |
| Charts | Recharts | Simple React-native chart library; powers the progress dashboard |
| Hosting | Render | Free tier; frontend static site + Express web service + Postgres DB, deploys from GitHub |
| Version Control | Git + GitHub | Required; meaningful commit history per rubric |

**Why not Firebase/Supabase?** The rubric requires significant code executed on *both* client and server. A BaaS-heavy approach risks the server side being just SDK calls. Node/Express gives us clear, gradeable server-side logic.

---

## 3. Architecture Overview

> Two architecture diagrams are required by the rubric. These will be added to the repo and referenced here. Described below are the two diagrams we plan to produce.

### Diagram 1 — System Architecture

```
┌─────────────────────────────────────────────┐
│                  CLIENT                      │
│           React App (Vite)                   │
│  Pages: Home, Feed, Habit Creation,          │
│         Progress, Settings, Partner View     │
└────────────────────┬────────────────────────┘
                     │ HTTP (REST API)
                     │ JSON payloads
                     ▼
┌─────────────────────────────────────────────┐
│                  SERVER                      │
│           Node.js + Express                  │
│  Routes: /auth, /habits, /logs,              │
│           /posts, /partners, /search         │
│  Middleware: JWT auth, input validation      │
└────────────────────┬────────────────────────┘
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────┐
│                 DATABASE                     │
│              PostgreSQL                      │
│  Tables: users, habits, habit_logs,          │
│          posts, partners, notifications      │
└─────────────────────────────────────────────┘
```

### Diagram 2 — Entity Relationship Diagram (ER)

To be rendered as a proper ER diagram in the repo. Core entities and relationships:

- **User** → has many **Habits**
- **Habit** → has many **HabitLogs** (one per day completed)
- **Habit** → has many **Posts** (completion posts to the feed)
- **User** → has many **AccountabilityPartners** (join table: user_id, partner_id)
- **Post** → belongs to **User**, optionally belongs to **Habit**
- **Notification** → belongs to **User**

---

## 4. Feature Commitments & User Stories

### Committed Features (Must Ship)

| # | User Story | Milestone | Rubric Mapping |
|---|---|---|---|
| US1 | Select goals & preferences | M1 | Dynamic data, upload |
| US2 | View daily tasks | M1 | Dynamic data display |
| US3 | Mark tasks as complete (< 5 sec) | M1 | Upload to backend |
| US4 | Log a missed day with reason | M2 | Upload, creative feature (obstacle planning) |
| US5 | Set habit reminders / notifications | M2 | Creative feature |
| US6 | Modify habit plan | M2 | Upload to backend |
| US7 | Social feed (post on completion, visibility controls) | M2 | Social aspect, creative feature |
| US8 | Invite an accountability partner | M3 | Social aspect, upload |
| US9 | View streak & progress stats dashboard | M3 | Dynamic data, creative feature |

### Committed Social Features (Core Differentiator)

- **Social feed** — completion posts visible to friends/partners
- **Post visibility control** — private / friends / group
- **Social mode on habits** — Private, Shared (cooperative), or Competitive

### Rubric-Required Features (Explicitly Tracked)

- **Auth** — login / signup with JWT
- **Search** — search habits by name/category; search feed posts
- **Dynamic data display** — feed, dashboard, progress stats all fetched from server
- **Upload from client** — habit creation, log completion, post creation
- **2+ E2E tests** — planned from day one (see Testing Plan)
- **2+ architecture diagrams** — ER diagram + system architecture (see Section 3)

### Stretch Goals (Ship If Time Allows)

| # | User Story |
|---|---|
| US10 | Visibility settings for partner view |
| US11 | Monthly progress report |
| US12 | Group challenge with leaderboard |

---

## 5. Database Schema (Draft)

```sql
-- Users
users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  username    VARCHAR UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
)

-- Habits
habits (
  id              SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(id),
  name            VARCHAR NOT NULL,
  description     TEXT,
  trigger_cue     TEXT,           -- "After I [blank]..."
  micro_version   TEXT,           -- "If busy, I'll at least [blank]..."
  obstacle_plan   TEXT,           -- "If [obstacle], then [alternative]..."
  social_mode     VARCHAR,        -- 'private' | 'shared' | 'competitive'
  frequency       VARCHAR,        -- 'daily' | 'weekly' | custom
  duration_weeks  INT,
  reward          TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
)

-- Daily Logs
habit_logs (
  id          SERIAL PRIMARY KEY,
  habit_id    INT REFERENCES habits(id),
  user_id     INT REFERENCES users(id),
  date        DATE NOT NULL,
  completed   BOOLEAN NOT NULL,
  missed_reason TEXT,             -- filled on miss
  created_at  TIMESTAMP DEFAULT NOW()
)

-- Feed Posts
posts (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  habit_id    INT REFERENCES habits(id),
  content     TEXT,
  visibility  VARCHAR,            -- 'private' | 'friends' | 'group'
  created_at  TIMESTAMP DEFAULT NOW()
)

-- Accountability Partners (self-referencing join table)
partners (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  partner_id  INT REFERENCES users(id),
  status      VARCHAR,            -- 'pending' | 'accepted' | 'revoked'
  created_at  TIMESTAMP DEFAULT NOW()
)

-- Notifications
notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  type        VARCHAR,            -- 'reminder' | 'partner_update' | 'milestone'
  message     TEXT,
  read        BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
)
```

---

## 6. API Routes (Draft)

### Auth
```
POST   /api/auth/register       Create new user
POST   /api/auth/login          Returns JWT
POST   /api/auth/logout
```

### Habits
```
GET    /api/habits              Get all habits for current user
POST   /api/habits              Create new habit
GET    /api/habits/:id          Get single habit
PUT    /api/habits/:id          Update habit
DELETE /api/habits/:id          Soft delete habit
GET    /api/habits/search?q=    Search habits by name/category  ← satisfies rubric search requirement
```

### Habit Logs
```
GET    /api/logs?date=          Get logs for a given date
POST   /api/logs                Mark habit complete or log a miss
PUT    /api/logs/:id            Update a log entry
```

### Posts (Social Feed)
```
GET    /api/posts               Get feed (filtered by visibility/partner status)
POST   /api/posts               Create a completion post
DELETE /api/posts/:id           Delete own post
GET    /api/posts/search?q=     Search posts  ← secondary search surface
```

### Partners
```
POST   /api/partners/invite     Send partner invite (by email or link)
PUT    /api/partners/:id/accept Accept invite
DELETE /api/partners/:id        Revoke partner access
GET    /api/partners            List current partners
GET    /api/partners/:id/habits View partner's shared habit data
```

### Notifications
```
GET    /api/notifications       Get all notifications for user
PUT    /api/notifications/:id   Mark as read
POST   /api/notifications       Create/schedule a reminder
```

---

## 7. Pages & UI Structure

```
/login                    Login page
/register                 Sign-up + goal/preference onboarding

/home (Dashboard)
  └── Today's habit list (check off tasks)
  └── Quick-log a miss

/habits
  └── All habits overview
  └── /habits/new         Habit creation wizard (7-step form)
  └── /habits/:id         Single habit detail + edit

/feed                     Social feed (posts from partners + self)

/progress                 Monthly stats, streaks, completion rates

/partners
  └── Invite / manage accountability partners
  └── /partners/:id       View a partner's shared habits

/settings
  └── Goals & preferences
  └── Notification schedule + quiet hours
  └── Partner visibility controls
  └── Account info

/search?q=                Search habits or posts
```

### Habit Creation Wizard (7 Steps)
1. **Name & Description**
2. **Frequency & Duration** (daily / weekly / X times per week)
3. **The Trigger** — "After I [blank]..."
4. **The Micro-Version** — "If I'm busy, I'll at least [blank]..."
5. **The Obstacle Plan** — "If [obstacle], then [alternative]..."
6. **Social Mode** — Private / Shared / Competitive
7. **The Reward** — "When I hit a 30-day streak, I will [blank]..."

---

## 8. Milestones & Timeline

### Milestone 1 — Core Tracking Loop (~Week 5)
**Goal:** A working app a user can interact with end-to-end.

- [ ] Project scaffolded (React frontend + Express backend + Postgres connected)
- [ ] Auth working (register, login, JWT middleware)
- [ ] Habit creation (7-step wizard, saves to DB)
- [ ] Daily task view (fetch & display today's habits)
- [ ] Mark complete / log miss (< 5 second interaction)
- [ ] Basic home dashboard

*Covers: US1, US2, US3*

### Milestone 2 — Relapse Prevention & Social Foundation (~Week 7)
**Goal:** App is meaningfully differentiated from a basic habit tracker.

- [ ] Obstacle/if-then planning displayed and editable on habit detail page
- [ ] Encouraging message + micro-version suggestion shown on missed day log
- [ ] Notifications / reminders (schedule per habit, quiet hours)
- [ ] Modify habit plan (add/remove/edit tasks)
- [ ] Feed page (post to feed on completion, visibility controls)
- [ ] Search (habits by name/category, posts in feed)
- [ ] Partner invite + accept flow (basic)

*Covers: US4, US5, US6, US7*

### Milestone 3 — Polish, Social Completion & Rubric Hardening (~Week 9)
**Goal:** App is complete and rubric requirements fully evidenced.

- [ ] Accountability partner view (partner can see shared habits)
- [ ] Partner visibility settings
- [ ] Progress page (completion rates, streaks, most-missed habit)
- [ ] 2+ E2E tests passing (Playwright)
- [ ] 2 architecture diagrams finalized and in repo
- [ ] README "How to Run Locally" finalized
- [ ] UI polish pass — visually pleasing, easy to navigate
- [ ] Edge case fixes
- [ ] Stretch: Monthly progress report (US11)
- [ ] Stretch: Group challenge leaderboard (US12)

*Covers: US8, US9, all rubric checklist items*

---

## 9. Rubric Coverage Checklist

| Rubric Requirement | Points | Our Plan | Status |
|---|---|---|---|
| App displays dynamic data | 50 | Dashboard, feed, progress stats fetched from server | 🔲 |
| App uploads data client → backend | 50 | Habit creation, log completion, posts | 🔲 |
| Security / authentication | 50 | JWT auth on all protected routes | 🔲 |
| Meaningful search through server data | 50 | `/api/habits/search` + feed search | 🔲 |
| 3 distinct creative features | 150 | Obstacle/if-then planning, social feed, streak & progress dashboard | 🔲 |
| Meaningful Git usage | 100 | Feature branches, meaningful commit messages, PRs | 🔲 |
| Detailed README (how to run locally) | 50 | Section 10 of this doc | 🔲 |
| Visually pleasing & easy to navigate | 50 | Tailwind + polish pass in M3 | 🔲 |
| Code readability | 100 | Meaningful names, modular structure, ESLint | 🔲 |
| 2+ architecture diagrams in README | 100 | System architecture + ER diagram | 🔲 |
| 2+ automated E2E tests | 50 | Playwright (auth flow + habit creation flow) | 🔲 |
| Significant code on client AND server | FAIL if not | Express routes + React components both non-trivial | 🔲 |

---

## 10. How to Run Locally

> This section will be finalized by Milestone 3. Below is the intended setup flow.

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- npm or yarn

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/kevincoj/DayOnes.git
cd DayOnes

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Set up environment variables
# In /server, create a .env file:
cp server/.env.example server/.env
# Fill in: DATABASE_URL, JWT_SECRET

# 4. Set up the database
cd server
npx prisma migrate dev

# 5. Run the app
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev

# App will be available at http://localhost:5173
```

---

## 11. Testing Plan

The rubric requires **2+ fully automated end-to-end tests**. We will use **Playwright**.

### Planned E2E Tests

**Test 1 — Auth Flow**
1. Navigate to `/register`
2. Fill in email, password, username
3. Submit → assert redirect to `/home`
4. Log out → assert redirect to `/login`
5. Log in with same credentials → assert redirect to `/home`

**Test 2 — Habit Creation & Completion**
1. Log in as test user
2. Navigate to `/habits/new`
3. Complete the 7-step wizard with test data
4. Assert habit appears on `/home` dashboard
5. Check off the habit → assert completion logged (UI updates, DB confirmed via API call)

**Stretch Test 3 — Partner Invite Flow**
1. Log in as User A
2. Send partner invite to User B's email
3. Log in as User B
4. Accept the invite
5. Assert User A's shared habits are visible to User B

Tests will live in `/tests/` and run via `npm run test:e2e`.

---

## 12. Open Questions & Decisions Log

| # | Question | Decision | Date |
|---|---|---|---|
| 1 | Tech stack | React + Node/Express + PostgreSQL + Prisma | 2026-05-14 |
| 2 | Auth strategy | JWT (stateless) | 2026-05-14 |
| 3 | Styling | Tailwind CSS | 2026-05-14 |
| 4 | E2E testing framework | Playwright | 2026-05-14 |
| 5 | Feature scope | US1–9 committed; stretch: monthly report, group leaderboard | 2026-05-14 |
| 6 | Team structure | Both members full-stack; divide by feature, not layer | 2026-05-14 |
| 7 | 3 creative features | Obstacle/if-then planning, social feed, streak & stats dashboard | 2026-05-14 |
| 8 | Class schedule sync | Dropped — too complex, low rubric payoff | 2026-05-14 |
| 9 | Personalized plan generation | Dropped — too complex, replaced by stats dashboard | 2026-05-14 |
| 10 | Hosting/deployment | Render — frontend as static site, backend as web service, Postgres DB (all free tier, deploys from GitHub) | 2026-05-14 |
| 11 | Notification delivery mechanism | In-app only — bell icon in nav, unread count badge, dropdown list; reminders surfaced by querying scheduled_at on page load | 2026-05-14 |
