const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: 'postgres', // Подключаемся к системной базе для создания нашей базы
    password: config.database.password,
    port: config.database.port,
});

const setupDatabase = async () => {
    try {
        console.log('🔧 Настройка базы данных...');

        // Создание базы данных
        await pool.query(`CREATE DATABASE ${config.database.name};`);
        console.log(`✅ База данных ${config.database.name} создана`);

        // Закрытие соединения с системной базой
        await pool.end();

        // Подключение к нашей базе данных
        const appPool = new Pool({
            user: config.database.user,
            host: config.database.host,
            database: config.database.name,
            password: config.database.password,
            port: config.database.port,
        });

        // Создание расширений
        await appPool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await appPool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
        console.log('✅ Расширения PostgreSQL установлены');

        // Создание таблиц
        const createTables = `
            -- Таблица пользователей
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                is_active BOOLEAN DEFAULT true,
                email_verified BOOLEAN DEFAULT false,
                two_factor_enabled BOOLEAN DEFAULT false,
                two_factor_secret VARCHAR(255),
                avatar_url VARCHAR(255),
                reputation INTEGER DEFAULT 0,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                failed_login_attempts INTEGER DEFAULT 0,
                locked_until TIMESTAMP,
                reset_token VARCHAR(255),
                reset_token_expires TIMESTAMP,
                verification_token VARCHAR(255),
                verification_token_expires TIMESTAMP
            );

            -- Таблица категорий форума
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                color VARCHAR(7) DEFAULT '#00ff41',
                icon VARCHAR(50),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица тем форума
            CREATE TABLE IF NOT EXISTS topics (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                content TEXT NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
                is_pinned BOOLEAN DEFAULT false,
                is_hot BOOLEAN DEFAULT false,
                is_locked BOOLEAN DEFAULT false,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица ответов
            CREATE TABLE IF NOT EXISTS replies (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
                parent_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
                is_solution BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица лайков
            CREATE TABLE IF NOT EXISTS likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
                reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
                is_like BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, topic_id, reply_id)
            );

            -- Таблица для отслеживания активности
            CREATE TABLE IF NOT EXISTS user_activity (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                activity_type VARCHAR(50) NOT NULL,
                ip_address INET,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица для хранения сессий
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                ip_address INET,
                user_agent TEXT,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица для логов безопасности
            CREATE TABLE IF NOT EXISTS security_logs (
                id SERIAL PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                ip_address INET,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                details JSONB,
                severity VARCHAR(20) DEFAULT 'info',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица для блокировки IP
            CREATE TABLE IF NOT EXISTS blocked_ips (
                id SERIAL PRIMARY KEY,
                ip_address INET UNIQUE NOT NULL,
                reason TEXT,
                blocked_until TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Создание индексов для производительности
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category_id);
            CREATE INDEX IF NOT EXISTS idx_topics_user ON topics(user_id);
            CREATE INDEX IF NOT EXISTS idx_topics_created ON topics(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_replies_topic ON replies(topic_id);
            CREATE INDEX IF NOT EXISTS idx_replies_user ON replies(user_id);
            CREATE INDEX IF NOT EXISTS idx_replies_created ON replies(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_security_logs_created ON security_logs(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);
            CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at DESC);

            -- Создание триггеров для обновления времени
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `;

        await appPool.query(createTables);
        console.log('✅ Таблицы базы данных созданы');

        // Вставка тестовых данных
        await insertTestData(appPool);

        await appPool.end();
        console.log('🎉 База данных успешно настроена!');

    } catch (error) {
        if (error.code === '42P04') {
            console.log('⚠️  База данных уже существует, пропускаем создание...');
        } else {
            console.error('❌ Ошибка настройки базы данных:', error);
        }
    }
};

