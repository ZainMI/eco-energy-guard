# Eco Energy Guard

A modern customer-facing website and internal job management system built with:

- Next.js 16
- React 19
- Tailwind CSS
- Supabase
- Zoho SMTP (currently)
- OpenStreetMap (Nominatim)
- ICS Calendar Invites

---

# Requirements

- Node.js 20+
- npm
- Git
- Supabase
- Google Cloud (Google Sign-In)
- Zoho Mail (SMTP)

---

# Installation

```bash
git clone <repo>

cd eco-energy-guard

npm install
```

---

# Environment Variables

Create

```
.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000

SMTP_HOST=smtp.zoho.com
SMTP_PORT=465

SMTP_USER=
SMTP_PASS=

EMAIL_FROM=
```

---

# Vercel Environment Variables

Add the exact same values in

```
Project

↓

Settings

↓

Environment Variables
```

Production should use

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

instead of localhost.

---

# Supabase

Create a project.

Copy

```
Project URL

Publishable Key
```

into

```
NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

# Database

Run every SQL migration that has been created during development.

Current schema includes

- users
- customers
- slots
- jobs
- job_assignments
- job_tokens

along with

- policies
- helper functions
- customer management functions
- installation scheduling functions

---

# Authentication

Uses

Supabase Authentication

↓

Google Provider

Configure Google OAuth in Supabase.

Redirect URI

```
https://YOURPROJECT.supabase.co/auth/v1/callback
```

---

# First Login

Run

```bash
npm run dev
```

Visit

```
/login
```

Sign in with Google.

Promote yourself

```sql
update users
set role='owner'
where email='YOUR_EMAIL';
```

---

# Zoho SMTP

Create mailbox

```
info@yourdomain.com
```

Enable MFA.

Generate App Password.

Use

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465

SMTP_USER=info@yourdomain.com

SMTP_PASS=<app password>

EMAIL_FROM="Eco Energy Guard <info@yourdomain.com>"
```

---

# Development Reset

Reset all jobs while keeping users.

```sql
begin;

truncate table
job_assignments,
job_tokens,
jobs,
slots,
customers
restart identity cascade;

commit;
```

---

# Current Workflow

Customer

↓

Requests Inspection

↓

Admin Review

↓

Approve

↓

Inspection Scheduled

↓

Inspection Complete

↓

Estimate Sent

↓

Customer Requests Installation Time

↓

Installation Requested

↓

Admin Reviews Installation

↓

Approve Installation

↓

Installation Scheduled

↓

Complete Job

---

# Email Flow

Inspection

Customer

- Confirmation
- ICS Calendar Invite
- Manage Appointment Link

Assigned Team

- Assignment Email
- Customer Information
- ICS Calendar Invite

Reschedule

Customer

- Reschedule Link

Assigned Team

- Notification

Cancellation

Customer

- Cancellation Email
- ICS Cancellation

Assigned Team

- Cancellation Email
- ICS Cancellation

Installation

Customer

- Estimate Email
- Installation Scheduling Link

Customer Request

- Team notified

Admin Approval

Customer

- Installation Confirmation
- ICS Invite

Assigned Team

- Installation Assignment
- ICS Invite

---

# Calendar

Uses standard

```
ICS
```

calendar invitations.

Stable UID

Sequence Numbers

Updates

Cancellations

Compatible with

- Google Calendar
- Outlook
- Apple Calendar

---

# Admin Roles

owner

- Full Access

admin

- Scheduling
- Jobs

employee

- Scheduling

estimator

- Estimates

technician

- Jobs

---

# Folder Structure

```
app/

actions/

components/

lib/
    calendar/
    customer/
    email/
    supabase/

public/
```

---

# Tech Stack

- Next.js App Router
- Server Actions
- Supabase
- PostgreSQL
- Nodemailer
- Zoho SMTP
- OpenStreetMap
- ICS Calendar Invites

No third-party scheduling platform required.
