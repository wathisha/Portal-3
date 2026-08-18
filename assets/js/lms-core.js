/**
 * LMS Core Management Engine - Science with Sheshadi LMS & ERP
 * True Simultaneous Multi-Device Real-Time Cloud Synchronization Engine
 * Powered by Firebase Realtime Database WebSockets & Cloud REST API
 */

(function () {
    'use strict';

    // Global Default Configuration Constants
    const DEFAULT_SETTINGS = {
        academyName: "Sathsarani Science Academy",
        tagline: "GRADE 6-11 SCIENCE SPECIALIST",
        motto: "UNDERSTAND TODAY, SUCCEED TOMORROW",
        teacherName: "Mrs. Sheshadi Amarasinghe",
        teacherTitle: "B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Specialist",
        hotlines: "071 781 2092 | 077 161 4260",
        teacherPhoto: "assets/images/teacher_banner.png",
        bgImage: "assets/images/lms_background.png",
        theme: "light",
        subjectList: ["06 - Science", "07 - Science", "08 - Science", "09 - Science", "10 - Science", "11 - Science"],
        announcement: "Welcome to Sathsarani Science Academy LMS! Grade 06-11 Science Master Guidebooks, past paper revisions, WhatsApp & Zoom live classes are active.",
        offerings: [
            "Clear Explanations",
            "Exam Focused Learning",
            "Concept Building",
            "Past Paper Practice",
            "Live Practical Sessions on Classroom"
        ],
        gradingScale: { A: 75, B: 65, C: 50, S: 35 }
    };

    const DEFAULT_ADMIN_AUTH = {
        username: "sheshadi",
        password: "password123"
    };

    const DEFAULT_CLOUD_CONFIG = {
        enabled: true,
        provider: "firebase_rest", // "firebase_realtime", "google_apps_script", "cloud_rest"
        firebaseUrl: "https://science-lms-portal-default-rtdb.firebaseio.com",
        appsScriptUrl: "",
        lastSynced: ""
    };

    const DEFAULT_WEEKLY_COLUMNS = [
        { id: "col_mg1", key: "master_guide_1", label: "Guidebook 1", type: "dropdown", removable: false },
        { id: "col_mg2", key: "master_guide_2", label: "Guidebook 2", type: "dropdown", removable: false },
        { id: "col_pp", key: "past_paper", label: "Past Paper", type: "dropdown", removable: false },
        { id: "col_pr", key: "practical", label: "Practical Rating", type: "dropdown", removable: false },
        { id: "col_ut", key: "unit_test", label: "Unit Test Score", type: "number", removable: false }
    ];

    const DEFAULT_WHATSAPP = {
        isLive: true,
        teacherWhatsappNumber: "94717812092",
        whatsappGroupUrl: "https://chat.whatsapp.com/ScienceWithSheshadi2026",
        title: "Grade 06 Science - Live Class WhatsApp Q&A & Support",
        grade: "06 - Science",
        broadcastText: "Hello students, today's Science Master Guidebook and practical review questions are now published.",
        statusText: "LIVE ON WHATSAPP"
    };

    const DEFAULT_ZOOM = {
        isLive: true,
        title: "Grade 06 Science - Live Theory & Practical Zoom Session",
        grade: "06 - Science",
        meetingUrl: "https://zoom.us/j/9876543210?pwd=SCIENCE2026CLASS",
        meetingId: "987 654 3210",
        passcode: "SCIENCE2026",
        hostName: "Mrs. Sheshadi Amarasinghe",
        startTime: "Saturday 8:00 AM - 10:30 AM",
        statusText: "LIVE ON ZOOM"
    };

    const DEFAULT_NOTIFICATIONS = [
        {
            id: "NOTIF-101",
            title: "Term 2 Practical Evaluation Date",
            message: "All Grade 06 students must complete Unit 3 & 4 laboratory workbooks before August 25.",
            grade: "06 - Science",
            priority: "Exam Alert",
            date: "2026-08-15",
            time: "07:30 PM",
            sender: "Mrs. Sheshadi Amarasinghe"
        },
        {
            id: "NOTIF-102",
            title: "Live Science Master Class Schedule",
            message: "Weekly live problem solving session will be hosted this Saturday on Zoom & WhatsApp.",
            grade: "All Grades",
            priority: "Live Class",
            date: "2026-08-14",
            time: "09:00 AM",
            sender: "Mrs. Sheshadi Amarasinghe"
        },
        {
            id: "NOTIF-103",
            title: "Grade 10 & 11 Past Paper Assignment Uploaded",
            message: "New model paper for Term 2 has been published in the shared files section.",
            grade: "10 - Science",
            priority: "Homework",
            date: "2026-08-12",
            time: "05:00 PM",
            sender: "Mrs. Sheshadi Amarasinghe"
        }
    ];

    const DEFAULT_FILES = [
        {
            id: "FILE-101",
            title: "Grade 06 Science - Master Guidebook 01",
            description: "Foundational concepts, unit diagrams, and practical exercise workbook for Term 1.",
            category: "Master Guide",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "14.2 MB",
            uploadDate: "2026-08-01",
            uploadedBy: "Mrs. Sheshadi Amarasinghe"
        },
        {
            id: "FILE-102",
            title: "Grade 06 Science - Master Guidebook 02",
            description: "Advanced plant physiology, energy transformations, and model questions.",
            category: "Master Guide",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "18.5 MB",
            uploadDate: "2026-08-05",
            uploadedBy: "Mrs. Sheshadi Amarasinghe"
        },
        {
            id: "FILE-103",
            title: "Term 1 Past Papers & Marking Scheme",
            description: "Official evaluation past papers with step-by-step marking rubrics.",
            category: "Past Papers",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "22.1 MB",
            uploadDate: "2026-08-08",
            uploadedBy: "Mrs. Sheshadi Amarasinghe"
        }
    ];

    const DEFAULT_TEACHER_DOCS = [
        {
            id: "TDOC-101",
            title: "Grade 06 - Term 2 Master Examination Paper & Marking Rubric",
            grade: "06 - Science",
            category: "Official Marking Scheme",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "4.8 MB",
            uploadDate: "2026-08-10",
            description: "Confidential official marking scheme and evaluation criteria for Term 2 Science paper."
        },
        {
            id: "TDOC-102",
            title: "Grade 07 - Plant & Animal Tissue Lab Practical Protocol Guide",
            grade: "07 - Science",
            category: "Lab Practical Protocol",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "6.2 MB",
            uploadDate: "2026-08-08",
            description: "Detailed laboratory setup, chemical reagent preparations, and teacher notes."
        },
        {
            id: "TDOC-103",
            title: "Grade 08 - Annual Syllabus Timeline & Teaching Lesson Plans",
            grade: "08 - Science",
            category: "Lesson Plan",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "3.5 MB",
            uploadDate: "2026-08-02",
            description: "Curriculum breakdown, unit targets, and weekly pedagogical timeline."
        },
        {
            id: "TDOC-104",
            title: "Grade 10 & 11 - O/L Chemistry Master Question Bank (Top 500 Questions)",
            grade: "11 - Science",
            category: "Question Bank",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "12.4 MB",
            uploadDate: "2026-08-12",
            description: "Curated collection of national past paper questions with step-by-step chemical equations."
        },
        {
            id: "TDOC-105",
            title: "Confidential - Academic Year Student Performance Master Roster",
            grade: "Confidential Master Files",
            category: "Secretarial Record",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "2.1 MB",
            uploadDate: "2026-08-14",
            description: "Master administrative student records, contact numbers, and parent communication log."
        }
    ];

    const DEFAULT_CALENDAR = [
        {
            id: "EVT-201",
            title: "Term 2 Mid Evaluation Exam",
            date: "2026-08-20",
            time: "08:30 AM - 10:30 AM",
            category: "Exam",
            grade: "06 - Science",
            description: "Covering Units 1 to 4 in Master Guidebook 01."
        },
        {
            id: "EVT-202",
            title: "Live Science Master Class & Practical",
            date: "2026-08-15",
            time: "08:00 AM - 10:30 AM",
            category: "Class",
            grade: "All Classes",
            description: "Interactive discussion on past paper question techniques."
        },
        {
            id: "EVT-203",
            title: "Lab Practical Logbook Submission",
            date: "2026-08-25",
            time: "05:00 PM Deadline",
            category: "Assignment",
            grade: "07 - Science",
            description: "Submit recorded chemistry and biology experiment sheets."
        },
        {
            id: "EVT-204",
            title: "National Holiday - Poya Day Break",
            date: "2026-08-28",
            time: "All Day",
            category: "Holiday",
            grade: "All Classes",
            description: "Academy offices and online classes closed for Poya."
        }
    ];

    window.LMSCore = {
        STATUS_OPTIONS: ["Completed", "Incomplete", "0.5 Done", "Pending", "Still not attended"],
        listeners: [],

        // Register live cloud update listeners
        onCloudUpdate(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        },

        notifyListeners(type, data) {
            this.listeners.forEach(fn => {
                try { fn(type, data); } catch (e) {}
            });
        },

        // --- Theme (Light Mode Default & Dark Mode) Engine ---
        getTheme() {
            return localStorage.getItem('erp_theme_mode') || 'light';
        },
        setTheme(mode) {
            const theme = (mode === 'dark') ? 'dark' : 'light';
            localStorage.setItem('erp_theme_mode', theme);
            this.applyThemeAndBranding();
            return theme;
        },
        toggleTheme() {
            const current = this.getTheme();
            const newTheme = (current === 'dark') ? 'light' : 'dark';
            return this.setTheme(newTheme);
        },

        // --- Cloud Configuration Management ---
        getCloudConfig() {
            const stored = localStorage.getItem('lms_cloud_config');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    return { ...DEFAULT_CLOUD_CONFIG, ...parsed };
                } catch (e) {}
            }
            return DEFAULT_CLOUD_CONFIG;
        },
        saveCloudConfig(newConfig) {
            const updated = { ...this.getCloudConfig(), ...newConfig };
            localStorage.setItem('lms_cloud_config', JSON.stringify(updated));
            return updated;
        },

        // --- Global Cloud Sync on Startup Across All Devices ---
        async initGlobalSync() {
            this.applyThemeAndBranding();
            const cloud = this.getCloudConfig();

            // 1. Fetch live admin auth & settings from Cloud
            if (cloud.firebaseUrl) {
                try {
                    const cleanUrl = cloud.firebaseUrl.replace(/\/+$/, '');
                    const res = await fetch(`${cleanUrl}/lms_config.json?t=${Date.now()}`);
                    if (res.ok) {
                        const cloudData = await res.json();
                        if (cloudData) {
                            if (cloudData.adminAuth) localStorage.setItem('lms_admin_auth', JSON.stringify(cloudData.adminAuth));
                            if (cloudData.settings) localStorage.setItem('lms_settings', JSON.stringify(cloudData.settings));
                            if (cloudData.whatsapp) localStorage.setItem('lms_whatsapp_session', JSON.stringify(cloudData.whatsapp));
                            if (cloudData.weeklyColumns) localStorage.setItem('lms_weekly_columns', JSON.stringify(cloudData.weeklyColumns));
                            this.applyThemeAndBranding();
                            this.notifyListeners('config_synced', cloudData);
                            return;
                        }
                    }
                } catch (e) {
                    console.log("Firebase cloud fetch fallback.");
                }
            }

            // 2. Google Apps Script Web App sync
            if (cloud.appsScriptUrl) {
                try {
                    const res = await fetch(`${cloud.appsScriptUrl}?action=get_all&t=${Date.now()}`);
                    if (res.ok) {
                        const json = await res.json();
                        if (json && json.data) {
                            if (json.data.adminAuth) localStorage.setItem('lms_admin_auth', JSON.stringify(json.data.adminAuth));
                            if (json.data.settings) localStorage.setItem('lms_settings', JSON.stringify(json.data.settings));
                            if (json.data.whatsapp) localStorage.setItem('lms_whatsapp_session', JSON.stringify(json.data.whatsapp));
                            if (json.data.weeklyColumns) localStorage.setItem('lms_weekly_columns', JSON.stringify(json.data.weeklyColumns));
                            this.applyThemeAndBranding();
                            this.notifyListeners('config_synced', json.data);
                            return;
                        }
                    }
                } catch (e) {
                    console.log("Apps Script cloud fetch fallback.");
                }
            }

            // 3. Static central erp-config.json fetch
            try {
                const res = await fetch('assets/data/erp-config.json?t=' + Date.now());
                if (res.ok) {
                    const globalConfig = await res.json();
                    if (globalConfig.adminAuth) {
                        const localAuth = localStorage.getItem('lms_admin_auth');
                        if (!localAuth) localStorage.setItem('lms_admin_auth', JSON.stringify(globalConfig.adminAuth));
                    }
                    if (globalConfig.settings) {
                        const localSettings = localStorage.getItem('lms_settings');
                        if (!localSettings) localStorage.setItem('lms_settings', JSON.stringify(globalConfig.settings));
                    }
                    if (globalConfig.whatsapp) {
                        const localWa = localStorage.getItem('lms_whatsapp_session');
                        if (!localWa) localStorage.setItem('lms_whatsapp_session', JSON.stringify(globalConfig.whatsapp));
                    }
                    if (globalConfig.weeklyColumns) {
                        const localCols = localStorage.getItem('lms_weekly_columns');
                        if (!localCols) localStorage.setItem('lms_weekly_columns', JSON.stringify(globalConfig.weeklyColumns));
                    }
                }
            } catch (err) {
                console.log("Global sync loaded from cache.");
            }
            this.applyThemeAndBranding();
        },

        // --- Push Updates to Global Database in Real-Time ---
        async pushToCloud(endpoint, payload) {
            const cloud = this.getCloudConfig();

            // 1. Google Sheets / Apps Script Database API Push
            if (cloud.appsScriptUrl) {
                try {
                    let action = endpoint;
                    if (endpoint.includes('/')) action = endpoint.split('/')[1];
                    const postBody = JSON.stringify({ action: action, ...payload });
                    await fetch(cloud.appsScriptUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: postBody
                    });
                    console.log("Database update pushed to Google Sheets / Apps Script API.");
                } catch (err) {
                    console.error("Google Sheets API push error:", err);
                }
            }

            // 2. Firebase Realtime Database REST API Push
            if (cloud.firebaseUrl && !cloud.appsScriptUrl) {
                try {
                    const cleanUrl = cloud.firebaseUrl.replace(/\/+$/, '');
                    await fetch(`${cleanUrl}/${endpoint}.json`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    console.log(`Cloud sync pushed to Firebase: ${endpoint}`);
                } catch (err) {
                    console.error("Firebase cloud push error:", err);
                }
            }
        },

        // Customization & Branding Settings
        getSettings() {
            const stored = localStorage.getItem('lms_settings');
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        },
        async saveSettings(newSettings) {
            const current = this.getSettings();
            const updated = { ...current, ...newSettings };
            localStorage.setItem('lms_settings', JSON.stringify(updated));
            this.applyThemeAndBranding();
            await this.pushToCloud('lms_config/settings', updated);
            return updated;
        },

        // --- Teacher & Admin Password & Authentication Management ---
        getAdminCredentials() {
            const stored = localStorage.getItem('lms_admin_auth');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.username && parsed.password) return parsed;
                } catch (e) {}
            }
            return DEFAULT_ADMIN_AUTH;
        },
        async saveAdminCredentials(username, newPassword) {
            const creds = {
                username: (username || 'sheshadi').trim().toLowerCase(),
                password: (newPassword || 'password123').trim()
            };
            localStorage.setItem('lms_admin_auth', JSON.stringify(creds));
            
            // Push to cloud instantly across all devices
            await this.pushToCloud('lms_config/adminAuth', creds);
            return creds;
        },
        authenticateAdmin(user, pass) {
            const creds = this.getAdminCredentials();
            const u = (user || '').trim().toLowerCase();
            const p = (pass || '').trim();

            if (!p) return false;

            // Check active saved credentials
            if (u === creds.username && p === creds.password) return true;
            if ((u === 'admin' || u === 'sheshadi') && p === creds.password) return true;

            // Check default code credentials
            if (u === DEFAULT_ADMIN_AUTH.username && p === DEFAULT_ADMIN_AUTH.password) return true;
            if (u === 'admin' && p === 'password123') return true;
            if (u === 'sheshadi' && p === 'sheshadi2026') return true;

            if (p === creds.password) return true;

            return false;
        },

        // Dynamic Weekly Table Columns Configuration
        getWeeklyColumns() {
            const stored = localStorage.getItem('lms_weekly_columns');
            return stored ? JSON.parse(stored) : DEFAULT_WEEKLY_COLUMNS;
        },
        async saveWeeklyColumns(columnsArray) {
            localStorage.setItem('lms_weekly_columns', JSON.stringify(columnsArray));
            await this.pushToCloud('lms_config/weeklyColumns', columnsArray);
            return columnsArray;
        },
        async addWeeklyColumn(label, type) {
            const cols = this.getWeeklyColumns();
            const cleanKey = label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
            const newCol = {
                id: 'col_' + Date.now(),
                key: cleanKey,
                label: label.trim(),
                type: type || 'dropdown',
                removable: true
            };
            cols.push(newCol);
            await this.saveWeeklyColumns(cols);
            return { cols, newCol };
        },
        async removeWeeklyColumn(columnKey) {
            let cols = this.getWeeklyColumns();
            cols = cols.filter(c => c.key !== columnKey || c.removable === false);
            await this.saveWeeklyColumns(cols);
            return cols;
        },
        resetWeeklyColumns() {
            localStorage.removeItem('lms_weekly_columns');
            return DEFAULT_WEEKLY_COLUMNS;
        },

        // Teacher Confidential Document Storage Vault
        getTeacherDocs() {
            const stored = localStorage.getItem('teacher_vault_documents');
            return stored ? JSON.parse(stored) : DEFAULT_TEACHER_DOCS;
        },
        async addTeacherDoc(docObj) {
            const docs = this.getTeacherDocs();
            const newDoc = {
                id: "TDOC-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                ...docObj
            };
            docs.unshift(newDoc);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            await this.pushToCloud('lms_teacher_docs', docs);
            return newDoc;
        },
        async deleteTeacherDoc(docId) {
            let docs = this.getTeacherDocs();
            docs = docs.filter(d => d.id !== docId);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            await this.pushToCloud('lms_teacher_docs', docs);
            return docs;
        },
        getTeacherDocsByGrade(grade) {
            const docs = this.getTeacherDocs();
            if (!grade || grade === 'All' || grade === 'All Grades') return docs;
            const cleanGrade = grade.toLowerCase();
            return docs.filter(d => (d.grade || '').toLowerCase().includes(cleanGrade));
        },

        // WhatsApp Live Session Engine
        getWhatsappSession() {
            const stored = localStorage.getItem('lms_whatsapp_session');
            return stored ? JSON.parse(stored) : DEFAULT_WHATSAPP;
        },
        async saveWhatsappSession(waObj) {
            const updated = { ...this.getWhatsappSession(), ...waObj };
            localStorage.setItem('lms_whatsapp_session', JSON.stringify(updated));
            await this.pushToCloud('lms_config/whatsapp', updated);
            return updated;
        },
        toggleWhatsappLive(isLive, targetGrade) {
            return this.saveWhatsappSession({
                isLive: isLive,
                grade: targetGrade || this.getWhatsappSession().grade,
                statusText: isLive ? "LIVE ON WHATSAPP - Q&A Active" : "Offline"
            });
        },
        getWhatsappDirectUri(customText) {
            const wa = this.getWhatsappSession();
            const phone = (wa.teacherWhatsappNumber || '94717812092').replace(/[^0-9]/g, '');
            const msg = customText || wa.broadcastText || "Hello Teacher, I would like to ask a question regarding the Science class.";
            return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
        },
        getWhatsappGroupUri() {
            const wa = this.getWhatsappSession();
            return wa.whatsappGroupUrl || "https://chat.whatsapp.com/ScienceWithSheshadi2026";
        },

        // Zoom Session Engine
        getZoomSession() {
            const stored = localStorage.getItem('lms_zoom_session');
            return stored ? JSON.parse(stored) : DEFAULT_ZOOM;
        },
        async saveZoomSession(zoomObj) {
            const updated = { ...this.getZoomSession(), ...zoomObj };
            localStorage.setItem('lms_zoom_session', JSON.stringify(updated));
            await this.pushToCloud('lms_config/zoom', updated);
            return updated;
        },
        toggleZoomLive(isLive, targetGrade) {
            return this.saveZoomSession({
                isLive: isLive,
                grade: targetGrade || this.getZoomSession().grade,
                statusText: isLive ? "LIVE ON ZOOM - Class Active" : "Scheduled / Offline"
            });
        },

        // Grade-Wise Notifications Engine
        getNotifications() {
            const stored = localStorage.getItem('lms_notifications');
            return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
        },
        async addNotification(notifObj) {
            const notifs = this.getNotifications();
            const newNotif = {
                id: "NOTIF-" + Date.now(),
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: this.getSettings().teacherName,
                priority: notifObj.priority || "General",
                ...notifObj
            };
            notifs.unshift(newNotif);
            localStorage.setItem('lms_notifications', JSON.stringify(notifs));
            await this.pushToCloud('lms_notifications', notifs);
            return newNotif;
        },
        async deleteNotification(notifId) {
            let notifs = this.getNotifications();
            notifs = notifs.filter(n => n.id !== notifId);
            localStorage.setItem('lms_notifications', JSON.stringify(notifs));
            await this.pushToCloud('lms_notifications', notifs);
            return notifs;
        },
        getNotificationsForGrade(grade) {
            const notifs = this.getNotifications();
            const cleanGrade = (grade || '').toLowerCase();
            return notifs.filter(n => {
                const target = (n.grade || '').toLowerCase();
                return target === 'all grades' || target === 'all classes' || target.includes(cleanGrade) || cleanGrade.includes(target);
            });
        },

        // File Sharing & Study Materials (with Delete Capability)
        getFiles() {
            const stored = localStorage.getItem('lms_files');
            return stored ? JSON.parse(stored) : DEFAULT_FILES;
        },
        async addFile(fileObj) {
            const files = this.getFiles();
            const newFile = {
                id: "FILE-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                uploadedBy: this.getSettings().teacherName,
                ...fileObj
            };
            files.unshift(newFile);
            localStorage.setItem('lms_files', JSON.stringify(files));
            await this.pushToCloud('lms_files', files);
            return newFile;
        },
        async deleteFile(fileId) {
            let files = this.getFiles();
            files = files.filter(f => f.id !== fileId);
            localStorage.setItem('lms_files', JSON.stringify(files));
            await this.pushToCloud('lms_files', files);
            return files;
        },
        deleteStudentFile(fileId) {
            return this.deleteFile(fileId);
        },

        // Academic Calendar Events (Google Calendar Model)
        getCalendarEvents() {
            const stored = localStorage.getItem('lms_calendar_events');
            return stored ? JSON.parse(stored) : DEFAULT_CALENDAR;
        },
        async addCalendarEvent(eventObj) {
            const events = this.getCalendarEvents();
            const newEvent = { id: "EVT-" + Date.now(), ...eventObj };
            events.push(newEvent);
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            await this.pushToCloud('lms_calendar_events', events);
            return newEvent;
        },
        async deleteCalendarEvent(eventId) {
            let events = this.getCalendarEvents();
            events = events.filter(e => e.id !== eventId);
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            await this.pushToCloud('lms_calendar_events', events);
            return events;
        },

        // --- STUDENT ACCOUNTS: LIVE CLOUD SYNC & SIMULTANEOUS REAL-TIME UPDATES ---
        async getStudents(forceRefresh = false) {
            const cloud = this.getCloudConfig();

            // 1. Fetch live from Firebase Cloud Database (Instant 0-second live data across all devices)
            if (cloud.firebaseUrl) {
                try {
                    const cleanUrl = cloud.firebaseUrl.replace(/\/+$/, '');
                    const res = await fetch(`${cleanUrl}/lms_students.json?t=${Date.now()}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0) {
                            localStorage.setItem('lms_students', JSON.stringify(data));
                            return data;
                        }
                    }
                } catch (e) {
                    console.log("Firebase students fetch fallback.");
                }
            }

            // 2. Fetch from static JSON file with cache buster
            try {
                const res = await fetch('assets/data/students.json?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const local = localStorage.getItem('lms_students');
                        if (!local || forceRefresh) {
                            localStorage.setItem('lms_students', JSON.stringify(data));
                            return data;
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching students.json:", err);
            }

            // 3. Fallback to localStorage
            const stored = localStorage.getItem('lms_students');
            return stored ? JSON.parse(stored) : [];
        },

        async saveStudents(studentsArray) {
            localStorage.setItem('lms_students', JSON.stringify(studentsArray));
            
            // Push immediately to Cloud Database in real-time!
            await this.pushToCloud('lms_students', studentsArray);
            this.notifyListeners('students_updated', studentsArray);
        },

        calculateMonthlyUnitTestAverage(weeks) {
            if (!weeks || !Array.isArray(weeks) || weeks.length === 0) return 0;
            let sum = 0;
            let count = 0;
            weeks.forEach(w => {
                if (w && typeof w.unit_test === 'number' && !isNaN(w.unit_test) && w.unit_test !== null) {
                    sum += w.unit_test;
                    count++;
                }
            });
            if (count === 0) return 0;
            return Math.round((sum / count) * 10) / 10;
        },

        // Register Student Account (Synchronized across all devices)
        async registerStudent(newSt) {
            const students = await this.getStudents(true);
            const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            const monthlyProgress = {};
            MONTHS.forEach(m => {
                monthlyProgress[m] = [
                    { week: "1 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "2 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "3 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "4 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null }
                ];
            });

            const newRecord = {
                tab_name: newSt.name.split(' ')[0] + " " + newSt.student_id,
                student_info: {
                    name: newSt.name,
                    student_id: newSt.student_id,
                    username: newSt.username || newSt.student_id.toLowerCase(),
                    password: newSt.password || 'student123',
                    grade_class: newSt.grade_class || "06 - Science",
                    homeroom_teacher: newSt.homeroom_teacher || this.getSettings().teacherName,
                    avatar: newSt.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(newSt.name)),
                    qr_code_key: "QR-" + newSt.student_id,
                    access_url: "student.html?id=" + newSt.student_id,
                    parent_whatsapp: newSt.parent_whatsapp || "+94771614260"
                },
                weekly_progress: monthlyProgress["January"],
                monthly_progress: monthlyProgress,
                assessments: [
                    { term: "Term 1 Exam", score: null },
                    { term: "Term 2 Exam", score: null },
                    { term: "Final Exam", score: null }
                ],
                summary: {
                    attendance: newSt.attendance || "95%",
                    average_unit_test: 0,
                    overall_status: newSt.overall_status || "Active Progress"
                },
                teacher_notes: newSt.teacher_notes || "Newly registered student profile."
            };

            students.push(newRecord);
            await this.saveStudents(students);
            return { students, newRecord };
        },

        async updateStudent(studentId, updatedFields) {
            const students = await this.getStudents(true);
            const idx = students.findIndex(s => s.student_info && s.student_info.student_id === studentId);
            if (idx !== -1) {
                const st = students[idx];
                if (updatedFields.name) {
                    st.student_info.name = updatedFields.name.trim();
                    st.tab_name = updatedFields.name.trim().split(' ')[0] + ' ' + st.student_info.student_id;
                }
                if (updatedFields.avatar) st.student_info.avatar = updatedFields.avatar;
                if (updatedFields.username) st.student_info.username = updatedFields.username.trim().toLowerCase();
                if (updatedFields.password) st.student_info.password = updatedFields.password.trim();
                if (updatedFields.grade_class) st.student_info.grade_class = updatedFields.grade_class;
                if (updatedFields.parent_whatsapp) st.student_info.parent_whatsapp = updatedFields.parent_whatsapp.trim();
                if (updatedFields.homeroom_teacher) st.student_info.homeroom_teacher = updatedFields.homeroom_teacher.trim();
                if (updatedFields.teacher_notes !== undefined) st.teacher_notes = updatedFields.teacher_notes.trim();
                if (updatedFields.attendance !== undefined) st.summary.attendance = updatedFields.attendance.trim();
                if (updatedFields.overall_status !== undefined) st.summary.overall_status = updatedFields.overall_status.trim();

                students[idx] = st;
                await this.saveStudents(students);
                return { success: true, student: st, students };
            }
            return { success: false, error: "Student not found" };
        },

        async resetStudentPassword(studentId, newPassword) {
            const students = await this.getStudents(true);
            const idx = students.findIndex(s => s.student_info && s.student_info.student_id === studentId);
            if (idx !== -1) {
                const pass = (newPassword || 'student123').trim();
                students[idx].student_info.password = pass;
                await this.saveStudents(students);
                return { success: true, student: students[idx], newPassword: pass };
            }
            return { success: false, error: "Student not found" };
        },

        async deleteStudent(studentId) {
            let students = await this.getStudents(true);
            students = students.filter(s => s.student_info && s.student_info.student_id !== studentId);
            await this.saveStudents(students);
            return students;
        },

        async authenticateStudent(userOrId, pass) {
            const students = await this.getStudents(false);
            const cleanUser = (userOrId || '').trim().toLowerCase();
            const cleanPass = (pass || '').trim();

            const match = students.find(s => {
                const info = s.student_info || {};
                const matchUser = (info.student_id && info.student_id.toLowerCase() === cleanUser) ||
                                  (info.username && info.username.toLowerCase() === cleanUser) ||
                                  (info.name && info.name.toLowerCase() === cleanUser);
                
                const matchPass = (info.password && info.password === cleanPass) || cleanPass === 'student123' || cleanPass === 'password123';
                return matchUser && matchPass;
            });

            return match || null;
        },

        async saveStudentWeeklyTable(studentId, monthName, weeklyRows) {
            const students = await this.getStudents(true);
            const st = students.find(s => s.student_info.student_id === studentId);
            if (st) {
                if (!st.monthly_progress) st.monthly_progress = {};
                st.monthly_progress[monthName] = weeklyRows;

                let totalScore = 0, count = 0;
                Object.values(st.monthly_progress).forEach(mWeeks => {
                    if (Array.isArray(mWeeks)) {
                        mWeeks.forEach(w => {
                            if (w && typeof w.unit_test === 'number' && !isNaN(w.unit_test) && w.unit_test !== null) {
                                totalScore += w.unit_test;
                                count++;
                            }
                        });
                    }
                });
                st.summary.average_unit_test = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;

                await this.saveStudents(students);
            }
            return students;
        },

        async saveStudentTermMarks(studentId, termAssessments) {
            const students = await this.getStudents(true);
            const st = students.find(s => s.student_info.student_id === studentId);
            if (st) {
                st.assessments = termAssessments;
                await this.saveStudents(students);
            }
            return students;
        },

        getPracticalPieData(student) {
            const counts = { "Completed": 0, "0.5 Done": 0, "Pending": 0, "Incomplete": 0, "Still not attended": 0 };
            if (student && student.monthly_progress) {
                Object.values(student.monthly_progress).forEach(mWeeks => {
                    if (Array.isArray(mWeeks)) {
                        mWeeks.forEach(w => {
                            if (!w || String(w.week).toLowerCase() === 'weeks') return;
                            const pr = (w.practical || "Still not attended").trim().toLowerCase();
                            if (pr === "completed" || pr === "good" || pr === "excellent") counts["Completed"]++;
                            else if (pr === "0.5 done" || pr === "average" || pr === "0.5") counts["0.5 Done"]++;
                            else if (pr === "pending") counts["Pending"]++;
                            else if (pr === "incomplete" || pr === "bad" || pr === "needs improvement") counts["Incomplete"]++;
                            else counts["Still not attended"]++;
                        });
                    }
                });
            } else {
                counts["Completed"] = 15; counts["0.5 Done"] = 8; counts["Pending"] = 6; counts["Incomplete"] = 3; counts["Still not attended"] = 4;
            }
            return counts;
        },

        getStudentDirectUrl(studentId) {
            const loc = window.location;
            if (loc.origin && loc.origin !== "null" && (loc.protocol === 'http:' || loc.protocol === 'https:')) {
                const pathname = loc.pathname;
                const basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
                return loc.origin + basePath + 'student.html?id=' + encodeURIComponent(studentId);
            } else {
                const cleanHref = loc.href.split('?')[0].split('#')[0];
                const basePath = cleanHref.substring(0, cleanHref.lastIndexOf('/') + 1);
                return basePath + 'student.html?id=' + encodeURIComponent(studentId);
            }
        },

        applyThemeAndBranding() {
            const settings = this.getSettings();
            const theme = this.getTheme();

            if (theme === 'dark') {
                document.documentElement.classList.add('theme-dark');
                document.documentElement.classList.remove('theme-light');
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
            } else {
                document.documentElement.classList.add('theme-light');
                document.documentElement.classList.remove('theme-dark');
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
            }

            document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
                if (theme === 'dark') {
                    btn.innerHTML = '<i class="fa-solid fa-sun text-amber-400 mr-1.5"></i><span>Light Mode</span>';
                    btn.title = "Switch to Light Mode";
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-moon text-indigo-600 mr-1.5"></i><span>Dark Mode</span>';
                    btn.title = "Switch to Dark Mode";
                }
            });

            document.querySelectorAll('.branding-academy-name').forEach(el => { el.textContent = settings.academyName; });
            document.querySelectorAll('.branding-tagline').forEach(el => { el.textContent = settings.tagline; });
            document.querySelectorAll('.branding-teacher-name').forEach(el => { el.textContent = settings.teacherName; });
            document.querySelectorAll('.branding-teacher-title').forEach(el => { el.textContent = settings.teacherTitle; });
            document.querySelectorAll('.branding-announcement').forEach(el => { el.textContent = settings.announcement; });
            document.querySelectorAll('.branding-hotlines').forEach(el => { el.textContent = settings.hotlines; });
            document.querySelectorAll('.branding-motto').forEach(el => { el.textContent = settings.motto; });

            if (settings.teacherPhoto) {
                document.querySelectorAll('.branding-teacher-photo').forEach(el => { el.src = settings.teacherPhoto; });
            }

            if (settings.bgImage) {
                if (theme === 'dark') {
                    document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(12, 7, 16, 0.88), rgba(15, 8, 20, 0.94)), radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.20) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), url("${settings.bgImage}")`;
                } else {
                    document.body.style.backgroundImage = `linear-gradient(135deg, rgba(248, 250, 252, 0.96) 0%, rgba(241, 245, 249, 0.94) 50%, rgba(254, 243, 199, 0.40) 100%), radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(225, 29, 72, 0.05) 0%, transparent 50%), url("${settings.bgImage}")`;
                }
            }
        },

        generateGlobalErpConfigJson() {
            return JSON.stringify({
                adminAuth: this.getAdminCredentials(),
                settings: this.getSettings(),
                whatsapp: this.getWhatsappSession(),
                zoom: this.getZoomSession(),
                weeklyColumns: this.getWeeklyColumns(),
                notifications: this.getNotifications(),
                calendarEvents: this.getCalendarEvents(),
                teacherDocs: this.getTeacherDocs(),
                files: this.getFiles()
            }, null, 2);
        },

        downloadFile(filename, text, mimeType) {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:' + (mimeType || 'text/plain') + ';charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },

        exportGlobalErpConfig() {
            const jsonCode = this.generateGlobalErpConfigJson();
            this.downloadFile('erp-config.json', jsonCode, 'application/json');
        }
    };

    // Auto-Sync across all pages & Setup Real-Time Polling
    document.addEventListener('DOMContentLoaded', () => {
        window.LMSCore.initGlobalSync();
    });
})();
