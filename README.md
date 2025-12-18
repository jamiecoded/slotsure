# SlotSure  
### Proactive No-Show Prevention for Clinics

![React](https://img.shields.io/badge/React-blue)
![Supabase](https://img.shields.io/badge/Supabase-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![RLS](https://img.shields.io/badge/Security-RLS-critical)

---

## What it does
**SlotSure prevents appointment no-shows before they happen.**

Instead of reacting after a slot is wasted, the system:
- Flags risky appointments in advance
- Forces patient confirmation or cancellation
- Recovers cancelled slots using a waitlist

Built with real clinic workflows in mind.

---

## Why it’s different
Most scheduling apps are CRUD. SlotSure adds **business intelligence**:

- ⏱ **Time-based risk detection** (`at_risk` appointments)
- 🔗 **Public patient confirmation links** (no login)
- 🔄 **Slot recovery suggestions** from a waitlist
- 🔐 **Database-enforced rules** (not just UI logic)

---

## Key features
- Appointment lifecycle with explicit state machine  
  `scheduled → confirmed → completed / cancelled`
- Automatic **at-risk detection** (within 24h, unconfirmed)
- Secure token-based confirmation (public, no auth)
- Waitlist-driven slot recovery
- Double booking prevented at **database level**
- Multi-tenant safe via **Row Level Security (RLS)**

---

## How to test (2 minutes)
1. Log in as a clinic
2. Create an appointment within 24 hours
3. See it marked **at_risk**
4. Copy confirmation link → open in incognito
5. Confirm or cancel
6. Refresh dashboard → status updates
7. Cancel an appointment with waitlist match → recovery suggested

---

## Tech stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase, PostgreSQL
- **Security:** Row Level Security (RLS)
- **Concepts:** State machines, time-based logic, DB constraints

---

## Demo
👉 https://slotsure-demo.vercel.app *(replace with live link)*

---

## Interview summary
> “A no-show prevention system that proactively flags risky appointments, forces patient intent confirmation, and recovers cancelled slots — all enforced at the database level.”

---

**Author:** James  
Full-Stack Developer
---

⭐ If you found this project interesting, feel free to star the repo.
