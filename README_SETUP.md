# 🔒 CyberSec Hub Forum - Полное руководство по установке

## 📋 Системные требования

- **Node.js** v16.0.0 или выше
- **PostgreSQL** v12.0 или выше
- **Redis** v6.0 или выше
- **npm** или **yarn**

## 🚀 Быстрая установка

### 1. Установка зависимостей

```bash
# Установка Node.js зависимостей
npm install

# Или с помощью yarn
yarn install
```

### 2. Настройка базы данных PostgreSQL

```bash
# Войдите в PostgreSQL как суперпользователь
sudo -u postgres psql

# Создайте пользователя для форума
CREATE USER cybersec_user WITH PASSWORD 'secure_password_here';

# Предоставьте права на создание баз данных
ALTER USER cybersec_user CREATEDB;

# Выйдите из PostgreSQL
\q
```

### 3. Настройка Redis

```bash
# Установка Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Запуск Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Проверка работы Redis
redis-cli ping
```

### 4. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Настройки сервера
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
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
SESSION_SECRET=your_super_secret_session_key_minimum_32_characters_long
ENCRYPTION_KEY=your_super_secret_encryption_key_minimum_32_chars

# Настройки безопасности
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=900000

# Email настройки (для восстановления пароля)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 5. Настройка базы данных

```bash
# Создание базы данных и таблиц
npm run setup-db
```

### 6. Запуск приложения

```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## 🛡️ Функции безопасности

### Защита от атак

1. **SQL Injection Protection**
   - Использование параметризованных запросов
   - Валидация и санитизация всех входных данных
   - Мониторинг подозрительных паттернов

2. **XSS Protection**
   - Автоматическая очистка пользовательского ввода
   - Content Security Policy (CSP)
   - Экранирование HTML символов

3. **CSRF Protection**
   - Токены для защиты от межсайтовых запросов
   - Проверка заголовков

4. **Brute Force Protection**
   - Ограничение попыток входа (5 попыток за 15 минут)
   - Временная блокировка аккаунтов
   - Мониторинг IP адресов

5. **DDoS Protection**
   - Rate limiting (100 запросов за 15 минут)
   - Адаптивные лимиты для разных ролей
   - Мониторинг подозрительной активности

6. **Directory Traversal Protection**
   - Проверка на опасные символы
   - Валидация путей файлов

7. **Command Injection Protection**
   - Фильтрация системных команд
   - Валидация пользовательского ввода

### Шифрование данных

- **Пароли**: bcrypt с 12 раундами
- **Сессии**: Зашифрованные токены
- **Конфиденциальные данные**: AES-256-GCM
- **JWT токены**: Подписанные секретным ключом

### Кэширование

- **Redis**: Кэширование сессий и временных данных
- **Node-Cache**: Кэширование данных приложения
- **Настраиваемые TTL**: Разные времена жизни для разных типов данных

## 📊 Мониторинг безопасности

### Логи безопасности

Все события безопасности записываются в таблицу `security_logs`:

```sql
-- Просмотр последних событий безопасности
SELECT * FROM security_logs 
ORDER BY created_at DESC 
LIMIT 100;

-- Анализ попыток SQL инъекций
SELECT COUNT(*), ip_address 
FROM security_logs 
WHERE event_type = 'sql_injection_attempt' 
GROUP BY ip_address 
ORDER BY count DESC;
```

### Мониторинг активности

```sql
-- Активные пользователи
SELECT COUNT(*) as active_users 
FROM users 
WHERE last_login > NOW() - INTERVAL '24 hours';

-- Заблокированные IP
SELECT * FROM blocked_ips 
WHERE blocked_until > NOW() OR blocked_until IS NULL;
```

## 🔧 Администрирование

### Создание администратора

```bash
# Подключитесь к базе данных
psql -U cybersec_user -d cybersec_forum

# Обновите роль пользователя
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

### Управление пользователями

