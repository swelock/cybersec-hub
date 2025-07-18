const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const xss = require('xss');
const { Pool } = require('pg');
const config = require('../config/config');

// Подключение к базе данных
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.name,
    password: config.database.password,
    port: config.database.port,
});

// Функция для логирования событий безопасности
const logSecurityEvent = async (eventType, req, details = {}, severity = 'info') => {
    try {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const userId = req.user ? req.user.id : null;
        
        await pool.query(
            'INSERT INTO security_logs (event_type, ip_address, user_id, details, severity) VALUES ($1, $2, $3, $4, $5)',
            [eventType, ip, userId, JSON.stringify(details), severity]
        );
    } catch (error) {
        console.error('Ошибка логирования события безопасности:', error);
    }
};

// Проверка заблокированных IP
const checkBlockedIP = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        
        const result = await pool.query(
            'SELECT * FROM blocked_ips WHERE ip_address = $1 AND (blocked_until IS NULL OR blocked_until > NOW())',
            [ip]
        );

        if (result.rows.length > 0) {
            await logSecurityEvent('blocked_ip_access', req, { reason: result.rows[0].reason }, 'warning');
            return res.status(403).json({ error: 'Доступ запрещён' });
        }

        next();
    } catch (error) {
        console.error('Ошибка проверки заблокированного IP:', error);
        next();
    }
};

// Защита от SQL инъекций
const sqlInjectionProtection = (req, res, next) => {
    const suspiciousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
        /(\b(OR|AND)\s+\w+\s*=\s*\w+)/gi,
        /(--|\/\*|\*\/|;)/g,
        /(\b(CAST|CONVERT|SUBSTRING|ASCII|CHAR)\s*\()/gi,
        /(\b(WAITFOR|DELAY|SLEEP)\s*\()/gi,
        /(\b(XP_|SP_)\w+)/gi,
        /(\b(LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE)\b)/gi
    ];

    const checkForSQLInjection = (value) => {
        if (typeof value === 'string') {
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(value)) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkObject = (obj, path = '') => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                
                if (typeof value === 'string' && checkForSQLInjection(value)) {
                    return { detected: true, path: currentPath, value };
                } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    const result = checkObject(value, currentPath);
                    if (result.detected) return result;
                } else if (Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++) {
                        if (typeof value[i] === 'string' && checkForSQLInjection(value[i])) {
                            return { detected: true, path: `${currentPath}[${i}]`, value: value[i] };
                        }
                    }
                }
            }
        }
        return { detected: false };
    };

    const queryResult = checkObject(req.query);
    const bodyResult = checkObject(req.body);
    const paramsResult = checkObject(req.params);

    if (queryResult.detected || bodyResult.detected || paramsResult.detected) {
        const result = queryResult.detected ? queryResult : (bodyResult.detected ? bodyResult : paramsResult);
        
        logSecurityEvent('sql_injection_attempt', req, {
            path: result.path,
            value: result.value,
            userAgent: req.get('User-Agent')
        }, 'critical');

        return res.status(400).json({ error: 'Недопустимые данные в запросе' });
    }

    next();
};

// Защита от XSS атак
const xssProtection = (req, res, next) => {
    const cleanObject = (obj) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    const originalValue = obj[key];
                    obj[key] = xss(obj[key], {
                        whiteList: {
                            b: [],
                            i: [],
                            u: [],
                            strong: [],
                            em: [],
                            p: [],
                            br: [],
                            code: [],
                            pre: []
                        }
                    });
                    
                    // Логируем если были обнаружены XSS попытки
                    if (originalValue !== obj[key]) {
                        logSecurityEvent('xss_attempt', req, {
                            field: key,
                            original: originalValue,
                            cleaned: obj[key]
                        }, 'warning');
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    cleanObject(obj[key]);
                }
            }
        }
    };

    if (req.body) cleanObject(req.body);
    if (req.query) cleanObject(req.query);
    if (req.params) cleanObject(req.params);

    next();
};

// Защита от Directory Traversal атак
const directoryTraversalProtection = (req, res, next) => {
    const suspiciousPatterns = [
        /\.\./g,
        /\0/g,
        /\/\//g,
        /\\+/g,
        /%2e%2e/gi,
        /%2f/gi,
        /%5c/gi,
        /\x00/g
    ];

    const checkForTraversal = (value) => {
        if (typeof value === 'string') {
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(value)) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkAllParams = (obj) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (checkForTraversal(obj[key])) {
                    return { detected: true, field: key, value: obj[key] };
                }
            }
        }
        return { detected: false };
    };

    const queryResult = checkAllParams(req.query);
    const bodyResult = checkAllParams(req.body);
    const paramsResult = checkAllParams(req.params);

    if (queryResult.detected || bodyResult.detected || paramsResult.detected) {
        const result = queryResult.detected ? queryResult : (bodyResult.detected ? bodyResult : paramsResult);
        
        logSecurityEvent('directory_traversal_attempt', req, {
            field: result.field,
            value: result.value
        }, 'critical');

        return res.status(400).json({ error: 'Недопустимые символы в запросе' });
    }

    next();
};

