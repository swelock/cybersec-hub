# 🖥️ Руководство по интерактивному терминалу

## Описание
Интерактивный терминал на сайте CyberSec Hub имитирует работу с командной строкой Linux и предоставляет образовательные примеры команд, используемых в кибербезопасности.

## 📋 Доступные команды

### Базовые команды Linux
- `help` - Показать список всех доступных команд
- `whoami` - Показать текущего пользователя
- `pwd` - Показать текущую директорию
- `ls` - Показать содержимое текущей директории
- `date` - Показать текущую дату и время
- `clear` - Очистить экран терминала
- `history` - Показать историю выполненных команд
- `exit` - Выйти из терминала

### Команды для работы с файлами
- `cat [filename]` - Показать содержимое файла
  - Пример: `cat flag.txt`
  - Пример: `cat passwords.txt`
  - Пример: `cat scan.sh`

### Команды кибербезопасности
- `nmap [target]` - Симуляция сканирования портов
  - Пример: `nmap localhost`
  - Пример: `nmap 192.168.1.1`
  - Пример: `nmap google.com`

## 📁 Доступные файлы

### flag.txt
Содержит CTF флаг для образовательных целей.
```
🚩 CTF{w3lc0m3_t0_cyb3r_s3cur1ty_w0rld}
```

### passwords.txt
Пример файла с паролями для демонстрации важности безопасности:
```
admin:password123
user:qwerty
root:toor
test:test123
guest:guest
```

### scan.sh
Пример bash скрипта для сканирования сети:
```bash
#!/bin/bash
echo "Scanning network..."
nmap -sn 192.168.1.0/24
echo "Scan complete!"
```

## 🎯 Примеры использования

### Пример 1: Изучение структуры системы
```bash
user@cybersec:~$ whoami
cybersec-user

user@cybersec:~$ pwd
/home/cybersec-user

user@cybersec:~$ ls
drwxr-xr-x 2 user user 4096 Oct 15 10:30 .
drwxr-xr-x 3 user user 4096 Oct 15 10:30 ..
-rw-r--r-- 1 user user   42 Oct 15 10:30 flag.txt
-rwxr-xr-x 1 user user 8192 Oct 15 10:30 scan.sh
-rw-r--r-- 1 user user  256 Oct 15 10:30 passwords.txt
-rwxr-xr-x 1 user user 1024 Oct 15 10:30 exploit.py
```

### Пример 2: Чтение файлов
```bash
user@cybersec:~$ cat flag.txt
🚩 CTF{w3lc0m3_t0_cyb3r_s3cur1ty_w0rld}

user@cybersec:~$ cat passwords.txt
admin:password123
user:qwerty
root:toor
test:test123
guest:guest
```

### Пример 3: Сканирование сети
```bash
user@cybersec:~$ nmap localhost
Starting Nmap scan on localhost...

Nmap scan report for localhost
Host is up (0.00050s latency).

PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql

Nmap done: 1 IP address (1 host up) scanned in 2.45 seconds
```

### Пример 4: Работа с историей
```bash
user@cybersec:~$ history
1  whoami
2  ls
3  cat flag.txt
4  nmap localhost
5  history
```

## 🎨 Особенности интерфейса

### Автозавершение
- Терминал не поддерживает автозавершение Tab, но показывает подсказки при вводе `help`

### История команд
- Все команды сохраняются в локальном хранилище браузера
- Максимум 50 команд в истории
- История сохраняется между сеансами

### Стилизация
- Зеленый текст для промпта пользователя
- Синий текст для пути
- Белый текст для введенных команд
- Серый текст для вывода команд

## 🔧 Технические детails

### Реализация
Терминал реализован на чистом JavaScript без внешних библиотек:
- Обработка событий клавиатуры
- Парсинг команд и аргументов
- Симуляция файловой системы
- Локальное хранение истории

### Безопасность
- Терминал полностью изолирован
- Нет доступа к реальной файловой системе
- Все команды - это симуляция
- Нет сетевых запросов к внешним ресурсам

## 🎓 Образовательные цели

### Для начинающих
- Знакомство с командной строкой Linux
- Основные команды для навигации
- Понимание структуры файловой системы

### Для изучающих кибербезопасность
- Основы работы с Nmap
- Понимание структуры сетевого сканирования
- Работа с файлами конфигурации

### Для практики
- CTF флаги для поиска
- Симуляция реальных сценариев
- Безопасная среда для экспериментов

## 🚀 Расширение функциональности

### Добавление новых команд
Для добавления новой команды в терминал:

1. Откройте файл `src/js/main.js`
2. Найдите объект `terminalCommands`
3. Добавьте новую команду:

```javascript
const terminalCommands = {
    // ... существующие команды
    
    newcommand: (args) => {
        // Логика новой команды
        return 'Результат выполнения команды';
    }
};
```

### Добавление новых файлов
Для добавления нового файла:

1. Найдите функцию `cat` в объекте `terminalCommands`
2. Добавьте новый файл в объект `files`:

```javascript
cat: (args) => {
    const files = {
        // ... существующие файлы
        'newfile.txt': 'Содержимое нового файла'
    };
    // ... остальная логика
}
```

## 📚 Полезные ресурсы

### Документация
- [Linux Command Line Basics](https://ubuntu.com/tutorials/command-line-for-beginners)
- [Nmap Documentation](https://nmap.org/book/)
- [CTF Challenges](https://ctftime.org/)

### Практика
- [OverTheWire Wargames](https://overthewire.org/wargames/)
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)

---

**Примечание**: Этот терминал создан исключительно для образовательных целей. Все команды и файлы являются симуляцией и не представляют реальной угрозы безопасности. 