```sql
-- Просмотр всех пользователей
SELECT id, username, email, role, created_at, last_login FROM users;

-- Блокировка пользователя
UPDATE users SET is_active = false WHERE username = 'username';

-- Разблокировка пользователя
UPDATE users SET is_active = true WHERE username = 'username';
```

### Управление форумом

```sql
-- Создание новой категории
INSERT INTO categories (name, description, color, icon) 
VALUES ('Новая категория', 'Описание', '#00ff41', 'fas fa-folder');

-- Закрепление темы
UPDATE topics SET is_pinned = true WHERE id = 1;

-- Пометка темы как горячей
UPDATE topics SET is_hot = true WHERE id = 1;
```

## 🚨 Безопасность в продакшене

### Обязательные изменения для продакшена

1. **Смените все секретные ключи**
2. **Настройте SSL/TLS сертификат**
3. **Настройте firewall**
4. **Ограничьте доступ к базе данных**
5. **Настройте резервное копирование**
6. **Обновите домен в CORS настройках**

### Дополнительные меры безопасности

```bash
# Настройка fail2ban для защиты от брутфорса
sudo apt install fail2ban

# Создание правила для вашего приложения
sudo nano /etc/fail2ban/jail.local
```

### Мониторинг системы

```bash
# Мониторинг использования ресурсов
htop

# Мониторинг логов
tail -f /var/log/nginx/access.log
tail -f /var/log/postgresql/postgresql.log

# Мониторинг Redis
redis-cli monitor
```

## 🔍 Тестирование безопасности

### Тестирование SQL инъекций

```bash
# Попытка SQL инъекции (должна быть заблокирована)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR 1=1--", "password": "test"}'
```

### Тестирование Rate Limiting

```bash
# Множественные запросы (должны быть ограничены)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "test", "password": "test"}'
done
```

### Тестирование XSS

```bash
# Попытка XSS (должна быть очищена)
curl -X POST http://localhost:3000/api/forum/topics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "<script>alert(\"XSS\")</script>", "content": "test", "category_id": 1}'
```

## 📈 Производительность

### Оптимизация базы данных

```sql
-- Создание индексов для быстрого поиска
CREATE INDEX CONCURRENTLY idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_topics_category_created ON topics(category_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_security_logs_ip_type ON security_logs(ip_address, event_type);
```

### Настройка кэширования

```javascript
// Увеличение времени кэширования для статических данных
cache.set('forum_categories', categories, 3600); // 1 час

// Кэширование популярных тем
cache.set('hot_topics', hotTopics, 1800); // 30 минут
```

## 🆘 Поддержка

### Частые проблемы

1. **Ошибка подключения к базе данных**
   - Проверьте настройки в `.env`
   - Убедитесь, что PostgreSQL запущен
   - Проверьте права доступа пользователя

2. **Ошибка подключения к Redis**
   - Проверьте, что Redis запущен
   - Проверьте настройки подключения

3. **Ошибки валидации**
   - Проверьте формат входных данных
   - Убедитесь в правильности полей формы

### Логи и отладка

```bash
# Просмотр логов приложения
tail -f logs/app.log

# Просмотр логов PostgreSQL
tail -f /var/log/postgresql/postgresql-12-main.log

# Просмотр логов Redis
tail -f /var/log/redis/redis-server.log
```

## 🎯 Что дальше?

1. Настройте мониторинг (Prometheus, Grafana)
2. Добавьте двухфакторную аутентификацию
3. Настройте автоматическое резервное копирование
4. Добавьте интеграцию с внешними сервисами
5. Расширьте функциональность форума

---

**Важно!** Это руководство предназначено для разработчиков, знакомых с основами веб-разработки и администрирования серверов. Для продакшена обязательно проведите дополнительный аудит безопасности.

🔒 **Безопасность - это процесс, а не цель. Регулярно обновляйте зависимости и следите за новыми угрозами!** 