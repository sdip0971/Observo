<img width="1233" height="904" alt="Screenshot 2025-12-29 at 9 20 27 PM" src="https://github.com/user-attachments/assets/464e61ee-2151-47cc-b5fb-1d9b6ce0297c" /># Observo 

**Observo** is a modern, privacy-friendly real-time analytics and observability platform. It allows you to track website traffic, capture custom events, and receive instant alerts (Discord/Telegram) when critical milestones are reached.

Built with **Next.js 16**, **Supabase**, and **Inngest**, Observo bridges the gap between simple page view tracking and complex event monitoring.
<img width="1605" height="922" alt="Screenshot 2025-12-29 at 8 29 28 PM" src="https://github.com/user-attachments/assets/d2e4c9cd-e148-4a55-a88b-bb069692979d" />


## ✨ Key Features

- **📊 Real-time Analytics**: Track page views, visitors, and sessions instantly.
- **⚡️ Lightweight Tracking**: A `< 1kb` script (`tracking-script.js`) that doesn't slow down your site.
- **🔔 Smart Alerts**: Get notified via **Discord** or **Telegram** when traffic spikes or specific events occur.
- **🔌 Easy Integration**: Simple copy-paste snippet for any HTML/JS website.
- **🛡 Privacy Focused**: No cookies required by default; respects user privacy.
- **🏗 Scalable Architecture**: Uses **Inngest** for background processing to handle high-traffic loads without blocking APIs.
  <img width="1605" height="922" alt="Screenshot 2025-12-29 at 8 33 38 PM" src="https://github.com/user-attachments/assets/5005c4fd-480d-450e-aab2-cec3dc02e194" />

<img width="1605" height="922" alt="Screenshot 2025-12-29 at 8 33 04 PM" src="https://github.com/user-attachments/assets/788a15ba-0a71-4c2f-942b-320ebe8d68d3" />
<img width="1233" height="904" alt="Screenshot 2025-12-29 at 9 20 37 PM" src="https://github.com/user-attachments/assets/dc81c063-00d2-47b0-8892-8b4d82fea097" />
<img width="1233" height="450" alt="Screenshot 2025-12-29 at 8 34 09 PM" src="https://github.com/user-attachments/assets/3cb6dfdb-0136-47fd-9730-590cfe7b27e6" />

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Queue/Jobs**: [Inngest](https://www.inngest.com/)
- **State Management**: [Jotai](https://jotai.org/)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- An [Inngest](https://www.inngest.com) account (for local dev, just the CLI is needed)

### 2. Clone the Repository

```bash
git clone [https://github.com/your-username/observo.git](https://github.com/your-username/observo.git)
cd observo
3. Install Dependencies
Bash

npm install
# or
pnpm install
4. Environment Variables
Create a .env.local file in the root directory and add the following keys:

Bash

# Supabase (Found in Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Inngest (For background jobs)
INNGEST_EVENT_KEY=local_event_key
INNGEST_SIGNING_KEY=local_signing_key
5. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor to create the required tables:

SQL

-- 1. Users Table (Managed by Supabase Auth, but we create a public profile reference if needed)
-- (Standard Supabase Auth setup is assumed)

-- 2. Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  owner_id uuid references auth.users not null,
  discord_webhook_url text,
  telegram_bot_token text,
  telegram_chat_id text,
  alerts_enabled boolean default true
);

-- 3. Sources Table (The websites you track)
create table sources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects(id) on delete cascade not null,
  name text,
  domain text not null,
  write_key text unique not null -- The key used in the script
);

-- 4. Events Table (Raw log of everything)
create table events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source_id uuid references sources(id) not null,
  type text not null, -- e.g., 'page_view', 'click'
  payload jsonb default '{}'::jsonb
);

-- 5. Page Views Table (Optimized for Analytics Charts)
create table page_views (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  domain text not null,
  page text not null,
  referrer text,
  city text,
  country text,
  browser_name text,
  device_type text,
  operating_system text
);

-- Indexes for performance
create index idx_events_source_id on events(source_id);
create index idx_page_views_domain on page_views(domain);
6. Run Development Server
You need to run both the Next.js app and the Inngest Dev Server (for processing alerts/stats).

Terminal 1 (Next.js):

Bash

npm run dev
Terminal 2 (Inngest):

Bash

npx inngest-cli@latest dev
Open http://localhost:3000 to view the app. Open http://localhost:8288 to view the Inngest dashboard.

📖 Usage Guide
1. Create a Project
Log in to the dashboard and create a new project (e.g., "My Portfolio").

2. Add a Source
Inside the project, click "Add Source". Enter your website's name and domain. This generates a unique write_key.

3. Install the Tracking Script
Copy the provided snippet into the <head> of your website:

HTML

<script 
  defer 
  data-domain="your-domain.com" 
  data-write-key="YOUR_WRITE_KEY" 
  src="[https://your-observo-instance.com/tracking-script.js](https://your-observo-instance.com/tracking-script.js)"
></script>
4. Configure Alerts
Go to Settings (or Project Details).
<img width="1605" height="922" alt="Screenshot 2025-12-29 at 8 30 32 PM" src="https://github.com/user-attachments/assets/89dce9fe-cb3a-4dff-aa0c-72e4afd12d4d" />

Paste a Discord Webhook URL to get notifications in a Discord channel.

Enable alerts to receive a message whenever your site hits a traffic milestone (e.g., every 100 views).

📡 API Reference
Ingest Endpoint
The primary endpoint used by the tracking script.

POST /api/v1/ingest

Headers:

Authorization: Bearer <WRITE_KEY> (Optional if sent in body)

Content-Type: application/json

Body:

JSON

{
  "type": "page_view",
  "write_key": "src_...",
  "payload": {
    "url": "[https://example.com/home](https://example.com/home)",
    "referrer": "[https://google.com](https://google.com)",
    "browser": "Chrome",
    "device": "Desktop"
  }
}
<img width="1605" height="922" alt="Screenshot 2025-12-29 at 8 31 35 PM" src="https://github.com/user-attachments/assets/6097858b-9fd9-4e3c-a7a6-c2e03576d630" />

📁 Project Structure
Bash

├── public/
│   └── tracking-script.js  # The client-side script loaded by websites
├── src/
│   ├── app/
│   │   ├── api/v1/ingest/  # Main data intake API
│   │   ├── dashboard/      # User dashboard
│   │   ├── project/        # Project details & settings
│   ├── components/         # Reusable UI components (Shadcn)
│   ├── inngest/            # Background job definitions
│   ├── lib/                # Utilities (Supabase client, Alert logic)
│   └── types/              # TypeScript interfaces
🤝 Contributing
Contributions are welcome! Please create a Pull Request for any bug fixes or feature requests.
