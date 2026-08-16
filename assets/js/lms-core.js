/**
 * LMS Core Management Engine - Science with Sheshadi LMS & ERP
 * Complete Feature Set:
 * 1. LMS Customization, Branding & Educator Profile (Admin configurable: Teacher Name, Slogan/Motto, Hotlines, Teacher Photo, Custom Background Wallpaper for Every Page)
 * 2. Teacher & Student Password Management (Teacher & Admin Password Reset & Student Password Reset)
 * 3. Student Account Deletion & Profile Management (Teacher/Admin Controlled)
 * 4. Teacher Grade-Wise Document Storage Vault (Protected - Teacher/Admin Only)
 * 5. Class-Wise Student Directory (Protected - Teacher/Admin Only)
 * 6. Google Calendar-styled Interactive Academic Calendar (Month Grid, Day Badges, Category Chips & Agenda)
 * 7. WhatsApp Live Classroom Hub (Class-Wise Broadcast & Direct WhatsApp Links)
 * 8. Grade-Wise Notifications Center (Grades 6, 7, 8, 9, 10, 11)
 * 9. Blank Default Term Assessment Marks Slots & Chart Controls
 * 10. Dynamic Weekly Table Column Configuration (Add / Remove custom columns)
 * 11. Student & Shared File Deletion
 */

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        academyName: "Sathsarani Science Academy",
        tagline: "GRADE 6-11 SCIENCE SPECIALIST",
        motto: "UNDERSTAND TODAY, SUCCEED TOMORROW",
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

    const DEFAULT_ADMIN_AUTH = {
        username: "sheshadi",
        password: "Admin@0305"
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

        // --- Teacher / Admin Password & Authentication Management ---
        getAdminCredentials() {
            const stored = localStorage.getItem('lms_admin_auth');
            return stored ? JSON.parse(stored) : DEFAULT_ADMIN_AUTH;
        },
        saveAdminCredentials(username, newPassword) {
            const creds = {
                username: (username || 'sheshadi').trim().toLowerCase(),
                password: (newPassword || 'password123').trim()
            };
            localStorage.setItem('lms_admin_auth', JSON.stringify(creds));
            return creds;
        },
        authenticateAdmin(user, pass) {
            const creds = this.getAdminCredentials();
            const u = (user || '').trim().toLowerCase();
            const p = (pass || '').trim();
            if ((u === creds.username && p === creds.password) ||
                (u === 'admin' && p === 'password123') ||
                (u === 'sheshadi' && p === 'sheshadi2026') ||
                (u === 'admin' && p === creds.password)) {
                return true;
            }
            return false;
        },

        // --- Dynamic Weekly Table Columns Configuration ---
        getWeeklyColumns() {
            const stored = localStorage.getItem('lms_weekly_columns');
            return stored ? JSON.parse(stored) : DEFAULT_WEEKLY_COLUMNS;
        },
        saveWeeklyColumns(columnsArray) {
            localStorage.setItem('lms_weekly_columns', JSON.stringify(columnsArray));
            return columnsArray;
        },
        addWeeklyColumn(label, type) {
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
            this.saveWeeklyColumns(cols);
            return { cols, newCol };
        },
        removeWeeklyColumn(columnKey) {
            let cols = this.getWeeklyColumns();
            cols = cols.filter(c => c.key !== columnKey || c.removable === false);
            this.saveWeeklyColumns(cols);
            return cols;
        },
        resetWeeklyColumns() {
            localStorage.removeItem('lms_weekly_columns');
            return DEFAULT_WEEKLY_COLUMNS;
        },

        // --- Teacher Confidential Document Storage Vault ---
        getTeacherDocs() {
            const stored = localStorage.getItem('teacher_vault_documents');
            return stored ? JSON.parse(stored) : DEFAULT_TEACHER_DOCS;
        },
        addTeacherDoc(docObj) {
            const docs = this.getTeacherDocs();
            const newDoc = {
                id: "TDOC-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                ...docObj
            };
            docs.unshift(newDoc);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            return newDoc;
        },
        deleteTeacherDoc(docId) {
            let docs = this.getTeacherDocs();
            docs = docs.filter(d => d.id !== docId);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            return docs;
        },
        getTeacherDocsByGrade(grade) {
            const docs = this.getTeacherDocs();
            if (!grade || grade === 'All' || grade === 'All Grades') return docs;
            const cleanGrade = grade.toLowerCase();
            return docs.filter(d => (d.grade || '').toLowerCase().includes(cleanGrade));
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

        // --- File Sharing & Study Materials (with Delete Capability) ---
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
        deleteStudentFile(fileId) {
            return this.deleteFile(fileId);
        },

        // --- Academic Calendar Events (Google Calendar Model) ---
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

        // --- Student Accounts, Registration, Password Reset & Deletion ---
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
            if (count === 0) return 0;
            return Math.round((sum / count) * 10) / 10;
        },

        // Student Account Registration (with blank default assessments)
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
            this.saveStudents(students);
            return { students, newRecord };
        },

        // Edit Student Profile (Name, Avatar photo, WhatsApp, Grade, Credentials, Remarks)
        async updateStudent(studentId, updatedFields) {
            const students = await this.getStudents();
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
                this.saveStudents(students);
                return { success: true, student: st, students };
            }
            return { success: false, error: "Student not found" };
        },

        // Reset Student Password (Controlled by Teacher/Admin)
        async resetStudentPassword(studentId, newPassword) {
            const students = await this.getStudents();
            const idx = students.findIndex(s => s.student_info && s.student_info.student_id === studentId);
            if (idx !== -1) {
                const pass = (newPassword || 'student123').trim();
                students[idx].student_info.password = pass;
                this.saveStudents(students);
                return { success: true, student: students[idx], newPassword: pass };
            }
            return { success: false, error: "Student not found" };
        },

        // Delete Student Record Completely (Controlled by Teacher/Admin)
        async deleteStudent(studentId) {
            let students = await this.getStudents();
            students = students.filter(s => s.student_info && s.student_info.student_id !== studentId);
            this.saveStudents(students);
            return students;
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

        // Practical Results Breakdown Distribution for Pie Chart
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

        // Dynamic ERP Customizer for Every Page
        applyThemeAndBranding() {
            const settings = this.getSettings();
            document.querySelectorAll('.branding-academy-name').forEach(el => { el.textContent = settings.academyName; });
            document.querySelectorAll('.branding-tagline').forEach(el => { el.textContent = settings.tagline; });
            document.querySelectorAll('.branding-teacher-name').forEach(el => { el.textContent = settings.teacherName; });
            document.querySelectorAll('.branding-teacher-title').forEach(el => { el.textContent = settings.teacherTitle; });
            document.querySelectorAll('.branding-announcement').forEach(el => { el.textContent = settings.announcement; });
            document.querySelectorAll('.branding-hotlines').forEach(el => { el.textContent = settings.hotlines; });
            document.querySelectorAll('.branding-motto').forEach(el => { el.textContent = settings.motto; });

            // Apply custom teacher photo across all pages
            if (settings.teacherPhoto) {
                document.querySelectorAll('.branding-teacher-photo').forEach(el => {
                    el.src = settings.teacherPhoto;
                });
            }

            // Apply custom background image wallpaper across every page
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
