# CyberSec Hub - Современный сайт об информационной безопасности

![CyberSec Hub Logo](https://img.shields.io/badge/CyberSec-Hub-brightgreen?style=for-the-badge&logo=shield&logoColor=white)

Современный интерактивный сайт посвященный информационной безопасности, пентестингу и этичному хакингу. Создан с использованием HTML, CSS, JavaScript и Tailwind CSS.

## 🚀 Особенности

- **Современный дизайн**: Киберпанк стилистика с неоновыми эффектами
- **Интерактивный терминал**: Симуляция командной строки Linux
- **Адаптивность**: Полная поддержка мобильных устройств
- **Анимации**: Плавные переходы и эффекты появления
- **Образовательный контент**: Информация о пентестинге, инструментах и методологии
- **Хакерские эффекты**: Анимированные элементы на фоне (SQL-инъекции, brute force, DDoS, и др.)
- **Живые системные логи**: Имитация реальных логов безопасности
- **Интерактивные элементы**: Эффекты при наведении, мерцание, глитч-эффекты

## 🛠️ Технологии

- **HTML5** - Семантическая разметка
- **CSS3** - Стилизация и анимации
- **JavaScript** - Интерактивность
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Иконки
- **Google Fonts** - Шрифты (JetBrains Mono, Orbitron, Rajdhani)

## 📁 Структура проекта

```
cybersec-site/
├── index.html              # Главная страница
├── pages/
│   └── pentesting.html     # Страница о пентестинге
├── src/
│   ├── styles/
│   │   └── input.css                # Основные стили
│   └── js/
│       ├── main.js                  # Основные JavaScript функции
│       ├── background-animations.js # Анимации заднего плана
│       └── hacker-effects.js        # Дополнительные хакерские эффекты
├── package.json            # Зависимости проекта
├── tailwind.config.js      # Конфигурация Tailwind
└── README.md              # Документация
```

## 🚀 Установка и запуск

### Предварительные требования

- Node.js (версия 16 или выше)
- npm или yarn

### Шаги установки

1. **Клонирование репозитория**
```bash
git clone https://github.com/yourusername/cybersec-site.git
cd cybersec-site
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Сборка CSS**
```bash
npm run build-css
```

4. **Запуск сервера разработки**
```bash
npm run dev
```

5. **Открытие в браузере**
```
http://localhost:3000
```

### Альтернативный способ запуска

Если у вас нет Node.js, вы можете просто открыть `index.html` в браузере, но для полной функциональности рекомендуется использовать локальный сервер.

## 📱 Страницы сайта

### Главная страница (`index.html`)
- Герой секция с анимацией
- Информация о кибербезопасности
- Секция о пентестинге
- Инструменты безопасности
- Интерактивный терминал
- Статьи и контакты

### Страница пентестинга (`pages/pentesting.html`)
- Подробная информация о методологии
- Этапы пентестинга
- Инструменты для каждого этапа
- Практические примеры
- Ресурсы для обучения

## 🖥️ Интерактивный терминал

Терминал поддерживает следующие команды:

- `help` - Показать доступные команды
- `whoami` - Показать текущего пользователя
- `ls` - Показать содержимое директории
- `cat [filename]` - Показать содержимое файла
- `nmap [target]` - Сканировать цель
- `clear` - Очистить терминал
- `date` - Показать текущую дату
- `pwd` - Показать текущую директорию
- `history` - Показать историю команд
- `exit` - Выйти из терминала

### Доступные файлы:
- `flag.txt` - CTF флаг
- `passwords.txt` - Список паролей
- `scan.sh` - Скрипт сканирования

## 🎬 Анимации и эффекты

### Фоновые эффекты
- **Матричный дождь** - Падающие символы кода и SQL-инъекций
- **Плавающий код** - Движущиеся команды Linux и инструменты хакинга
- **Сетевые пакеты** - Визуализация сетевого трафика и атак
- **Системные логи** - Живые логи безопасности и предупреждения
- **Brute force анимация** - Имитация перебора паролей
- **SQL-инъекции** - Анимированные инъекции в реальном времени
- **DDoS визуализация** - Эффект распределенной атаки

### Интерактивные эффекты
- **Глитч-эффекты** - Цифровые искажения текста
- **Мерцание** - Эффект нестабильности терминала
- **Эффекты сканирования** - Анимированные полосы сканирования
- **Пульсация** - Эффекты безопасности и предупреждений
- **Системные уведомления** - Всплывающие алерты безопасности

### Управление эффектами
- Нажмите **Escape** для отключения фоновых эффектов
- Эффекты автоматически оптимизируются для производительности
- Мобильные устройства используют облегченную версию

## 🎨 Кастомизация

### Цветовая схема

Проект использует кастомную цветовую палитру в киберпанк стиле:

```css
'cyber-dark': '#0a0a0a',     /* Основной фон */
'cyber-green': '#00ff41',    /* Зеленый неон */
'cyber-blue': '#00d4ff',     /* Синий неон */
'cyber-purple': '#8b5cf6',   /* Фиолетовый */
'cyber-red': '#ff0040',      /* Красный */
'cyber-gray': '#1a1a1a',     /* Серый фон */
'cyber-light': '#f0f0f0',    /* Светлый текст */
```

### Добавление новых команд терминала

Для добавления новой команды в терминал, отредактируйте объект `terminalCommands` в `src/js/main.js`:

```javascript
const terminalCommands = {
    newcommand: (args) => {
        // Логика команды
        return 'Результат выполнения';
    }
};
```

## 🔧 Разработка

### Сборка для продакшена

```bash
npm run build
```

### Отслеживание изменений CSS

```bash
npm run build-css
```

### Структура CSS

CSS организован в слои:
- `@layer base` - Базовые стили
- `@layer components` - Компоненты
- `@layer utilities` - Утилиты

## 📚 Образовательный контент

### Темы, охватываемые на сайте:

1. **Основы информационной безопасности**
   - Защита данных
   - Анализ угроз
   - Сетевая безопасность

2. **Пентестинг и этичный хакинг**
   - Методология OWASP
   - Этапы тестирования
   - Инструменты и техники

3. **Популярные инструменты**
   - Nmap
   - Burp Suite
   - Metasploit
   - Wireshark
   - И другие

## 🛡️ Безопасность

Этот проект создан исключительно в образовательных целях. Все упомянутые техники и инструменты должны использоваться только для:

- Обучения и исследований
- Тестирования собственных систем
- Авторизованного пентестинга
- Улучшения безопасности

⚠️ **Внимание**: Использование этих знаний для несанкционированного доступа к системам является незаконным.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Если у вас есть предложения:

1. Сделайте форк репозитория
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

### Области для улучшения:

- [ ] Добавление новых команд терминала
- [ ] Расширение базы статей
- [ ] Улучшение анимаций
- [ ] Добавление dark/light режимов
- [ ] Интеграция с реальными API
- [ ] Мобильная оптимизация

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей.

## 📞 Контакты

- **Email**: info@cybersec-hub.ru
- **Telegram**: @cybersec_hub
- **GitHub**: github.com/cybersec-hub

## 🎯 Дорожная карта

- [x] Базовая структура сайта
- [x] Интерактивный терминал
- [x] Страница о пентестинге
- [ ] Блог с статьями
- [ ] Система пользователей
- [ ] CTF платформа
- [ ] API для инструментов
- [ ] Мобильное приложение

## 🌟 Поддержка

Если проект оказался полезным, поставьте ⭐ на GitHub!

---

> "Безопасность не продукт, а процесс" - Брюс Шнайер

**Создано с ❤️ для сообщества кибербезопасности** 