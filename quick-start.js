#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CyberSec Hub Forum - Быстрый запуск');
console.log('=====================================\n');

// Проверка наличия .env файла
if (!fs.existsSync('.env')) {
    console.log('⚠️  Файл .env не найден!');
    console.log('📝 Создайте файл .env на основе примера в README_SETUP.md');
    console.log('');
    
    // Создаем базовый .env файл
    const envContent = `# Настройки сервера
PORT=3000
NODE_ENV=development

# База данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cybersec_forum
DB_USER=cybersec_user
DB_PASSWORD=secure_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Секретные ключи (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_please_change_this
SESSION_SECRET=your_super_secret_session_key_minimum_32_characters_long_please_change_this
ENCRYPTION_KEY=your_super_secret_encryption_key_minimum_32_chars_please_change_this

# Настройки безопасности
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=900000

# Email настройки (для восстановления пароля)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Создан базовый файл .env');
    console.log('🔑 ВАЖНО: Обязательно измените секретные ключи!');
    console.log('');
}

// Проверка наличия node_modules
if (!fs.existsSync('node_modules')) {
    console.log('📦 Установка зависимостей...');
    const install = spawn('npm', ['install'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Зависимости установлены успешно');
            startApplication();
        } else {
            console.error('❌ Ошибка установки зависимостей');
            process.exit(1);
        }
    });
} else {
    startApplication();
}

function startApplication() {
    console.log('🔧 Проверка системных требований...');
    
    // Проверка PostgreSQL
    checkPostgreSQL();
    
    // Проверка Redis
    checkRedis();
    
    // Запуск сервера
    setTimeout(() => {
        console.log('🚀 Запуск сервера...');
        const server = spawn('node', ['server.js'], { stdio: 'inherit' });
        
        server.on('close', (code) => {
            console.log(`\n🔴 Сервер завершил работу с кодом ${code}`);
        });
        
        // Обработка сигналов
        process.on('SIGINT', () => {
            console.log('\n🔴 Получен сигнал остановки...');
            server.kill('SIGINT');
        });
        
        process.on('SIGTERM', () => {
            console.log('\n🔴 Получен сигнал завершения...');
            server.kill('SIGTERM');
        });
    }, 2000);
}

function checkPostgreSQL() {
    const { spawn } = require('child_process');
    const psql = spawn('psql', ['--version'], { stdio: 'pipe' });
    
    psql.on('close', (code) => {
        if (code === 0) {
            console.log('✅ PostgreSQL обнаружен');
        } else {
            console.log('⚠️  PostgreSQL не найден или не настроен');
            console.log('📖 Смотрите инструкции в README_SETUP.md');
        }
    });
    
    psql.on('error', () => {
        console.log('⚠️  PostgreSQL не найден');
        console.log('📖 Установите PostgreSQL: https://www.postgresql.org/download/');
    });
}

function checkRedis() {
    const { spawn } = require('child_process');
    const redis = spawn('redis-cli', ['ping'], { stdio: 'pipe' });
    
    redis.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Redis работает');
        } else {
            console.log('⚠️  Redis не отвечает');
            console.log('🔧 Запустите Redis: redis-server');
        }
    });
    
    redis.on('error', () => {
        console.log('⚠️  Redis не найден');
        console.log('📖 Установите Redis: https://redis.io/download');
    });
}

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('❌ Критическая ошибка:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Необработанное отклонение промиса:', reason);
    process.exit(1);
}); 