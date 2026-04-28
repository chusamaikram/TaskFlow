# ⚡ TaskFlow

A modern, full-stack task management application built with React, Firebase, and Gemini AI. TaskFlow helps individuals and teams organize work, track progress, and stay productive with a clean, professional interface — powered by an AI assistant that understands your tasks, suggests due dates, generates daily briefings, and creates tasks from natural language. Supports both dark and light modes.

---

## 🚀 Live Demo

> Deploy URL will appear here after Vercel deployment

**Demo credentials:**
- Email: `alex@taskflow.io`
- Password: `password123`

---

## ✨ Features

### Authentication
- Email & password sign in / sign up
- Google OAuth sign in with one click
- Protected routes — unauthenticated users are redirected to login
- Guest routes — logged-in users are redirected away from login/signup
- Persistent sessions via Firebase Auth
- Full-screen branded loader during auth resolution

### Task Management
- Create, read, update, and delete tasks
- Real-time sync with Firestore — changes reflect instantly across tabs
- Mark tasks as completed with a single click
- Task fields: title, description, status, priority, category, due date, tags
- Confirmation modal before deleting a task

### Dashboard
- Tabbed filtering: All, Pending, In Progress, Completed
- Search tasks by title or description
- Filter by priority (High, Medium, Low)
- Tabular task listing with columns: Title, Category, Priority, Status, Created, Due Date, Actions
- Inline action buttons: View, Edit, Mark Done, Delete
- Task detail modal with full information
- Stats cards: Total, In Progress, Completed, Completion Rate
- Skeleton loader while tasks are fetching

### Profile
- View and edit display name, role, location, bio
- Profile data persisted to Firestore
- Task statistics: total, completed, in progress, completion rate
- Progress bar showing overall completion
- Recent tasks list
- Account details section

### AI Assistant (Gemini 2.5 Flash)
- Floating AI button on desktop for instant access
- Persistent chat sessions stored in Firestore per user
- Streaming responses with real-time token-by-token rendering
- Full markdown rendering — bold, italic, code, headings, lists, code blocks
- Context-aware — the AI knows your current tasks, priorities, and due dates
- Create tasks from natural language — AI responds with a structured JSON block and a one-click "Add all to TaskFlow" action
- AI due date suggestions — click "AI suggest" in the task form to get a smart date based on priority and workload
- Daily briefing card on the dashboard — overdue count, due today, and in-progress summary
- Weekly productivity report — generated on demand from the chat header
- Explain any task — hit the ✦ sparkle icon on a task row to open the AI with a pre-filled explanation prompt
- Multi-session chat history with rename and delete support

### UI / UX
- Dark mode and light mode with smooth transition
- Theme preference persisted to localStorage
- Sticky glassy header on the landing page
- Collapsible sidebar — shows icons only when collapsed
- Toast notifications for all user actions (login, signup, task CRUD, profile update)
- Fully responsive layout
- Custom scrollbars
- Smooth animations: fade-in, slide-up, hover lifts

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v7 |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx   # Main app shell with sidebar
│   │   ├── LandingHeader.jsx     # Sticky glassy landing page header
│   │   └── Sidebar.jsx           # Collapsible sidebar with nav
│   └── ui/
│       ├── AppLoader.jsx         # Full-screen branded loading screen
│       ├── Avatar.jsx            # User initials avatar
│       ├── Badge.jsx             # Status and priority badges
│       ├── Button.jsx            # Reusable button variants
│       ├── ConfirmModal.jsx      # Delete confirmation modal
│       ├── GoogleButton.jsx      # Styled Google OAuth button
│       ├── Input.jsx             # Form input with icon support
│       ├── Modal.jsx             # Accessible modal with scroll
│       ├── AIAssistant.jsx       # AI chat panel with streaming + markdown
│       ├── StatsCard.jsx         # Dashboard metric card
│       ├── TaskForm.jsx          # Create / edit task form with AI date suggest
│       └── ThemeToggle.jsx       # Dark / light mode toggle
├── context/
│   ├── AIContext.jsx             # Gemini AI — chat sessions, briefing, suggestions
│   ├── AuthContext.jsx           # Firebase auth state + Firestore user profile
│   ├── TaskContext.jsx           # Firestore real-time task CRUD
│   └── ThemeContext.jsx          # Theme state management
├── firebase/
│   └── firebaseConfig.js         # Firebase app initialization
├── pages/
│   ├── Dashboard.jsx             # Main task management page
│   ├── Landing.jsx               # Public marketing page
│   ├── Login.jsx                 # Sign in page
│   ├── Profile.jsx               # User profile page
│   └── Signup.jsx                # Sign up page
├── routes/
│   └── AppRoutes.jsx             # Route definitions with protected/guest guards
├── App.jsx                       # Root component with providers
├── main.jsx                      # React entry point
└── index.css                     # Global styles and design tokens
```

---

## 🗄 Firestore Schema

### `users` collection
| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID (document ID) |
| `name` | string | Display name |
| `email` | string | Email address |
| `avatar` | string | Photo URL or empty string |
| `role` | string | Job title / role |
| `bio` | string | Short bio |
| `location` | string | Location |
| `createdAt` | timestamp | Account creation time |

### `tasks` collection
| Field | Type | Description |
|---|---|---|
| `uid` | string | Owner's Firebase Auth UID |
| `title` | string | Task title |
| `description` | string | Task description |
| `status` | string | `todo` / `inprogress` / `done` |
| `priority` | string | `high` / `medium` / `low` |
| `category` | string | Engineering, Design, Product, etc. |
| `tags` | array | String array of tags |
| `dueDate` | string | Due date (YYYY-MM-DD) |
| `createdAt` | timestamp | Task creation time |

---

## 🔒 Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow.git
cd taskflow

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey). No billing required.

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables from your `.env` file in **Vercel → Settings → Environment Variables**
4. Deploy

The `vercel.json` file is already configured to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Enable Google Sign-In on production

Go to **Firebase Console → Authentication → Settings → Authorized domains** and add your Vercel deployment URL (e.g. `taskflow-xyz.vercel.app`).

### Firestore rules for AI chat sessions

Add this rule to your existing Firestore security rules to protect AI chat data:

```js
match /aiChats/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

---

## 🎨 Design System

- **Fonts:** Syne (headings), DM Sans (body), JetBrains Mono (code/labels)
- **Primary color:** Cyan `#06b6d4`
- **Dark background:** `#030d12` → `#061520`
- **Light background:** `#f1f5f9`
- **Border radius:** `0.75rem` (inputs), `1rem` (cards), `1.25rem` (modals)

---

## 📜 License

MIT — free to use and modify.

---

> Built with ⚡, caffeine, and a little help from Gemini AI