const insertTestData = async (pool) => {
    try {
        // Вставка категорий форума
        const categories = [
            ['Уязвимости и эксплойты', 'Обсуждение новых уязвимостей, CVE, эксплойтов и методов защиты', '#ff0040', 'fas fa-bug'],
            ['Инструменты и утилиты', 'Обзоры инструментов, настройка окружения, кастомные скрипты', '#00ff41', 'fas fa-tools'],
            ['Сетевая безопасность', 'Firewall, IDS/IPS, анализ трафика, защита периметра', '#00d4ff', 'fas fa-network-wired'],
            ['Обучение и карьера', 'Курсы, сертификации, вакансии, советы новичкам', '#8b5cf6', 'fas fa-graduation-cap'],
            ['Криптография', 'Шифрование, цифровые подписи, blockchain, криптоанализ', '#ffd700', 'fas fa-lock'],
            ['Мобильная безопасность', 'Безопасность iOS/Android, мобильные угрозы, тестирование приложений', '#ff8800', 'fas fa-mobile-alt']
        ];

        for (const category of categories) {
            await pool.query(
                'INSERT INTO categories (name, description, color, icon) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                category
            );
        }

        // Создание администратора
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash('admin123!@#', 12);

        await pool.query(`
            INSERT INTO users (username, email, password_hash, role, email_verified, reputation) 
            VALUES ('AdminCyber', 'admin@cybersec-hub.com', $1, 'admin', true, 10000)
            ON CONFLICT (username) DO NOTHING
        `, [adminPassword]);

        // Создание тестовых пользователей
        const testUsers = [
            ['SecurityExpert', 'expert@cybersec-hub.com', 'expert123!@#', 'moderator', 5000],
            ['WebHacker2023', 'hacker@cybersec-hub.com', 'hacker123!@#', 'user', 2500],
            ['ThreatHunter', 'hunter@cybersec-hub.com', 'hunter123!@#', 'user', 1800],
            ['SOCAnalyst', 'analyst@cybersec-hub.com', 'analyst123!@#', 'user', 900],
            ['CTFMaster', 'ctf@cybersec-hub.com', 'ctf123!@#', 'user', 3200]
        ];

        for (const user of testUsers) {
            const hashedPassword = await bcrypt.hash(user[2], 12);
            await pool.query(`
                INSERT INTO users (username, email, password_hash, role, email_verified, reputation) 
                VALUES ($1, $2, $3, $4, true, $5)
                ON CONFLICT (username) DO NOTHING
            `, [user[0], user[1], hashedPassword, user[3], user[4]]);
        }

        // Вставка тестовых тем
        const topics = [
            [
                'Новые правила форума и рекомендации по безопасности',
                'Обновили правила форума в соответствии с последними трендами в кибербезопасности. Просим всех участников ознакомиться с новыми требованиями по безопасности и этике общения.',
                1, 1, true, false
            ],
            [
                'Обнаружена критическая уязвимость в Apache Log4j 2.17.1',
                'Исследователи обнаружили новую RCE уязвимость в последней версии Log4j. CVE-2023-44487 позволяет выполнить произвольный код на сервере через специально созданные логи.',
                2, 1, false, true
            ],
            [
                'Настройка Burp Suite для продвинутого тестирования',
                'Поделюсь своим опытом настройки Burp Suite для максимальной эффективности при пентестинге веб-приложений. Рассмотрим плагины, настройки прокси и автоматизацию.',
                3, 2, false, false
            ],
            [
                'Анализ APT-атаки на корпоративную инфраструктуру',
                'Разбираю реальный кейс APT-атаки, которую удалось обнаружить и остановить. Рассмотрим TTPs, IOCs, и методы защиты от подобных угроз.',
                4, 1, false, false
            ]
        ];

        for (const topic of topics) {
            await pool.query(`
                INSERT INTO topics (title, content, user_id, category_id, is_pinned, is_hot, views) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT DO NOTHING
            `, [...topic, Math.floor(Math.random() * 1000) + 100]);
        }

        console.log('✅ Тестовые данные добавлены');

    } catch (error) {
        console.error('❌ Ошибка при вставке тестовых данных:', error);
    }
};

// Запуск скрипта
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase }; 