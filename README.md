# ArenaSync

ArenaSync is a secure, real-time sports tournament management system designed to coordinate collegiate athletics. It automates registration, brackets, payments, and notifications across multiple user tiers.

[![Release](https://img.shields.io/badge/Release-v2.0-blue.svg?style=for-the-badge)](https://github.com/Meetsheth25/Arenasync)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge)](https://github.com/Meetsheth25/Arenasync)

[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white&style=flat-square)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Node](https://img.shields.io/badge/Node-18+-green?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-black?logo=socket.io&logoColor=white&style=flat-square)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-SDK-blue?logo=razorpay&logoColor=white&style=flat-square)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-API-blue?logo=cloudinary&logoColor=white&style=flat-square)](https://cloudinary.com/)

ArenaSync connects administrators, organizers, coaches, players, and sponsors into a unified platform. It replaces manual scheduling, disconnected spreadsheets, and offline cash collections with role-adaptive dashboards, automated single-elimination brackets, and integrated payment flows.

---

## 🌐 Live Deployment

* **Frontend Application**: [https://arenasync-tau.vercel.app](https://arenasync-tau.vercel.app)
* **Backend API Base**: [https://arenasync.onrender.com/api](https://arenasync.onrender.com)

*Note: The backend is hosted on the Render free-tier, which spins down after periods of inactivity. If visiting the live site for the first time in a while, please allow up to 50 seconds for the backend instance to spin up.*

---

## ✨ Features

### 🔐 Authentication & Onboarding
- **Secure Register Flows**: Uses 6-digit email OTPs delivered via the Brevo REST API with a 5-minute expiration window to verify new accounts.
- **Credential Security**: Implements password salting and hashing with `bcryptjs` and authorizes sessions via JSON Web Tokens (JWT).
- **Profile Customization**: Users can edit profiles, change passwords, and upload profile photos processed and hosted via Cloudinary.

### 🏆 Tournament Management
- **Tournament Orchestration**: Organizers can create tournaments specifying sport, location rules, date boundaries, and entry fees.
- **Automated Brackets**: Automatically generates and renders interactive single-elimination knockout brackets.
- **Standing Auditing**: Restricts updates and freezes tournament brackets once matchups have concluded.

### 👥 Team & Player Management
- **Team Workspaces**: Captains (coaches/players) can create teams, manage roster settings, and view standings.
- **Roster Application Workflow**: Roster approval system restricting player admissions based on team configurations.
- **Join Fee Configurations**: Captains can configure a join fee for their rosters that players must pay upon application.

### 💻 Role-Adaptive Dashboards
- **Organizer Workspace**: Handles bracket updates, results inputs, and registration lists.
- **Coach Panel**: Configures roster join fees, manages player approvals, and processes sign-ups.
- **Sponsor Portal**: Audits sponsorship stats, budgets, and marketing details.
- **Admin Center**: Oversees global platforms, audits payments, and manages categories.

### 💳 Payments
- **Razorpay Checkout**: Seamless payment gateways integrated via the Razorpay Web SDK.
- **Payment Verification**: Secure backend signature verification matching payment callbacks against computed SHA-256 HMACs.
- **Manual Overrides**: Administrators can manually approve or override payments to reconcile offline/pending cash transactions.

### 📊 Analytics & Live Sync
- **Real-Time Updates**: Uses Socket.IO WebSockets to push live score changes and bracket updates to active screens.
- **Data Dashboards**: Visualizes system financial parameters, user enrollment, and tournament metrics.
- **Polling Fallback**: Features fallback routines that switch client connections to REST short-polling loops if socket connections drop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (v18.2.0), Vite (v7.2.4)
- **Routing**: React Router DOM (v6.22.3)
- **HTTP Client**: Axios (v1.13.2)
- **Sockets**: Socket.IO Client (v4.8.3)
- **Visualization**: Chart.js, Recharts
- **Animations**: Framer Motion, Three.js (WebGL background canvas)

### Backend
- **Framework**: Node.js, Express.js (v5.2.1)
- **Database ORM**: Mongoose (v9.1.2)
- **Sockets**: Socket.IO (v4.8.3)
- **Uploads**: Multer
- **Security**: jsonwebtoken, bcryptjs

### Third-Party Integrations
- **Payments**: Razorpay Node SDK (v2.9.6)
- **Storage**: Cloudinary API
- **Email Delivery**: Brevo REST API (for OTP verification) & Nodemailer SMTP (for registration welcome messages)

---

## ⚙️ Environment Variables

### Backend Environment Variables
Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Placeholder / Example |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Connection string (Atlas or Local) | `mongodb+srv://user:pass@cluster.mongodb.net/ArenaSync` |
| `JWT_SECRET` | Secret key used for signing JWT access tokens | `your_jwt_secret_key` |
| `PORT` | Local Express server port | `5000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Storage account cloud name | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary Access API key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary Access API secret | `your_cloudinary_api_secret` |
| `EMAIL_USER` | SMTP email address (used for welcome emails) | `support@yourdomain.com` |
| `EMAIL_PASS` | SMTP application password | `smtp_app_password` |
| `FRONTEND_URL` | Client origin URL for CORS configuration | `https://arenasync-tau.vercel.app` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_xxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `xxxxxxxxxxxxxxxxxxxxxx` |
| `ORGANIZER_TOURNAMENT_CREATION_FEE` | Base cost for tournament creation (in Paise) | `50000` |
| `BREVO_API_KEY` | Brevo REST API Key (used for transactional OTPs) | `xkeysib-xxxxxxxxxxxxxxxxxxxx` |
| `BREVO_SENDER_EMAIL` | Verified sender email address in Brevo dashboard | `otp@yourdomain.com` |
| `BREVO_SENDER_NAME` | Display name for Brevo email communications | `ArenaSync Support` |

### Frontend Environment Variables
Create a `.env` or `.env.production` file in the `Frontend/` directory:

#### Local Development (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Production Deployment (`Frontend/.env.production`)
```env
VITE_API_URL=https://arenasync.onrender.com/api
VITE_SOCKET_URL=https://arenasync.onrender.com
```

*Note: Vite injects environment variables prefixed with `VITE_` at build time. When deploying, these environment variables must be present during compilation.*

---

## 🏗️ Project Architecture

```
React + Vite Frontend (Vercel)
       │
       │ HTTPS (REST API) & Socket.IO (WebSockets)
       ▼
Node.js + Express Backend (Render)
       │
       ├─► MongoDB Atlas (Database Store)
       ├─► Cloudinary API (Media Uploads & Avatar Hosting)
       ├─► Razorpay API (Payment Checkouts)
       ├─► Brevo REST API (OTP Code Delivery)
       └─► Nodemailer SMTP (Registration Welcome Emails)
```

- **Client Requests**: Network requests pass through Axios interceptors to attach `Authorization: Bearer <token>` headers, handle session de-authorization, and parse response payloads.
- **REST Middleware**: Routes run validation schemas via `express-validator` and check user scopes before forwarding requests to the controller.
- **Data Integrations**: Databases save document schemas, Cloudinary hosts user profile photos, Razorpay verifies transaction signatures, and Brevo/Nodemailer send automated transactional emails.

---

## 👥 User Roles & Permissions

| Action / Permission | Admin | Organizer | Coach | Player | Sponsor |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Manage Sports & Venues** | Yes | No | No | No | No |
| **Create Tournament** | Yes | Yes | No | No | No |
| **Update Match Scores & Brackets** | Yes | Yes | No | No | No |
| **Create Team** | Yes | No | Yes | No | No |
| **Manage Roster Approvals**| Yes | No | Yes | No | No |
| **Register & Pay for Events**| Yes | No | Yes | Yes | No |
| **View Sponsor Dashboard** | Yes | No | No | No | Yes |
| **Platform Financial Auditing** | Yes | No | No | No | No |

---

## 💻 Installation & Local Setup

### Prerequisite Checklist
- Node.js installed (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Cloudinary, Razorpay, and Brevo accounts to configure integration keys

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Meetsheth25/Arenasync.git
   cd Arenasync
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env and update connection keys
   cp .env.example .env
   # Start the Express server
   npm start
   ```
   *The server starts on [http://localhost:5000](http://localhost:5000).*

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   # Create .env and update local API endpoints
   cp .env.example .env
   # Start the Vite dev server
   npm run dev
   ```
   *The application starts on [http://localhost:5173](http://localhost:5173).*

---

## 🚀 Deployment

### Frontend — Vercel
1. Set the **Root Directory** setting to `Frontend`.
2. Configure the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add the required environment variables in the Vercel project settings:
   - `VITE_API_URL=https://arenasync.onrender.com/api`
   - `VITE_SOCKET_URL=https://arenasync.onrender.com`
5. *Important*: If you modify these `VITE_` variables in Vercel, you must trigger a new deployment so that Vite can embed the new values into the static JavaScript output bundle.

### Backend — Render
1. Deploy as a **Web Service**.
2. Set the **Root Directory** to `backend`.
3. Configure the **Build Command** to `npm install` and the **Start Command** to `npm start`.
4. Configure the environment variables in Render's environment dashboard:
   - Add the verified keys for Mongo, Cloudinary, Razorpay, and Brevo.
   - Configure `FRONTEND_URL=https://arenasync-tau.vercel.app`.

---

## 🗂️ Folder Structure

```
Arenasync/
├── Frontend/                # React Client (Vite)
│   ├── public/             # Static public assets
│   └── src/
│       ├── adminside/      # Admin dashboards and system views
│       ├── component/      # Headers, sidebars, and footers mapped to roles
│       ├── components/     # Canvas grids and interactive visual components
│       ├── context/        # Authentication & State management
│       ├── layouts/        # Layout wrappers matching user privileges
│       ├── routes/         # Client-side router path guards
│       ├── screen/         # Public and workspace views
│       ├── services/       # Checkout scripts
│       ├── static/         # Custom stylesheets mapped to components
│       └── utils/          # Axios configurations and Socket.IO clients
└── backend/                # REST API Server (Express)
    ├── config/             # Cloudinary, SMTP transporter, and Brevo connections
    ├── controllers/        # Route controllers and endpoints logic
    ├── middleware/         # Scope check, upload validations, and token parsing
    ├── models/             # Mongoose Schemas (User, Match, Tournament, Team, etc.)
    ├── routes/             # Path registries
    ├── uploads/            # Temporary disk storage for media uploads
    ├── utils/              # Bracket generation and payment verification helpers
    └── validators/         # Request validation logic (express-validator)
```

---

## 🛰️ API Overview

### 🔐 Authentication & Accounts
* `POST /api/check-email` - Check account availability
* `POST /api/send-email-otp` - Send verification OTP (via Brevo REST API)
* `POST /api/verify-email-otp` - Verify registration OTP code
* `POST /api/register` - Create profile record
* `POST /api/login` - Authenticate credentials and receive JWT

### 👤 Profile Management
* `GET  /api/profile/me` - Fetch active user profile
* `PUT  /api/profile/update` - Edit profile details and profile avatar
* `PUT  /api/profile/change-password` - Change password
* `DELETE /api/profile/delete` - Deactivate account (soft delete)

### 👥 Team Management
* `POST /api/teams` - Create a team roster (Captain)
* `GET  /api/teams/my-teams` - Fetch active teams the user is part of
* `POST /api/teams/:teamId/apply` - Apply to join a team roster (Player)
* `PUT  /api/teams/:id` - Edit team specifications (Captain)
* `PUT  /api/teams/:teamId/player/:playerId` - Approve or reject applications (Captain)
* `DELETE /api/teams/:teamId/leave` - Leave a team roster (Player)
* `DELETE /api/teams/:id/delete` - Delete team (Captain)

### 🏆 Tournaments & Matches
* `GET  /api/tournaments/public` - Fetch all visible tournaments
* `GET  /api/tournaments/:id` - Fetch detailed tournament statistics
* `POST /api/tournaments` - Create a tournament (Organizer / Admin)
* `POST /api/matches/create` - Generate tournament knockout matches
* `PUT  /api/matches/score/:id` - Save scores and advance matching bracket nodes

---

## 🔒 Security

- **JWT Authorization**: Enforces role access by verifying authorization tokens in client-side headers.
- **Route Validation Middleware**: Uses `express-validator` to sanitize payload entries and secure endpoints from query injection.
- **Cryptographic Encryption**: Encrypts passwords before database storage using high-entropy salting via `bcryptjs`.
- **Payment Verification**: Validates transaction callbacks using cryptographically signed HMAC-SHA256 hashes matching Razorpay signatures.
- **Scope Verification**: Authorizes requests using middleware scopes restricting route access by role.

---

## 📜 License
This project was developed for educational and portfolio purposes. The source code may be referenced for learning and academic exploration.

---
**ArenaSync** - Code. Create. Compete.  
Built by **Mit Sheth** 🚀
