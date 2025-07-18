const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const ExpressBrute = require('express-brute');
const RedisStore_brute = require('express-brute-redis');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Кэш для данных приложения
const cache = new NodeCache({ stdTTL: 600 }); // 10 минут

// Подключение к Redis
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

// Подключение к PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cybersec_forum',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // максимум соединений
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Настройка Express Brute для защиты от brute force
const store = new RedisStore_brute({
    client: redisClient,
});

const bruteforce = new ExpressBrute(store, {
    freeRetries: 3,
    minWait: 5 * 60 * 1000, // 5 минут
    maxWait: 60 * 60 * 1000, // 1 час
    lifetime: 24 * 60 * 60, // 24 часа
    failCallback: function (req, res, next, nextValidRequestDate) {
        res.status(429).json({
            error: 'Слишком много попыток входа. Попробуйте позже.',
            nextValidRequestDate: nextValidRequestDate
        });
    }
});

// Middleware для безопасности
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS настройки
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Защита от DDoS и rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с IP за 15 минут
    message: {
        error: 'Слишком много запросов с этого IP. Попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Пропускаем статические файлы
        return req.path.startsWith('/css/') || 
               req.path.startsWith('/js/') || 
               req.path.startsWith('/images/');
    }
});

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 минут
    delayAfter: 50, // замедляем после 50 запросов
    delayMs: 500 // добавляем 500ms задержки за каждый запрос
});

// Специальный лимит для API авторизации
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 попыток входа за 15 минут
    message: {
        error: 'Слишком много попыток входа. Попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(speedLimiter);

// Сжатие
app.use(compression());

// Парсинг
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Защита от NoSQL инъекций
app.use(mongoSanitize());

// Защита от HTTP Parameter Pollution
app.use(hpp());

// Логирование
app.use(morgan('combined'));

// Сессии с Redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен доступа не найден' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
};

// Функция для хеширования паролей
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Функция для проверки пароля
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Функция для генерации JWT токена
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role 
        },
        process.env.JWT_SECRET || 'jwt-secret-key',
        { expiresIn: '24h' }
    );
};

// Функция для шифрования данных
const encryptData = (data) => {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'encryption-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
};

// Функция для расшифровки данных
const decryptData = (encryptedData) => {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'encryption-key', 'salt', 32);
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};

// Валидация регистрации
const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Имя пользователя должно быть от 3 до 20 символов')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Имя пользователя может содержать только буквы, цифры и подчёркивание'),
    body('email')
        .isEmail()
        .withMessage('Некорректный email адрес')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен быть не менее 8 символов')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Пароль должен содержать строчные и заглавные буквы, цифры и спецсимволы'),
];

// Валидация входа
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Имя пользователя обязательно')
        .trim()
        .escape(),
    body('password')
        .notEmpty()
        .withMessage('Пароль обязателен')
        .isLength({ min: 1 })
        .withMessage('Пароль не может быть пустым'),
];

// API маршруты

// Регистрация пользователя
app.post('/api/auth/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Проверка существования пользователя
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
        }

        // Хеширование пароля
        const hashedPassword = await hashPassword(password);

        // Создание пользователя
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'user']
        );

        const user = result.rows[0];
        const token = generateToken(user);

        // Сохранение в кэше
        cache.set(`user_${user.id}`, user, 3600); // 1 час

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Вход пользователя
app.post('/api/auth/login', authLimiter, bruteforce.prevent, validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Поиск пользователя
        const result = await pool.query(
            'SELECT id, username, email, password_hash, role, last_login FROM users WHERE username = $1 OR email = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверные учётные данные' });
        }

        const user = result.rows[0];

        // Проверка пароля
        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверные учётные данные' });
        }

        // Обновление времени последнего входа
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        const token = generateToken(user);

        // Сохранение в кэше
        cache.set(`user_${user.id}`, user, 3600); // 1 час

        res.json({
            message: 'Успешный вход',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Получение профиля пользователя
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Проверка кэша
        const cachedUser = cache.get(`user_${userId}`);
        if (cachedUser) {
            return res.json({ user: cachedUser });
        }

        // Получение из базы данных
        const result = await pool.query(
            'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const user = result.rows[0];

        // Сохранение в кэше
        cache.set(`user_${userId}`, user, 3600); // 1 час

        res.json({ user });

    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Получение тем форума
app.get('/api/forum/topics', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Проверка кэша
        const cacheKey = `forum_topics_${page}_${limit}`;
        const cachedTopics = cache.get(cacheKey);
        if (cachedTopics) {
            return res.json(cachedTopics);
        }

        const result = await pool.query(
            `SELECT t.id, t.title, t.content, t.created_at, t.updated_at, t.views, t.is_pinned, t.is_hot,
                    u.username, u.role, c.name as category_name,
                    COUNT(r.id) as reply_count
             FROM topics t
             JOIN users u ON t.user_id = u.id
             JOIN categories c ON t.category_id = c.id
             LEFT JOIN replies r ON t.id = r.topic_id
             GROUP BY t.id, u.username, u.role, c.name
             ORDER BY t.is_pinned DESC, t.created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const topics = result.rows;

        // Сохранение в кэше на 5 минут
        cache.set(cacheKey, { topics }, 300);

        res.json({ topics });

    } catch (error) {
        console.error('Ошибка получения тем:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Создание новой темы
app.post('/api/forum/topics', authenticateToken, [
    body('title')
        .isLength({ min: 5, max: 200 })
        .withMessage('Заголовок должен быть от 5 до 200 символов')
        .trim()
        .escape(),
    body('content')
        .isLength({ min: 10, max: 10000 })
        .withMessage('Содержимое должно быть от 10 до 10000 символов')
        .trim(),
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Некорректный ID категории')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, category_id } = req.body;
        const userId = req.user.id;

        // Создание темы
        const result = await pool.query(
            'INSERT INTO topics (title, content, user_id, category_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
            [title, content, userId, category_id]
        );

        const topicId = result.rows[0].id;

        // Очистка кэша
        cache.flushAll();

        res.status(201).json({
            message: 'Тема успешно создана',
            topic_id: topicId
        });

    } catch (error) {
        console.error('Ошибка создания темы:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Статические маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'pages', page));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🔒 Сервер запущен на порту ${PORT}`);
    console.log(`🛡️  Включена защита от SQL инъекций, brute force и DDoS атак`);
    console.log(`🔐 Шифрование и кэширование данных активно`);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
    console.log('\n🔴 Получен сигнал SIGINT, завершаю работу...');
    pool.end();
    redisClient.quit();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔴 Получен сигнал SIGTERM, завершаю работу...');
    pool.end();
    redisClient.quit();
    process.exit(0);
});

module.exports = app; 