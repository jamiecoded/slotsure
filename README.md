# SlotSure  
### Proactive No-Show Prevention & Slot Recovery System for Clinics

![React](https://img.shields.io/badge/Frontend-React-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Security](https://img.shields.io/badge/Security-Row%20Level%20Security-critical)
![Status](https://img.shields.io/badge/Project-Production--ready-brightgreen)

---

## 🚀 What is SlotSure?

**SlotSure** is a production-oriented scheduling system designed to **prevent appointment no-shows before they happen** and **recover cancelled slots using a waitlist**.

Instead of reacting after revenue is lost, SlotSure introduces **time-based risk detection, forced patient intent confirmation, and intelligent slot recovery** — all enforced with database-level guarantees.

This project prioritizes **real-world business logic, security, and data integrity**, not just CRUD functionality.

---

## 🎯 Problem Statement

Clinics and service businesses lose revenue due to:
- Patients not showing up
- Late cancellations
- Empty appointment slots
- Manual follow-ups that don’t scale

Most scheduling systems are **reactive** — they log failures after the damage is done.

---

## ✅ Solution Overview

SlotSure is **proactive**:

1. Appointments start unconfirmed
2. Time-based logic flags risky appointments
3. Patients must explicitly confirm or cancel
4. Cancelled slots are matched against a waitlist
5. Clinics recover slots before they go unused

All rules are enforced at both the **application layer** and the **database layer**.

---

## 🧠 Core Features (Implemented)

### 🔐 Authentication & Security
- Supabase authentication with persistent sessions
- Row Level Security (RLS) on all tables
- Multi-tenant safe: each clinic only sees its own data
- Token-based public access for patient confirmations

---

### 📅 Appointment Lifecycle Management
- Create appointments with validation
- Prevent double booking using a **database-level unique constraint**
- Explicit state machine:
  - scheduled → confirmed → completed
  - scheduled → cancelled
  - scheduled → at_risk → confirmed / cancelled


Invalid transitions are blocked in both UI and database policies.

---

### ⏱️ No-Show Risk Detection
- Appointments within **24 hours** that remain unconfirmed are automatically marked **`at_risk`**
- Visual indicators highlight risk for clinic staff
- Time-zone safe (UTC-based storage)

---

### 🔗 Patient Confirmation (No Login Required)
- Secure, token-based confirmation links
- Patients can:
  - Confirm appointment
  - Cancel appointment
- No authentication required
- Public access is strictly limited via RLS policies

---

### 📋 Waitlist System
- Internal clinic waitlist
- Secure (authenticated users only)
- Designed specifically for slot recovery

---

### 🔄 Slot Recovery Logic
- When an appointment is cancelled:
  - The system checks for matching waitlist entries
  - Suggests the earliest candidate for that time slot
- Prevents silent loss of cancelled appointments
- Manual promotion keeps clinics in control

---

## 🧪 How to Test (2-Minute Demo Flow)

### Demo Steps
1. Log in with clinic credentials
2. Create an appointment within the next 24 hours
3. Observe it being marked **at_risk**
4. Copy the confirmation link from the dashboard
5. Open the link in an incognito window
6. Confirm or cancel the appointment
7. Refresh the dashboard — status updates instantly
8. Cancel an appointment with a matching waitlist entry
9. Slot recovery suggestion appears

No setup scripts. No assumptions.

---

## 🔗 Demo Link

**Live Demo:**  
👉 https://slotsure-demo.vercel.app *(replace with your deployed URL)*

---

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend
- Supabase
- PostgreSQL
- Row Level Security (RLS)

### Key Concepts Used
- State machines
- Time-based business rules
- Database-level constraints
- Secure public endpoints
- Multi-tenant architecture

---

## 🗂️ Database Schema (Key Tables)

### `appointments`
- `id` (UUID, PK)
- `clinic_id`
- `patient_name`
- `patient_email`
- `appointment_time`
- `status`
- `confirmation_token`
- `created_at`

### `waitlist`
- `id` (UUID, PK)
- `clinic_id`
- `patient_name`
- `patient_email`
- `desired_time`
- `created_at`

---

## 🔐 Security Model

| Role | Capabilities |
|----|----|
| Clinic (authenticated) | Full access to own data |
| Patient (anonymous) | Confirm / cancel via token only |
| Public | No access |

All access is enforced using Supabase RLS policies.

---

## 🧩 Key Design Decisions

- No double booking (single-provider MVP)
- Database rules over UI-only validation
- Explicit state transitions
- No auto-booking from waitlist (manual control preferred)
- UTC-safe timestamps

---

## 📈 Future Enhancements
- Email / SMS reminders
- Auto-promotion from waitlist
- Provider-based scheduling
- Analytics dashboard
- Cancellation thresholds

---

## 💬 Interview-Ready Summary

> “SlotSure is a no-show prevention system that proactively flags risky appointments, forces patient confirmation via secure public links, and recovers cancelled slots using a waitlist — all enforced with database-level guarantees.”

---

## 👤 Author

**James**  
Frontend / Full-Stack Developer  
Focused on building real-world, production-grade systems.

---

⭐ If you found this project interesting, feel free to star the repo.

