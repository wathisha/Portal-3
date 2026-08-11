# Science with Sheshadi - Student Academic Portal

A responsive, static web application designed for **Science with Sheshadi** to display individual student academic profiles, weekly guidebooks, practicals, unit tests, and term scores directly from **Google Sheets tabs** or local Excel workbooks.

Hosted seamlessly on **GitHub Pages**.

---

## 📁 Repository Folder Structure

```
student-portal-repo/
├── index.html                           # Main Web App Entry Point & Dashboard
├── 404.html                             # Custom SPA Fallback for GitHub Pages
├── README.md                            # Complete Setup & Integration Documentation
├── .gitignore                           # Git ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions workflow for automatic Pages deployment
├── assets/
│   ├── css/
│   │   └── styles.css                   # Custom glassmorphism, responsive styles & print layout
│   ├── js/
│   │   ├── app.js                       # Core portal application logic & tab manager
│   │   ├── sheet-sync.js                # Google Sheets API & GViz live tab synchronization engine
│   │   └── excel-parser.js              # In-browser Excel (.xlsx) file reader powered by SheetJS
│   ├── images/
│   │   ├── logo.png                     # Official "Science with Sheshadi" Website Logo
│   │   ├── teacher.png                  # Head Teacher Photo (Mrs. Sheshadi Sathsarani)
│   │   └── favicon.ico                  # Browser Favicon
│   └── data/
│       ├── students.json                # Pre-populated multi-student dataset (1 tab = 1 student)
│       └── Student_Improvement_Tracker.xlsx # Sample Excel workbook with student tabs
└── scripts/
    ├── convert_excel_to_json.py         # Python utility to convert Excel tabs to JSON
    └── sync_google_sheets.py            # Python utility to sync live Google Sheets tabs
```

---

## 🚀 How to Upload to GitHub & Host on GitHub Pages

### Step 1: Create a New GitHub Repository
1. Log in to your account at [GitHub](https://github.com).
2. Click **New Repository** (or go to `https://github.com/new`).
3. Set Repository Name to `science-with-sheshadi-portal` (or your preferred name).
4. Set Visibility to **Public** (required for free GitHub Pages hosting).
5. Do **not** initialize with a README (since this folder already includes one). Click **Create repository**.

### Step 2: Upload Files using Git Command Line
Open your terminal inside the `student-portal-repo` directory and run:

```bash
git init
git add .
git commit -m "Initial commit: Science with Sheshadi Student Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/science-with-sheshadi-portal.git
git push -u origin main
```

*(Alternatively, you can drag and drop all files and folders directly into the GitHub Web Interface).*

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Navigate to **Settings** -> **Pages** (under Code and automation).
3. Under **Source**:
   - Select **Deploy from a branch** -> Branch: `main` -> Folder: `/ (root)`.
   - Click **Save**.
4. Within 1-2 minutes, GitHub will publish your portal live at:
   `https://YOUR_USERNAME.github.io/science-with-sheshadi-portal/`

---

## 📊 Google Sheets Data Structure (1 Tab = 1 Student)

The portal reads each student's academic profile from individual worksheet tabs in Google Sheets.

### Spreadsheet Details
- **Google Sheet URL**: [Student Improvement Tracker](https://docs.google.com/spreadsheets/d/1X8TSZcUAJjKj49q6BrL8M2IELx8SVK3L/edit?gid=780068320#gid=780068320)
- **Spreadsheet ID**: `1X8TSZcUAJjKj49q6BrL8M2IELx8SVK3L`

### Tab Layout Guidelines
1. **Sheet Tab Name**: Name each tab after the student or student index (e.g., `Student 1`, `Student 2`, `Student 3`, `Alex Johnson`).
2. **Profile Section**:
   - `Student Name`: (e.g. Alex Johnson)
   - `Student ID`: (e.g. ST-84092)
   - `Grade / Class`: (e.g. 06 - Science)
   - `Homeroom Teacher`: (e.g. Mrs. Sheshadi Sathsarani)
3. **Weekly Table Columns**:
   - `Weeks` | `mastr guid book 1` | `mastr guid book 2` | `Past Paper` | `Practicle` | `Unit Tet`
4. **Term Assessment Table**:
   - `Assessment` | `Score (out of 100)`

---

## ⚙️ Updating Student Data

### Method A: Live Google Sheets Sync
- Make changes directly in your Google Sheet tabs.
- Click the **"Sync Google Sheet"** button on the website navbar to refresh live data.

### Method B: Uploading Local Excel (.xlsx) File
- Click **"Upload Excel (.xlsx)"** on the navbar and select `Student_Improvement_Tracker.xlsx`.
- The in-browser parser will instantly render all tabs into student profile tabs without reloading!

### Method C: Automated Build via Python Script
Run the included conversion script to refresh `assets/data/students.json`:

```bash
python scripts/convert_excel_to_json.py
```

---

## 🌟 Key Features
- **Logo & Branding**: Features official "Science with Sheshadi" logo and teacher photo.
- **Tab Navigation**: Click between student tabs (`Student 1`, `Student 2`, `Student 3`...).
- **Real-Time Analytics**: Interactive Chart.js line charts for unit tests and bar charts for term exams.
- **Printable Report Cards**: Click "Print Report" to generate clean, formatted student reports.
- **Search & Filter**: Find students instantly by name, ID, or sheet tab.
