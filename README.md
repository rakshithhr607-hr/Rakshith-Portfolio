# Rakshith H R – Full-Stack Personal Portfolio & Admin Dashboard

A modern, responsive, full-stack personal developer portfolio featuring an authenticated, full-featured **Admin Dashboard**. Built with **React (Vite)**, **Tailwind CSS**, **Framer Motion**, **Node.js**, **Express.js**, and **MongoDB Atlas** (with an intelligent fallback store).

---

## 🌟 Key Highlights & Dynamic Architecture

> **Crucial Requirement**: Whenever any information is updated in the Admin Dashboard and saved, the changes **instantly appear on the public portfolio in real time**. 
> All data is dynamically fetched from MongoDB via RESTful APIs—no React source code edits or manual database scripts are ever required.

- **Theme & Aesthetics**: Dark theme by default with black (`#030712`) and navy backgrounds, glowing radial gradients, cyan/blue/purple neon accents, glassmorphic panels, and smooth Framer Motion transitions. Includes an instant **Light/Dark Mode Toggle** with `localStorage` persistence.
- **Enterprise-Grade Security**: Secure Admin login protected by **JWT authentication**, **Bcrypt** password hashing (10 salt rounds), authenticated bearer middleware, and strict file upload sanitization (images & PDFs).
- **Dual-Engine Persistence**: Works seamlessly connected to **MongoDB Atlas**, local MongoDB, or automatic in-memory fallback store so the application runs out of the box with zero downtime.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Framer Motion 11, Lucide React, Canvas Confetti, React Router DOM 6 |
| **Backend** | Node.js (ES Modules), Express.js 4, Mongoose 8, Multer (File Uploads), CORS, Dotenv |
| **Database** | MongoDB Atlas / Local MongoDB (with JSON-backed fallback data layer) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, Protected Routes & Bearer Auth Middleware |
| **Deployment** | Cloudflare Pages (Frontend SPA) & Render (Node.js API web service) |

---

## 🖥️ Public Portfolio Sections

1. **Home / Hero Section**
   - Displays developer name: **Rakshith H R**
   - Animated typewriter effect showcasing dynamic roles (*Full Stack Developer*, *Software Developer*, *Engineering Student*, *AI Enthusiast*)
   - Futuristic orbital glowing avatar (or custom uploaded profile picture)
   - One-click **Download Resume** button directly streaming the active PDF
   - **View Projects** smooth-scroll action
   - Verified **GitHub** and **LinkedIn** social channel links with hover glow effects

2. **About Me**
   - Editable personal introduction and narrative
   - Highlights: **AJ Institute of Engineering and Technology, Mangalore** (B.E. in Information Science and Engineering)
   - Interactive career interests & focus areas pills
   - Metric counters (Projects Completed, Technical Skills, Years Coding, Git Contributions)

3. **Technical Skills**
   - Category filtering: *All*, *Languages*, *Frontend*, *Backend & Databases*, *Tools & Platforms*
   - Cards with animated progress bars, proficiency percentages, and skill levels (*Expert*, *Advanced*)
   - Pre-seeded with: **C**, **Java**, **Python**, **HTML**, **CSS**, **JavaScript**, **React.js**, **Node.js**, **MongoDB**

4. **Education**
   - Academic timeline card featuring:
     - **College**: AJ Institute of Engineering and Technology, Mangalore
     - **Department**: Information Science and Engineering
     - **Degree**: Bachelor of Engineering (B.E.)
     - **Grade**: 8.8 CGPA badge
     - Coursework overview and bulleted academic highlights

5. **Projects Showcase**
   - Interactive project cards with custom screenshots or high-tech gradient banners
   - Initial projects:
     - **StudentHub**: Full-stack campus collaboration and academic resource platform
     - **HumanTwin AI**: Digital twin predictive health and lifestyle forecasting assistant
   - Technology badges, GitHub repository links, Live Demo buttons, and featured badges

6. **Work Experience & Internships**
   - Experience timeline featuring:
     - **Full Stack Web Development Intern** @ TechSolutions Innovations
     - **Software Engineering Trainee** @ Apex Code Labs
   - Role descriptions, key achievement bullet points, technology pills, and certificate links

7. **Licenses & Certifications**
   - Credentials from **Meta / Coursera**, **IBM**, and **MongoDB University**
   - Issuer details, issue dates, credential IDs, covered skill tags, and credential verification URLs

8. **Contact Section**
   - Direct contact info cards (Email, Phone, Location: Mangalore, Karnataka, India)
   - Interactive Contact Form with real-time validation:
     - Name, Email, Subject, and Message fields
     - Submissions stored directly in MongoDB
     - Animated **confetti celebration** and success notifications upon submission

9. **Footer**
   - Copyright notice, quick navigation links, tech stack credits, and direct shortcut to Admin Login.

---

## 🛡️ Admin Dashboard Features

Access URL: `/admin` (Redirects to `/admin/login` if unauthenticated)

- **Default Credentials** (pre-seeded):
  - **Email**: `admin@rakshith.dev`
  - **Password**: `admin123`
  - *(Includes a convenient "Auto Fill" button on the login screen for rapid testing)*

