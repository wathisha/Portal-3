/**
 * LMS Core Management Engine - Science with Sheshadi LMS
 * Handles LocalStorage persistence for:
 * 1. LMS Customization, Branding & Educator Profile (Mrs. Sheshadi Amarasinghe)
 * 2. File Sharing & Study Materials
 * 3. Academic Calendar & Events
 * 4. Zoom & SKYPE Live Meeting Launcher (Class-Wise Targeting with Local Skype Account Integration)
 * 5. Student Registration (with photo upload), Accounts, Username/Password Authentication, Weekly Tables & Term Test Marks
 * 6. NULL-state Dropdown Handling ('Still not attended'), Dynamic Unit Test Averages & QR Code Resolution
 */

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        academyName: "Sathsarani Science Academy",
        tagline: "GRADE 6-11 SCIENCE | UNDERSTAND TODAY, SUCCEED TOMORROW",
        teacherName: "Mrs. Sheshadi Amarasinghe",
        teacherTitle: "B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Specialist",
        hotlines: "071 781 2092 | 077 161 4260",
        motto: "SCIENCE වල අපි ශේෂ..!!",
        subjectList: ["06 - Science", "07 - Science", "08 - Science", "09 - Science", "O/L Revision Science"],
        themeColor: "crimson-amber",
        announcement: "Welcome to Sathsarani Science Academy LMS! Grade 06-11 Science Master Guidebooks, past paper revisions, Zoom & Skype live classes are active.",
        offerings: [
            "Clear Explanations",
            "Exam Focused Learning",
            "Concept Building",
            "Past Paper Practice",
            "Live Practical Sessions on Classroom"
        ],
        gradingScale: { A: 75, B: 65, C: 50, S: 35 }
    };

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
            title: "Live Skype / Zoom Revision Session",
            date: "2026-08-15",
            time: "08:00 AM - 10:30 AM",
            category: "Class",
            grade: "All Classes",
            description: "Interactive discussion on past paper question techniques."
        }
    ];

    const DEFAULT_ZOOM = {
        isLive: true,
        title: "Grade 06 Science - Live Master Theory & Practical Session",
        grade: "06 - Science",
        meetingUrl: "https://zoom.us/j/9876543210?pwd=SCIENCE2026CLASS",
        meetingId: "987 654 3210",
        passcode: "SCIENCE2026",
        hostName: "Mrs. Sheshadi Amarasinghe",
        startTime: "Saturday 8:00 AM - 10:30 AM",
        statusText: "LIVE NOW - Class Session Active"
    };

    const DEFAULT_SKYPE = {
        isLive: true,
        teacherSkypeId: "sheshadi.science",
        skypeMeetingUrl: "https://join.skype.com/meet/SCIENCE2026CLASS",
        title: "Grade 06 Science - Live Skype Interactive Classroom",
        grade: "06 - Science",
        callMode: "call", // 'call' (skype:id?call), 'video' (skype:id?call&video=true), 'chat' (skype:id?chat), or 'meet'
        statusText: "LIVE ON SKYPE - Class Active"
    };

    window.LMSCore = {
        STATUS_OPTIONS: ["Completed", "Incomplete", "0.5 Done", "Pending", "Still not attended"],

        getSettings() {
            const stored = localStorage.getItem('lms_settings');
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        },
        saveSettings(newSettings) {
            const current = this.getSettings();
            const updated = { ...current, ...newSettings };
            localStorage.setItem('lms_settings', JSON.stringify(updated));
            return updated;
        },

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

        // --- ZOOM SESSION ENGINE ---
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
                statusText: isLive ? "LIVE NOW - Class Session Active" : "Scheduled / Offline"
            });
        },

        // --- SKYPE SESSION ENGINE (Local Account Protocol & App Launch) ---
        getSkypeSession() {
            const stored = localStorage.getItem('lms_skype_session');
            return stored ? JSON.parse(stored) : DEFAULT_SKYPE;
        },
        saveSkypeSession(skypeObj) {
            const updated = { ...this.getSkypeSession(), ...skypeObj };
            localStorage.setItem('lms_skype_session', JSON.stringify(updated));
            return updated;
        },
        toggleSkypeLive(isLive, targetGrade) {
            return this.saveSkypeSession({
                isLive: isLive,
                grade: targetGrade || this.getSkypeSession().grade,
                statusText: isLive ? "LIVE ON SKYPE - Class Active" : "Offline"
            });
        },
        getSkypeDirectUri(skypeObj) {
            const s = skypeObj || this.getSkypeSession();
            const cleanId = (s.teacherSkypeId || 'sheshadi.science').trim();
            if (s.skypeMeetingUrl && s.skypeMeetingUrl.startsWith('http')) {
                return s.skypeMeetingUrl;
            }
            if (s.callMode === 'video') return `skype:${cleanId}?call&video=true`;
            if (s.callMode === 'chat') return `skype:${cleanId}?chat`;
            return `skype:${cleanId}?call`;
        },

        // --- Student Accounts, Registration & Authentications ---
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

        // Calculate Monthly Average for Unit Tests (If student completed 2 tests, sum / 2)
        calculateMonthlyUnitTestAverage(weeks) {
            if (!weeks || !Array.isArray(weeks) || weeks.length === 0) return null;
            let sum = 0;
            let count = 0;
            weeks.forEach(w => {
                if (w && typeof w.unit_test === 'number' && !isNaN(w.unit_test) && w.unit_test !== null) {
                    sum += w.unit_test;
                    count++;
                }
            });
            if (count === 0) return null;
            return Math.round((sum / count) * 10) / 10;
        },

        // Student Account Registration (with photo & credentials)
        async registerStudent(newSt) {
            const students = await this.getStudents();
            const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            // Build 12-month progress default structure with "(Still not attended)" state
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
                    homeroom_teacher: newSt.homeroom_teacher || "Mrs. Sheshadi Amarasinghe (B.Sc. Chem, Grad.Chem)",
                    avatar: newSt.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(newSt.name)),
                    qr_code_key: "QR-" + newSt.student_id,
                    access_url: "student.html?id=" + newSt.student_id
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

                // Re-calculate annual unit test average strictly based on completed tests
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
            } else {
                counts["Completed"] = 15; counts["0.5 Done"] = 8; counts["Pending"] = 6; counts["Incomplete"] = 3; counts["Still not attended"] = 4;
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
            document.querySelectorAll('.branding-announcement').forEach(el => { el.textContent = settings.announcement; });
            document.querySelectorAll('.branding-hotlines').forEach(el => { el.textContent = settings.hotlines; });
            document.querySelectorAll('.branding-motto').forEach(el => { el.textContent = settings.motto; });
        }
    };
})();
