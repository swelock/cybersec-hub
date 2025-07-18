require('dotenv').config();

const config = {
    // Настройки сервера
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    // База данных PostgreSQL
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'cybersec_forum',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        ssl: process.env.NODE_ENV === 'production'
    },

    // Redis
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined
    },

    // Секретные ключи
    secrets: {
        jwt: process.env.JWT_SECRET || 'jwt-secret-key-change-in-production',
        session: process.env.SESSION_SECRET || 'session-secret-key-change-in-production',
        encryption: process.env.ENCRYPTION_KEY || 'encryption-key-change-in-production'
    },

    // Настройки безопасности
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        lockoutTime: parseInt(process.env.LOCKOUT_TIME) || 900000, // 15 минут
        
        // Rate limiting
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 минут
            max: 100 // максимум запросов
        },
        
        // Auth rate limiting
        authRateLimit: {
            windowMs: 15 * 60 * 1000, // 15 минут
            max: 5 // максимум попыток входа
        },

        // CORS настройки
        cors: {
            origin: process.env.NODE_ENV === 'production' 
                ? ['https://yourdomain.com'] 
                : ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true
        }
    },

    // Настройки файлов
    files: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
        uploadDir: process.env.UPLOAD_DIR || 'uploads'
    },

    // Email настройки
    email: {
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASSWORD || ''
            }
        }
    },

    // Кэш настройки
    cache: {
        defaultTTL: 600, // 10 минут
        userTTL: 3600, // 1 час
        forumTTL: 300 // 5 минут
    }
};

module.exports = config; 