### Management Modules:
1. **Dashboard Overview**: Metrics overview (Total Projects, Skills, Messages, Certifications, Experiences, Resume Downloads), recent incoming visitor messages preview, and quick shortcuts.
2. **Profile Management**: Update developer name, professional title, animated typing roles, introductory statement, detailed about story, contact details, and upload new avatar photos with instant preview.
3. **Skills Management**: Add, edit, or delete technical skills, adjust proficiency percentage sliders (0-100%), and assign categories and mastery levels.
4. **Projects Management**: Add new projects, upload project screenshots or input image URLs, edit descriptions, modify tech stack tags, live demo links, and toggle featured spotlight status.
5. **Education Management**: Add, update, or remove academic records, institution names, degree titles, departments, CGPA/grades, and achievement bullet points.
6. **Experience Management**: Add, edit, or delete professional internships, company names, durations, locations, achievements, and certificate URLs.
7. **Certifications Management**: Add, edit, or delete licenses, credential IDs, verification URLs, and upload certificate images.
8. **Resume Management**:
   - Inspect active resume details (filename, file size, last updated timestamp)
   - Track live total download counts & analytics
   - Upload new PDF resume (automatically replaces existing and updates portfolio download links)
   - "Test Download Resume" action
   - Delete resume action
9. **Social Media Management**: Update GitHub URL, LinkedIn URL, Email address, Twitter/X, and LeetCode profiles with URL validation and "Test Link" previews.
10. **Messages Management (Inbox)**:
    - View all submitted contact form inquiries from visitors
    - Sender name, email, subject, message body, timestamp, and IP address
    - Unread message count badge
    - Filter by *All*, *Unread*, or *Read* + real-time search
    - One-click "Reply by Email" opening pre-formatted email draft
    - Mark as Read / Unread toggle
    - Delete message with confirmation
11. **Security & Password Management**:
    - Change admin password requiring current password verification
    - New password validation with live visual **Password Strength Indicator**
    - Show/hide password visibility toggles
    - Encrypted via Bcrypt before saving to database

---

## 🚀 Local Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- Optional: Local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Rakshith-HR/portfolio.git
cd portfolio

# Install root, backend, and frontend packages
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
# For local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/rakshith_portfolio
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/rakshith_portfolio?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d
ADMIN_EMAIL=admin@rakshith.dev
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
# Leave blank during local development so Vite proxies /api to http://localhost:5000:
VITE_API_URL=
```

### 4. Seed the Database
Run the seeder script to populate initial data (Rakshith H R profile, 9 skills, AJIET education, StudentHub & HumanTwin AI projects, internships, certifications, active resume PDF, and admin credentials):
```bash
npm --prefix backend run seed
```

### 5. Start the Application
You can run both backend and frontend concurrently or in separate terminals:

```bash
# Terminal 1 - Start Backend API (Port 5000)
npm run backend

# Terminal 2 - Start Frontend Dev Server (Port 5173)
npm run frontend
```

Open your browser:
- **Public Portfolio**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 Production Deployment Guide

### A. Database (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster (M0).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** -> **Connect your application** -> Copy the connection string.
5. Example: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/rakshith_portfolio?retryWrites=true&w=majority`.

### B. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Select your repository.
4. Set the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A secure random string*
   - `JWT_EXPIRES_IN`: `30d`
   - `ADMIN_EMAIL`: *Your secure admin email*
   - `ADMIN_PASSWORD`: *Your secure admin password*
   - `FRONTEND_URL`: *Your Cloudflare Pages frontend URL (e.g. `https://rakshith-portfolio.pages.dev`)*
6. Click **Create Web Service**. Once deployed, copy your Render API URL (e.g., `https://rakshith-portfolio-backend.onrender.com`).
7. *(Optional)* Run the seed script once against your Atlas cluster:
   ```bash
   MONGODB_URI="<your-atlas-uri>" ADMIN_EMAIL="<email>" ADMIN_PASSWORD="<password>" node backend/seed.js
   ```

> [!WARNING]
> ### ⚠️ Render Free-Tier Ephemeral Storage Limitation
> Render's Free Web Service tier operates on an **ephemeral filesystem**.
> - Files uploaded at runtime to `backend/uploads/` (such as new resume PDFs or custom project screenshots uploaded via the Admin Dashboard) will be stored in temporary instance disk space.
> - When the Render free service spins down due to 15 minutes of inactivity or restarts during a new build/deployment, the local disk is reset.
> - **Pre-existing & Seeded assets** (or remote image URLs from GitHub/Imgur) remain completely unaffected and persistent in MongoDB.
> - For permanent enterprise file persistence across restarts without paid Render disks, integrate cloud storage services such as Cloudinary or AWS S3 in a future release.

### C. Frontend Deployment (Cloudflare Pages)
1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select your portfolio GitHub repository (`Rakshith-Portfolio`).
3. Set the build configuration:
   - **Framework preset**: `Vite`
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Under **Environment variables (production)**, add:
   - `VITE_API_URL`: *Your deployed Render backend URL (e.g. `https://rakshith-portfolio-backend.onrender.com`)*
5. Click **Save and Deploy**. Cloudflare Pages automatically handles Vite Single Page Application (SPA) routing.

---

## 🔒 Security & Best Practices

- **Zero Plain-Text Passwords**: Passwords are cryptographically salted and hashed using Bcrypt before ever touching the database.
- **Stateless Protected Authentication**: Admin endpoints strictly verify signed JSON Web Tokens (JWT) passed in the `Authorization: Bearer <token>` header.
- **No Sensitive Credential Leaks**: `.env` files and credentials are systematically excluded via `.gitignore`.
- **File Upload Safeguards**: Multer enforces strict MIME-type filters (JPEG, PNG, WEBP, SVG, PDF) and a 10MB size cap to prevent resource exhaustion attacks.
- **Strict CORS Protection**: In production, the backend strictly permits only the exact origin configured in `FRONTEND_URL`, rejecting any unauthorized cross-origin requests. Localhost development origins remain accessible during local development.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

Designed & Engineered by **Rakshith H R** • Information Science & Engineering, AJIET Mangalore.
