/**
 * ============================================================================
 * Sathsarani Science Academy LMS - Universal JSON Database & Multi-User Server
 * ============================================================================
 * Features:
 *  1. Pure JSON Database Engine (students.json, erp-config.json, users.json, teacher-docs.json, activity-logs.json)
 *  2. Multi-User Admin & Staff Privilege Management with RBAC
 *  3. Multi-Device Detection & Universal Access (PC / Desktop, Tablet / iPad, Mobile Phone)
 *  4. Real-time REST API with Live Sync, Activity Logging & LAN Network Access
 * ============================================================================
 * Usage: node server.js
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'assets', 'data');

// Database File Paths
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const CONFIG_FILE = path.join(DATA_DIR, 'erp-config.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DOCS_FILE = path.join(DATA_DIR, 'teacher-docs.json');
const LOGS_FILE = path.join(DATA_DIR, 'activity-logs.json');

// MIME Types for Static File Serving
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Ensure data directory and JSON files exist
function ensureDatabaseFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
        const defaultUsers = [
            {
                id: 'USR-101',
                username: 'sheshadi',
                password: 'password123',
                name: 'Mrs. Sheshadi Amarasinghe',
                email: 'sheshadi@scienceacademy.lk',
                phone: '071 781 2092',
                role: 'super_admin',
                roleName: 'Super Admin (Head Specialist)',
                title: 'B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Specialist',
                avatar: 'assets/images/teacher_banner.png',
                permissions: ['manage_users', 'edit_system_settings', 'manage_students', 'delete_students', 'grade_students', 'manage_content', 'view_teacher_vault', 'database_admin'],
                status: 'active',
                createdDate: '2026-01-10',
                lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lastDevice: 'PC / Desktop (Windows)',
                deviceSessions: []
            },
            {
                id: 'USR-102',
                username: 'wathisha',
                password: 'admin2026',
                name: 'Wathisha Amarasinghe',
                email: 'wathisha@scienceacademy.lk',
                phone: '077 161 4260',
                role: 'super_admin',
                roleName: 'Super Admin (Tech Lead)',
                title: 'Lead Cloud & Systems Architect',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wathisha&clothing=blazerAndShirt',
                permissions: ['manage_users', 'edit_system_settings', 'manage_students', 'delete_students', 'grade_students', 'manage_content', 'view_teacher_vault', 'database_admin'],
                status: 'active',
                createdDate: '2026-01-10',
                lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lastDevice: 'PC / Desktop (Mac)',
                deviceSessions: []
            },
            {
                id: 'USR-100',
                username: 'admin',
                password: 'password123',
                name: 'Master Administrator',
                email: 'admin@scienceacademy.lk',
                phone: '071 781 2092',
                role: 'super_admin',
                roleName: 'Super Admin (System Fallback)',
                title: 'Central System Administrator',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MasterAdmin',
                permissions: ['manage_users', 'edit_system_settings', 'manage_students', 'delete_students', 'grade_students', 'manage_content', 'view_teacher_vault', 'database_admin'],
                status: 'active',
                createdDate: '2026-01-01',
                lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lastDevice: 'PC / Desktop',
                deviceSessions: []
            }
        ];
        fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
    }

    if (!fs.existsSync(DOCS_FILE)) {
        fs.writeFileSync(DOCS_FILE, JSON.stringify([], null, 2), 'utf8');
    }

    if (!fs.existsSync(LOGS_FILE)) {
        fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
}

ensureDatabaseFiles();

// Helper to safely read JSON from file
function readJsonFile(filePath, defaultVal = []) {
    try {
        if (!fs.existsSync(filePath)) return defaultVal;
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
        return defaultVal;
    }
}

// Helper to safely write JSON to file
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e.message);
        return false;
    }
}

// Helper to parse device details from User-Agent and Client Info
function detectDevice(userAgent = '', clientDevice = '') {
    if (clientDevice && clientDevice.trim() !== '') {
        return clientDevice;
    }
    const ua = userAgent.toLowerCase();
    let deviceType = 'PC / Desktop';
    let osName = 'Unknown OS';

    if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
        deviceType = 'Tablet / iPad';
    } else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
        deviceType = 'Mobile Phone';
    }

    if (ua.includes('windows')) osName = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) osName = 'macOS';
    else if (ua.includes('iphone')) osName = 'iOS (iPhone)';
    else if (ua.includes('ipad')) osName = 'iPadOS';
    else if (ua.includes('android')) osName = 'Android';
    else if (ua.includes('linux')) osName = 'Linux';

    return `${deviceType} (${osName})`;
}

// Helper to get client IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
}

// Helper to log user action
function logActivity(entry) {
    const logs = readJsonFile(LOGS_FILE, []);
    const newLog = {
        id: 'LOG-' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ...entry
    };
    logs.unshift(newLog);
    if (logs.length > 500) logs.length = 500; // retain last 500 logs
    writeJsonFile(LOGS_FILE, logs);
    return newLog;
}

// JSON API Response Helper
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Device-Type'
    });
    res.end(JSON.stringify(data));
}

// Get Network Interfaces for LAN display
function getNetworkIps() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    return ips;
}

// Parse request body helper
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('Invalid JSON payload'));
            }
        });
        req.on('error', reject);
    });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
    // CORS Preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Device-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    // =========================================================================
    // 1. SYSTEM STATUS & HEALTH CHECK API
    // =========================================================================
    if (pathname === '/api/status' && method === 'GET') {
        const students = readJsonFile(STUDENTS_FILE, []);
        const users = readJsonFile(USERS_FILE, []);
        const docs = readJsonFile(DOCS_FILE, []);
        const logs = readJsonFile(LOGS_FILE, []);
        const config = readJsonFile(CONFIG_FILE, {});

        return sendJson(res, 200, {
            status: 'online',
            service: 'Sathsarani Science Academy Pure JSON LMS Database Engine',
            version: '3.5.0-MultiUser-MultiDevice',
            serverTime: new Date().toISOString(),
            uptimeSeconds: Math.round(process.uptime()),
            detectedClientDevice: detectDevice(userAgent, req.headers['x-device-type']),
            networkIPs: getNetworkIps(),
            databaseStats: {
                studentsCount: students.length,
                usersCount: users.length,
                teacherDocsCount: docs.length,
                logsCount: logs.length,
                configLoaded: !!config.settings
            }
        });
    }

    // =========================================================================
    // 2. AUTHENTICATION & MULTI-USER LOGIN API
    // =========================================================================
    if (pathname === '/api/auth/login' && method === 'POST') {
        try {
            const body = await parseBody(req);
            const { username, password, clientDevice, clientOS, clientBrowser } = body;
            const cleanUser = (username || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            if (!cleanUser || !cleanPass) {
                return sendJson(res, 400, { error: 'Username and password are required.' });
            }

            const users = readJsonFile(USERS_FILE, []);
            const user = users.find(u => (u.username || '').toLowerCase() === cleanUser);

            if (!user || user.password !== cleanPass) {
                logActivity({
                    username: cleanUser,
                    userFullName: 'Unknown / Failed Attempt',
                    role: 'None',
                    action: 'AUTH_FAILED',
                    deviceType: detectDevice(userAgent, clientDevice),
                    ip: clientIp,
                    details: `Failed login attempt for username '${cleanUser}'`
                });
                return sendJson(res, 401, { error: 'Invalid username or password.' });
            }

            if (user.status === 'disabled' || user.status === 'inactive') {
                return sendJson(res, 403, { error: 'This user account is deactivated. Contact the Super Administrator.' });
            }

            // Detect device details
            const detectedDev = detectDevice(userAgent, clientDevice);
            const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

            user.lastLogin = now;
            user.lastDevice = detectedDev;
            if (!user.deviceSessions) user.deviceSessions = [];
            user.deviceSessions.unshift({
                deviceType: detectedDev.split(' (')[0] || 'PC / Desktop',
                os: clientOS || detectedDev,
                browser: clientBrowser || userAgent.substring(0, 40),
                ip: clientIp,
                loginTime: now
            });
            if (user.deviceSessions.length > 20) user.deviceSessions.length = 20;

            writeJsonFile(USERS_FILE, users);

            logActivity({
                username: user.username,
                userFullName: user.name,
                role: user.roleName || user.role,
                action: 'USER_LOGIN',
                deviceType: detectedDev,
                ip: clientIp,
                details: `Successful login to LMS Admin Portal from ${detectedDev}`
            });

            // Return user object without sensitive plaintext password for security
            const safeUser = { ...user };
            delete safeUser.password;

            return sendJson(res, 200, {
                status: 'success',
                message: `Welcome back, ${user.name}!`,
                user: safeUser,
                token: 'lms_token_' + Buffer.from(`${user.username}:${Date.now()}`).toString('base64'),
                deviceInfo: {
                    deviceType: detectedDev,
                    ip: clientIp,
                    loginTime: now
                }
            });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 3. MULTI-USER ROSTER & PRIVILEGE MANAGEMENT API (/api/users)
    // =========================================================================
    if (pathname === '/api/users' && method === 'GET') {
        const users = readJsonFile(USERS_FILE, []);
        return sendJson(res, 200, users);
    }

    if (pathname === '/api/users' && method === 'POST') {
        try {
            const body = await parseBody(req);
            const users = readJsonFile(USERS_FILE, []);

            if (!body.username || !body.name || !body.password) {
                return sendJson(res, 400, { error: 'Username, password, and full name are required.' });
            }

            const cleanUser = body.username.trim().toLowerCase();
            if (users.some(u => (u.username || '').toLowerCase() === cleanUser)) {
                return sendJson(res, 409, { error: `Username '${cleanUser}' already exists.` });
            }

            const newUser = {
                id: 'USR-' + (Date.now().toString().slice(-4) + Math.floor(Math.random() * 100)),
                username: cleanUser,
                password: body.password.trim(),
                name: body.name.trim(),
                email: body.email || `${cleanUser}@scienceacademy.lk`,
                phone: body.phone || '071 781 2092',
                role: body.role || 'teacher',
                roleName: body.roleName || (body.role === 'super_admin' ? 'Super Admin' : body.role === 'admin' ? 'Administrator' : body.role === 'teacher' ? 'Science Teacher' : body.role === 'assistant_teacher' ? 'Assistant Teacher' : 'Staff Officer'),
                title: body.title || 'Science Educator',
                avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
                permissions: Array.isArray(body.permissions) ? body.permissions : ['grade_students', 'manage_content'],
                status: body.status || 'active',
                createdDate: new Date().toISOString().split('T')[0],
                lastLogin: 'Never logged in',
                lastDevice: 'None',
                deviceSessions: []
            };

            users.push(newUser);
            writeJsonFile(USERS_FILE, users);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_CREATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Created new admin user '${newUser.username}' (${newUser.name}) with role '${newUser.role}'`
            });

            return sendJson(res, 201, { status: 'success', user: newUser, users });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    if (pathname.startsWith('/api/users/') && method === 'PUT') {
        try {
            const targetIdOrUser = pathname.replace('/api/users/', '').trim();
            const body = await parseBody(req);
            let users = readJsonFile(USERS_FILE, []);

            const idx = users.findIndex(u => u.id === targetIdOrUser || (u.username || '').toLowerCase() === targetIdOrUser.toLowerCase());
            if (idx === -1) {
                return sendJson(res, 404, { error: `User '${targetIdOrUser}' not found.` });
            }

            const existing = users[idx];
            if (body.name) existing.name = body.name.trim();
            if (body.password) existing.password = body.password.trim();
            if (body.email) existing.email = body.email.trim();
            if (body.phone) existing.phone = body.phone.trim();
            if (body.role) existing.role = body.role;
            if (body.roleName) existing.roleName = body.roleName;
            if (body.title) existing.title = body.title.trim();
            if (body.avatar) existing.avatar = body.avatar;
            if (body.permissions) existing.permissions = body.permissions;
            if (body.status) existing.status = body.status;

            users[idx] = existing;
            writeJsonFile(USERS_FILE, users);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_UPDATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Updated user profile/privileges for '${existing.username}'`
            });

            return sendJson(res, 200, { status: 'success', user: existing, users });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        try {
            const targetIdOrUser = pathname.replace('/api/users/', '').trim();
            let users = readJsonFile(USERS_FILE, []);

            const userToDelete = users.find(u => u.id === targetIdOrUser || (u.username || '').toLowerCase() === targetIdOrUser.toLowerCase());
            if (!userToDelete) {
                return sendJson(res, 404, { error: `User '${targetIdOrUser}' not found.` });
            }

            // Prevent deleting the primary super admin
            if (userToDelete.username === 'sheshadi' || userToDelete.username === 'wathisha') {
                return sendJson(res, 403, { error: 'Cannot delete primary owner/super-administrator account.' });
            }

            users = users.filter(u => u.id !== userToDelete.id && u.username !== userToDelete.username);
            writeJsonFile(USERS_FILE, users);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_DELETE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Deleted user '${userToDelete.username}' (${userToDelete.name})`
            });

            return sendJson(res, 200, { status: 'success', message: 'User deleted', users });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 4. STUDENT DATABASE API (/api/students)
    // =========================================================================
    if (pathname === '/api/students' && method === 'GET') {
        const students = readJsonFile(STUDENTS_FILE, []);
        return sendJson(res, 200, students);
    }

    if (pathname === '/api/students' && method === 'POST') {
        try {
            const body = await parseBody(req);
            if (!Array.isArray(body)) {
                return sendJson(res, 400, { error: 'Payload must be an array of student records.' });
            }

            writeJsonFile(STUDENTS_FILE, body);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Teacher / Admin',
                role: 'Educator',
                action: 'STUDENTS_SYNC',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Synchronized student database with ${body.length} records.`
            });

            return sendJson(res, 200, { status: 'success', message: 'Students database updated!', count: body.length });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    if (pathname.startsWith('/api/students/') && method === 'GET') {
        const id = pathname.replace('/api/students/', '').trim();
        const students = readJsonFile(STUDENTS_FILE, []);
        const student = students.find(s => s.student_info && s.student_info.student_id.toLowerCase() === id.toLowerCase());
        if (student) {
            return sendJson(res, 200, student);
        }
        return sendJson(res, 404, { error: `Student with ID '${id}' not found.` });
    }

    // =========================================================================
    // 5. MASTER ERP CONFIG API (/api/config)
    // =========================================================================
    if (pathname === '/api/config' && method === 'GET') {
        const config = readJsonFile(CONFIG_FILE, {});
        return sendJson(res, 200, config);
    }

    if (pathname === '/api/config' && method === 'POST') {
        try {
            const body = await parseBody(req);
            writeJsonFile(CONFIG_FILE, body);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Teacher / Admin',
                role: 'Super Admin',
                action: 'CONFIG_UPDATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Updated global LMS ERP configuration.'
            });

            return sendJson(res, 200, { status: 'success', message: 'ERP Configuration updated successfully!' });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 6. TEACHER VAULT DOCUMENTS API (/api/documents)
    // =========================================================================
    if (pathname === '/api/documents' && method === 'GET') {
        const docs = readJsonFile(DOCS_FILE, []);
        return sendJson(res, 200, docs);
    }

    if (pathname === '/api/documents' && method === 'POST') {
        try {
            const body = await parseBody(req);
            let docs = readJsonFile(DOCS_FILE, []);
            if (Array.isArray(body)) {
                docs = body;
            } else {
                const newDoc = {
                    id: 'TDOC-' + Date.now(),
                    uploadDate: new Date().toISOString().split('T')[0],
                    ...body
                };
                docs.unshift(newDoc);
            }
            writeJsonFile(DOCS_FILE, docs);

            logActivity({
                username: req.headers['x-admin-user'] || 'teacher',
                userFullName: 'Educator',
                role: 'Teacher',
                action: 'DOCUMENT_UPLOAD',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Uploaded / updated teacher confidential vault document.'
            });

            return sendJson(res, 200, { status: 'success', documents: docs });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 7. MULTI-DEVICE ACTIVITY LOGS API (/api/logs)
    // =========================================================================
    if (pathname === '/api/logs' && method === 'GET') {
        const logs = readJsonFile(LOGS_FILE, []);
        return sendJson(res, 200, logs);
    }

    if (pathname === '/api/logs' && method === 'POST') {
        try {
            const body = await parseBody(req);
            const newLog = logActivity(body);
            return sendJson(res, 201, { status: 'success', log: newLog });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 8. DATABASE EXPORT & RESTORE BUNDLE API (/api/db/export & /api/db/import)
    // =========================================================================
    if (pathname === '/api/db/export' && method === 'GET') {
        const fullDb = {
            exportTimestamp: new Date().toISOString(),
            academy: 'Sathsarani Science Academy LMS',
            students: readJsonFile(STUDENTS_FILE, []),
            config: readJsonFile(CONFIG_FILE, {}),
            users: readJsonFile(USERS_FILE, []),
            teacherDocs: readJsonFile(DOCS_FILE, []),
            activityLogs: readJsonFile(LOGS_FILE, [])
        };
        return sendJson(res, 200, fullDb);
    }

    if (pathname === '/api/db/import' && method === 'POST') {
        try {
            const body = await parseBody(req);
            if (body.students) writeJsonFile(STUDENTS_FILE, body.students);
            if (body.config) writeJsonFile(CONFIG_FILE, body.config);
            if (body.users) writeJsonFile(USERS_FILE, body.users);
            if (body.teacherDocs) writeJsonFile(DOCS_FILE, body.teacherDocs);
            if (body.activityLogs) writeJsonFile(LOGS_FILE, body.activityLogs);

            logActivity({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'DATABASE_RESTORE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Full JSON database restored from JSON archive.'
            });

            return sendJson(res, 200, { status: 'success', message: 'Full database bundle restored successfully!' });
        } catch (err) {
            return sendJson(res, 500, { error: err.message });
        }
    }

    // =========================================================================
    // 9. STATIC FILE SERVING WITH RESPONSIVE HEADERS & 404 FALLBACK
    // =========================================================================
    let requestedFile = pathname === '/' ? 'index.html' : pathname;
    // Remove query params or leading slashes
    requestedFile = requestedFile.replace(/^\/+/, '');
    let filePath = path.join(__dirname, requestedFile);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Denied');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content404 || '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>Requested file does not exist on Science LMS Server.</p><a href="/">Back to Home</a></body></html>');
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    const networkIps = getNetworkIps();
    console.log('============================================================================');
    console.log(' Science with Sheshadi LMS - Pure JSON Database & Multi-User Server');
    console.log('============================================================================');
    console.log(` Status: Server running on port ${PORT}`);
    console.log(` Localhost Access:     http://localhost:${PORT}`);
    networkIps.forEach(ip => {
        console.log(` Multi-Device LAN Access: http://${ip}:${PORT} (Access from PC, Tablet, Phones)`);
    });
    console.log(' JSON Database Endpoints:');
    console.log(`  - Students DB:       http://localhost:${PORT}/api/students`);
    console.log(`  - System Config DB:  http://localhost:${PORT}/api/config`);
    console.log(`  - Admin Users DB:    http://localhost:${PORT}/api/users`);
    console.log(`  - Vault Docs DB:     http://localhost:${PORT}/api/documents`);
    console.log(`  - Activity Logs DB:  http://localhost:${PORT}/api/logs`);
    console.log(`  - DB Export / Backup:http://localhost:${PORT}/api/db/export`);
    console.log('============================================================================');
});
