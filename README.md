# SlotSure ⏱️  
**Smarter bookings. Fewer gaps.**

![React](https://img.shields.io/badge/React-blue)
![Supabase](https://img.shields.io/badge/Supabase-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![RLS](https://img.shields.io/badge/Security-RLS-critical)

A production-ready appointment management system designed to **reduce no-shows**, **recover cancelled slots**, and **increase revenue** for clinics and service businesses.

🔗 **Live Demo:** [SlotSure](https://slotsure.vercel.app)  
📦 **Repository:** [SlotSure-Repo](https://github.com/jamiecoded/slotsure)

**Test Credentials:**
```
email: test@clinic.com
password: 123
```
---

## 🚀 What Problem It Solves

Missed appointments and late cancellations create empty slots that businesses can’t recover.

**SlotSure fixes this by:**
- Confirming appointments via secure links
- Detecting at-risk bookings
- Automatically filling cancelled slots from a waitlist

This is not a UI demo — it’s a **real operational workflow**.

---

## ✨ Key Features

### 🗓️ Appointment Lifecycle
- Create appointments with unique time-slot enforcement
- Status flow: `scheduled → confirmed → completed / cancelled`
- Token-based public confirmation & cancellation

### ⚠️ No-Show Prevention
- At-risk appointment handling
- Confirmation via secure public links

### 🔁 Slot Recovery Engine
- Waitlist system for fully booked times
- One-click recovery when a slot opens
- Automatic removal from waitlist after booking

### 🧑‍⚕️ Admin Dashboard
- Real-time appointment management
- Copyable confirmation links
- Modern UI with smooth transitions

### 🔐 Security & Data Integrity
- Supabase authentication
- Row Level Security (RLS)
- Database-level slot uniqueness
- Safe public routes (token-based, no auth leakage)

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router

**Backend**
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)

**Deployment**
- Vercel (SPA routing configured)

---

## 🧠 Engineering Highlights

- Database constraints prevent double bookings
- Idempotent slot recovery logic
- Public confirmation routes without exposing sensitive data
- Clean separation of admin and public flows
- Built with real production edge cases in mind

---

## 📈 Why This Project Stands Out

- Solves a **real business problem**
- Demonstrates **full-stack ownership**
- Handles edge cases and failure states
- Production-deployed and tested
- Designed for scalability

This is a system clinics could actually use — not a CRUD demo.

---

## 🧪 Local Setup

```
git clone https://github.com/jamiecoded/slotsure.git
cd slotsure
npm install
npm run dev
```
---

**Create a .env file:**
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 🔮 Future Enhancements (Optional)
- Email / SMS reminders
- Analytics dashboard (no-show %, recovered revenue)
- Multi-clinic support
- Calendar integrations
- Payments

---

## 👨‍💻 Author
**James**
Full-Stack Developer
🔗 https://github.com/jamiecoded