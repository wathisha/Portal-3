# Science with Sheshadi LMS - Pure JSON Database & Multi-User Management Portal

A modern, responsive Learning Management System (LMS) and Educator ERP built with a **Pure JSON Database Engine**, **Multi-User Role-Based Access Control (RBAC)**, and **Multi-Device Support (PC, Tablet, and Mobile Phone)**.

Deployable on **GitHub Pages** (as a static web application) or on **Node.js / VPS / Render / Railway / Localhost** (with live JSON REST API).

---

## 📁 GitHub Repository File Structure

```text
├── index.html                      # Student & Teacher entry hub
├── admin_login.html                # Multi-user staff authentication & device detection
├── admin.html                      # Educator dashboard, student evaluation & user management
├── student.html                    # Individual student scorecard & monthly progress portal
├── students_directory.html         # Class-wise student master directory
├── teacher_documents.html          # Confidential teacher document storage vault
├── 404.html                        # GitHub Pages 404 fallback page
├── server.js                       # Standalone Node.js JSON REST API database server
├── README.md                       # Setup and deployment documentation
├── .gitignore                      # Git ignored files & temp artifacts
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions automated GitHub Pages deployment
│
├── assets/
│   ├── data/                       # Pure JSON Database Layer
│   │   ├── students.json           # Student profiles, 12-month marks, & unit tests
│   │   ├── users.json              # Multi-user credentials, roles, & device sessions
│   │   ├── erp-config.json         # Master configuration, Zoom/WhatsApp links, & columns
│   │   ├── teacher-docs.json       # Confidential marking schemes & question banks
│   │   └── activity-logs.json      # Audit log of actions across PC, Tablet, and Phone
│   │
│   ├── js/                         # Client-Side Application Logic
│   │   ├── lms-core.js             # Core data engine, RBAC auth, sync & theming
│   │   ├── app.js                  # Frontend utilities & charting
│   │   ├── excel-parser.js         # Tabular data parser utility
│   │   └── sheet-sync.js           # Cloud data synchronization utility
│   │
│   ├── css/
│   │   └── styles.css              # Custom styling, dual theming (light/dark), & glassmorphism
│   │
│   └── images/                     # Academy Branding & Assets
│       ├── logo.png                # Official website logo
│       ├── favicon.ico             # Browser favicon
│       ├── teacher.png             # Teacher profile photo
│       ├── teacher_banner.png      # Teacher hero banner photo
│       └── lms_background.png      # Website background pattern
│
└── scripts/
    └── export_global_lms_files.py  # Script to synchronize global settings across JSON & JS
```

---

## 🚀 How to Deploy to GitHub Pages

### 1. Initialize Git & Push to GitHub
```bash
git init
git add .
git commit -m "Deploy: Science LMS with Pure JSON Database & Multi-User RBAC"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Open your repository on **GitHub**.
2. Go to **Settings** → **Pages** (under *Code and automation*).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` / `/ (root)`
   - Click **Save**.
4. Alternatively, select **GitHub Actions** as the source to use the automated workflow in `.github/workflows/deploy.yml`.
5. Within 1-2 minutes, your portal will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

---

## 💻 Running Locally with Central Node.js Server

To run the LMS locally with live JSON file read/write operations and multi-device LAN support:

```bash
node server.js
```

- **Local PC Access**: `http://localhost:3000`
- **Mobile & Tablet LAN Access**: `http://<YOUR-IP>:3000` (Access from phones & tablets connected to the same Wi-Fi)