// Защита от Command Injection
const commandInjectionProtection = (req, res, next) => {
    const suspiciousPatterns = [
        /[;&|`$]/g,
        /(\b(cat|ls|pwd|whoami|id|ps|netstat|ifconfig|ping|wget|curl|chmod|chown|rm|mv|cp|mkdir|rmdir|kill|killall|sudo|su|passwd|crontab|cron|at|batch|nohup|screen|tmux|vim|vi|nano|emacs|less|more|head|tail|grep|awk|sed|sort|uniq|wc|find|locate|which|whereis|uname|date|uptime|free|df|du|mount|umount|lsof|strace|ltrace|gdb)\b)/gi,
        /(\b(cmd|powershell|wscript|cscript|rundll32|regsvr32|mshta|bitsadmin|certutil|schtasks|tasklist|taskkill|net|netsh|systeminfo|whoami|query|reg|wmic|forfiles|findstr|type|dir|copy|move|del|erase|md|mkdir|rd|rmdir|cd|chdir|vol|label|format|diskpart|bcdedit|bootcfg|msconfig|regedit|regedt32)\b)/gi,
        /(\b(bash|sh|zsh|fish|ksh|tcsh|csh|dash|ash|busybox|perl|python|ruby|node|php|java|gcc|g\+\+|make|cmake|configure|autoconf|automake|libtool|pkg-config|git|svn|hg|bzr|cvs|rsync|scp|ssh|ftp|sftp|telnet|nc|ncat|socat|openssl|gpg|tar|gzip|gunzip|zip|unzip|7z|rar|unrar)\b)/gi
    ];

    const checkForCommand = (value) => {
        if (typeof value === 'string') {
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(value)) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkObject = (obj, path = '') => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                
                if (typeof value === 'string' && checkForCommand(value)) {
                    return { detected: true, path: currentPath, value };
                } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    const result = checkObject(value, currentPath);
                    if (result.detected) return result;
                }
            }
        }
        return { detected: false };
    };

    const queryResult = checkObject(req.query);
    const bodyResult = checkObject(req.body);
    const paramsResult = checkObject(req.params);

    if (queryResult.detected || bodyResult.detected || paramsResult.detected) {
        const result = queryResult.detected ? queryResult : (bodyResult.detected ? bodyResult : paramsResult);
        
        logSecurityEvent('command_injection_attempt', req, {
            path: result.path,
            value: result.value
        }, 'critical');

        return res.status(400).json({ error: 'Обнаружена попытка внедрения команд' });
    }

    next();
};

// Продвинутый rate limiting с адаптивными лимитами
const adaptiveRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: (req) => {
        // Более строгие лимиты для незарегистрированных пользователей
        if (!req.user) {
            return 50;
        }
        
        // Более мягкие лимиты для зарегистрированных пользователей
        switch (req.user.role) {
            case 'admin':
                return 1000;
            case 'moderator':
                return 500;
            case 'user':
                return 200;
            default:
                return 100;
        }
    },
    message: (req) => ({
        error: 'Превышен лимит запросов',
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
    }),
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        await logSecurityEvent('rate_limit_exceeded', req, {
            userAgent: req.get('User-Agent'),
            endpoint: req.originalUrl
        }, 'warning');
        
        res.status(429).json({
            error: 'Превышен лимит запросов',
            resetTime: new Date(Date.now() + 15 * 60 * 1000)
        });
    }
});

// Защита от массовых атак на API
const apiProtection = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 минута
    max: 30, // максимум 30 запросов к API за минуту
    message: {
        error: 'Слишком много запросов к API. Попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip + ':' + req.originalUrl;
    }
});

// Мониторинг подозрительной активности
const suspiciousActivityMonitor = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        
        // Проверка на подозрительные User-Agent
        const suspiciousUserAgents = [
            /sqlmap/i,
            /nikto/i,
            /nmap/i,
            /masscan/i,
            /burp/i,
            /curl/i,
            /wget/i,
            /python-requests/i,
            /scanner/i,
            /bot/i,
            /crawler/i,
            /spider/i
        ];

        const isSuspiciousUA = suspiciousUserAgents.some(pattern => pattern.test(userAgent));
        
        if (isSuspiciousUA) {
            await logSecurityEvent('suspicious_user_agent', req, {
                userAgent: userAgent
            }, 'warning');
        }

        // Проверка на необычные заголовки
        const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-original-forwarded-for'];
        const headerWarnings = [];
        
        suspiciousHeaders.forEach(header => {
            if (req.get(header)) {
                headerWarnings.push({
                    header: header,
                    value: req.get(header)
                });
            }
        });

        if (headerWarnings.length > 0) {
            await logSecurityEvent('suspicious_headers', req, {
                headers: headerWarnings
            }, 'info');
        }

        next();
    } catch (error) {
        console.error('Ошибка мониторинга подозрительной активности:', error);
        next();
    }
};

module.exports = {
    checkBlockedIP,
    sqlInjectionProtection,
    xssProtection,
    directoryTraversalProtection,
    commandInjectionProtection,
    adaptiveRateLimit,
    apiProtection,
    suspiciousActivityMonitor,
    logSecurityEvent
}; 