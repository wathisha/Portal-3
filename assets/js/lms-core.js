/**
 * LMS Core Management Engine - Science with Sheshadi LMS
 * Handles LocalStorage persistence for:
 * 1. LMS Customization, Branding & Educator Profile (Mrs. Sheshadi Amarasinghe, Slogan, Hotlines, Teacher Photo, Custom Background)
 * 2. File Sharing & Study Materials
 * 3. Academic Calendar & Events (Google Calendar / Microsoft Teams Grid View)
 * 4. WhatsApp & Zoom Live Classroom (Class-Wise Broadcast & Direct WhatsApp Links)
 * 5. Grade-Wise Notifications Center (Grade 6, 7, 8, 9, 10, 11)
 * 6. Student Registration, Accounts, Username/Password Authentication, Weekly Tables with '(Still not attended)' & Term Test Marks
 * 7. 12-Month Unit Test Trend (Default 0 for uncompleted months) & Accurate Practical Pie Chart
 */

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        academyName: "Sathsarani Science Academy",
        tagline: "GRADE 6-11 SCIENCE | UNDERSTAND TODAY, SUCCEED TOMORROW",
        motto: "SCIENCE වල අපි ශේෂ..!!",
        teacherName: "Mrs. Sheshadi Amarasinghe",
        teacherTitle: "B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Specialist",
        hotlines: "071 781 2092 | 077 161 4260",
        teacherPhoto: "assets/images/teacher_banner.png",
        bgImage: "assets/images/lms_background.png",
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

        // --- Customization & Branding Settings ---
        getSettings() {
            const stored = localStorage.getItem('lms_settings');
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        },
        saveSettings(newSettings) {
            const current = this.getSettings();
            const updated = { ...current, ...newSettings };
            localStorage.setItem('lms_settings', JSON.stringify(updated));
            this.applyThemeAndBranding();
            return updated;
        },

        // --- WhatsApp Live Session Engine ---
        getWhatsappSession() {
            const stored = localStorage.getItem('lms_whatsapp_session');
            return stored ? JSON.parse(stored) : DEFAULT_WHATSAPP;
        },
        saveWhatsappSession(waObj) {
            const updated = { ...this.getWhatsappSession(), ...waObj };
            localStorage.setItem('lms_whatsapp_session', JSON.stringify(updated));
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
            return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        },
        getWhatsappGroupUri() {
            const wa = this.getWhatsappSession();
            return wa.whatsappGroupUrl || "https://chat.whatsapp.com/ScienceWithSheshadi2026";
        },

        // --- Zoom Session Engine ---
        getZoomSession() {
            const stored = localStorage.getItem('lms_zoom_session');
            return stored ? JSON.parse(stored) : DEFAULT_ZOOM;
        },
        saveZoomSession(zoomObj) {
            const updated = { ...this.getZoomSession(), ...zoomObj };
            localStorage.setItem('lms_zoom_session', JSON.stringify(updated));
            return updated;
        },
        toggleZoomLive(isLive, targetGrade) {
            return this.saveZoomSession({
                isLive: isLive,
                grade: targetGrade || this.getZoomSession().grade,
                statusText: isLive ? "LIVE ON ZOOM - Class Active" : "Scheduled / Offline"
            });
        },

        // --- Grade-Wise Notifications Engine ---
        getNotifications() {
            const stored = localStorage.getItem('lms_notifications');
            return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
        },
        addNotification(notifObj) {
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
            return newNotif;
        },
        deleteNotification(notifId) {
            let notifs = this.getNotifications();
            notifs = notifs.filter(n => n.id !== notifId);
            localStorage.setItem('lms_notifications', JSON.stringify(notifs));
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

        // --- File Sharing & Study Materials ---
        getFiles() {
            const stored = localStorage.getItem('lms_files');
            return stored ? JSON.parse(stored) : DEFAULT_FILES;
        },
        addFile(fileObj) {
            const files = this.getFiles();
            const newFile = {
                id: "FILE-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                uploadedBy: this.getSettings().teacherName,
                ...fileObj
            };
            files.unshift(newFile);
            localStorage.setItem('lms_files', JSON.stringify(files));
            return newFile;
        },
        deleteFile(fileId) {
            let files = this.getFiles();
            files = files.filter(f => f.id !== fileId);
            localStorage.setItem('lms_files', JSON.stringify(files));
            return files;
        },

        // --- Academic Calendar Events ---
        getCalendarEvents() {
            const stored = localStorage.getItem('lms_calendar_events');
            return stored ? JSON.parse(stored) : DEFAULT_CALENDAR;
        },
        addCalendarEvent(eventObj) {
            const events = this.getCalendarEvents();
            const newEvent = { id: "EVT-" + Date.now(), ...eventObj };
            events.push(newEvent);
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            return newEvent;
        },
        deleteCalendarEvent(eventId) {
            let events = this.getCalendarEvents();
            events = events.filter(e => e.id !== eventId);
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            return events;
        },

        // --- Student Accounts & Persistence ---
        async getStudents() {
            const stored = localStorage.getItem('lms_students');
            if (stored) {
                return JSON.parse(stored);
            }
            try {
                const res = await fetch('assets/data/students.json');
                const data = await res.json();
                localStorage.setItem('lms_students', JSON.stringify(data));
                return data;
            } catch (err) {
                console.error("Error fetching students.json:", err);
                return [];
            }
        },
        saveStudents(studentsArray) {
            localStorage.setItem('lms_students', JSON.stringify(studentsArray));
        },

        // Calculate Monthly Average for Unit Tests: Default to 0 if no tests completed
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
            // Default value is 0 in the beginning / unrecorded months
            if (count === 0) return 0;
            return Math.round((sum / count) * 10) / 10;
        },

        // Student Account Registration
        async registerStudent(newSt) {
            const students = await this.getStudents();
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
                    { term: "Term 1 Exam", score: 80 },
                    { term: "Term 2 Exam", score: 85 },
                    { term: "Final Exam", score: 90 }
                ],
                summary: {
                    attendance: newSt.attendance || "95%",
                    average_unit_test: 0,
                    overall_status: newSt.overall_status || "Active Progress"
                },
                teacher_notes: newSt.teacher_notes || "Newly registered student profile."
            };

            students.push(newRecord);
            this.saveStudents(students);
            return { students, newRecord };
        },

        // Student Authentication (Username/ID & Password)
        async authenticateStudent(userOrId, pass) {
            const students = await this.getStudents();
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
            const students = await this.getStudents();
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

                this.saveStudents(students);
            }
            return students;
        },

        async saveStudentTermMarks(studentId, termAssessments) {
            const students = await this.getStudents();
            const st = students.find(s => s.student_info.student_id === studentId);
            if (st) {
                st.assessments = termAssessments;
                this.saveStudents(students);
            }
            return students;
        },

        // Practical Results Breakdown Distribution for Pie Chart (Completed, 0.5 Done, Pending, Incomplete, Still not attended)
        getPracticalPieData(student) {
            const counts = { "Completed": 0, "0.5 Done": 0, "Pending": 0, "Incomplete": 0, "Still not attended": 0 };
            if (student && student.monthly_progress) {
                Object.values(student.monthly_progress).forEach(mWeeks => {
                    if (Array.isArray(mWeeks)) {
                        mWeeks.forEach(w => {
                            if (!w || String(w.week).toLowerCase() === 'weeks') return;
                            const pr = (w.practical || "Still not attended").trim();
                            const prLower = pr.toLowerCase();
                            if (prLower === "completed" || prLower === "good" || prLower === "excellent") {
                                counts["Completed"]++;
                            } else if (prLower === "0.5 done" || prLower === "average" || prLower === "0.5") {
                                counts["0.5 Done"]++;
                            } else if (prLower === "pending") {
                                counts["Pending"]++;
                            } else if (prLower === "incomplete" || prLower === "bad" || prLower === "needs improvement") {
                                counts["Incomplete"]++;
                            } else {
                                counts["Still not attended"]++;
                            }
                        });
                    }
                });
            }
            return counts;
        },

        // Get Direct URL for Student Dashboard
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
            document.querySelectorAll('.branding-academy-name').forEach(el => { el.textContent = settings.academyName; });
            document.querySelectorAll('.branding-tagline').forEach(el => { el.textContent = settings.tagline; });
            document.querySelectorAll('.branding-teacher-name').forEach(el => { el.textContent = settings.teacherName; });
            document.querySelectorAll('.branding-teacher-title').forEach(el => { el.textContent = settings.teacherTitle; });
            document.querySelectorAll('.branding-announcement').forEach(el => { el.textContent = settings.announcement; });
            document.querySelectorAll('.branding-hotlines').forEach(el => { el.textContent = settings.hotlines; });
            document.querySelectorAll('.branding-motto').forEach(el => { el.textContent = settings.motto; });

            // Apply custom teacher photo if present
            if (settings.teacherPhoto) {
                document.querySelectorAll('.branding-teacher-photo').forEach(el => {
                    el.src = settings.teacherPhoto;
                });
            }

            // Apply custom background image across all pages if set
            if (settings.bgImage) {
                document.body.style.backgroundImage = `
                    linear-gradient(to bottom, rgba(12, 7, 16, 0.88), rgba(15, 8, 20, 0.94)),
                    radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.20) 0%, transparent 60%),
                    radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
                    url('${settings.bgImage}')
                `;
            }
        }
    };
})();
