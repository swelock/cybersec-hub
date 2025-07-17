// DOM элементы
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const terminalInput = document.getElementById('terminal-input');
const terminalHistory = document.getElementById('terminal-history');

// Мобильное меню
mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Закрыть мобильное меню после клика
        mobileMenu.classList.add('hidden');
    });
});

// Интерактивный терминал
const terminalCommands = {
    help: () => {
        return `Доступные команды:
  help     - показать это сообщение
  whoami   - показать текущего пользователя
  ls       - показать содержимое директории
  cat      - показать содержимое файла
  nmap     - сканировать сеть
  clear    - очистить терминал
  date     - показать текущую дату
  pwd      - показать текущую директорию
  history  - показать историю команд
  exit     - выйти из терминала`;
    },
    
    whoami: () => 'cybersec-user',
    
    ls: () => {
        return `drwxr-xr-x 2 user user 4096 Oct 15 10:30 .
drwxr-xr-x 3 user user 4096 Oct 15 10:30 ..
-rw-r--r-- 1 user user   42 Oct 15 10:30 flag.txt
-rwxr-xr-x 1 user user 8192 Oct 15 10:30 scan.sh
-rw-r--r-- 1 user user  256 Oct 15 10:30 passwords.txt
-rwxr-xr-x 1 user user 1024 Oct 15 10:30 exploit.py`;
    },
    
    cat: (args) => {
        const files = {
            'flag.txt': '🚩 CTF{w3lc0m3_t0_cyb3r_s3cur1ty_w0rld}',
            'passwords.txt': `admin:password123
user:qwerty
root:toor
test:test123
guest:guest`,
            'scan.sh': `#!/bin/bash
echo "Scanning network..."
nmap -sn 192.168.1.0/24
echo "Scan complete!"`
        };
        
        if (!args || args.length === 0) {
            return 'cat: необходимо указать файл';
        }
        
        const filename = args[0];
        if (files[filename]) {
            return files[filename];
        } else {
            return `cat: ${filename}: Файл не найден`;
        }
    },
    
    nmap: (args) => {
        const target = args && args.length > 0 ? args[0] : 'localhost';
        return `Starting Nmap scan on ${target}...

Nmap scan report for ${target}
Host is up (0.00050s latency).

PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql

Nmap done: 1 IP address (1 host up) scanned in 2.45 seconds`;
    },
    
    clear: () => {
        terminalHistory.innerHTML = '';
        return '';
    },
    
    date: () => new Date().toLocaleString('ru-RU'),
    
    pwd: () => '/home/cybersec-user',
    
    history: () => {
        const commands = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
        return commands.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n') || 'История пуста';
    },
    
    exit: () => {
        terminalInput.disabled = true;
        return 'Соединение закрыто.';
    }
};

// Функция выполнения команды
function executeCommand(command) {
    const [cmd, ...args] = command.trim().split(' ');
    
    if (terminalCommands[cmd]) {
        return terminalCommands[cmd](args);
    } else if (cmd === '') {
        return '';
    } else {
        return `bash: ${cmd}: команда не найдена`;
    }
}

// Сохранение истории команд
function saveCommandHistory(command) {
    const history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
    history.push(command);
    if (history.length > 50) {
        history.shift();
    }
    localStorage.setItem('terminalHistory', JSON.stringify(history));
}

// Обработка ввода в терминале
terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (command) {
            // Добавить команду в историю
            const commandLine = document.createElement('div');
            commandLine.classList.add('mb-2');
            commandLine.innerHTML = `<span class="text-cyber-green">user@cybersec:</span><span class="text-cyber-blue">~$</span> <span class="text-white">${command}</span>`;
            terminalHistory.appendChild(commandLine);
            
            // Выполнить команду
            const output = executeCommand(command);
            if (output) {
                const outputLine = document.createElement('div');
                outputLine.classList.add('text-gray-400', 'mb-2', 'whitespace-pre-line');
                outputLine.textContent = output;
                terminalHistory.appendChild(outputLine);
            }
            
            // Сохранить в историю
            saveCommandHistory(command);
            
            // Очистить поле ввода
            terminalInput.value = '';
            
            // Прокрутить к низу
            terminalHistory.scrollTop = terminalHistory.scrollHeight;
        }
    }
});

// Анимация печати для заголовка
function typeWriter(element, text, speed = 50) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Анимация появления элементов при прокрутке
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
            }
        });
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        if (element.classList.contains('slide-in-left')) {
            element.style.transform = 'translateX(-50px)';
        } else if (element.classList.contains('slide-in-right')) {
            element.style.transform = 'translateX(50px)';
        } else {
            element.style.transform = 'translateY(20px)';
        }
        observer.observe(element);
    });
}

// Матричный дождь
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+={}[]|:;<>?";
    const drops = [];
    
    for (let x = 0; x < canvas.width / 10; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = '10px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * 10, drops[i] * 10);
            
            if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

// Эффект глитча для текста
function applyGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = 'glitch 2s infinite';
                }, 100);
            }
        }, 100);
    });
}

// Звуковые эффекты (опционально)
function playSound(type) {
    const sounds = {
        keypress: () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    };
    
    if (sounds[type]) {
        sounds[type]();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Запуск анимаций
    animateOnScroll();
    applyGlitchEffect();
    
    // Создание матричного дождя (опционально)
    // createMatrixRain();
    
    // Звуковые эффекты для терминала
    terminalInput?.addEventListener('keydown', () => {
        if (Math.random() > 0.7) {
            // playSound('keypress');
        }
    });
    
    // Автофокус на терминал
    terminalInput?.focus();
    
    // Приветственное сообщение в терминале
    setTimeout(() => {
        if (terminalHistory) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.classList.add('text-cyber-green', 'mb-4');
            welcomeMessage.innerHTML = `
                <div class="mb-2">Добро пожаловать в CyberSec Hub Terminal!</div>
                <div class="text-gray-400">Введите 'help' для просмотра доступных команд.</div>
            `;
            terminalHistory.appendChild(welcomeMessage);
        }
    }, 1000);
    
    // Дополнительные эффекты для интерактивности
    initializeInteractiveEffects();
    
    // Добавляем эффекты к карточкам
    addCardEffects();
    
    // Инициализация системных эффектов
    initializeSystemEffects();
});

// Обработка кнопок
document.querySelectorAll('.cyber-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const text = this.textContent.trim();
        
        // Обработка внутренних ссылок
        if (text.includes('терминал')) {
            if (this.getAttribute('href') === '#terminal') {
                e.preventDefault();
                document.getElementById('terminal-input')?.focus();
                document.getElementById('terminal-input')?.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (text.includes('изучение')) {
            if (this.getAttribute('href') === '#about') {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Звуковой эффект для всех кнопок
        if (Math.random() > 0.5) {
            // playSound('click');
        }
    });
});

// Динамическое обновление времени
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU');
    
    // Обновить время в терминале, если есть элемент
    const clockElement = document.getElementById('terminal-clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

setInterval(updateClock, 1000);

// Обработка формы контактов
const contactForm = document.querySelector('form');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Имитация отправки формы
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Отправка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Отправлено!';
        submitBtn.classList.add('bg-green-600');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-green-600');
            contactForm.reset();
        }, 2000);
    }, 1500);
});

// Кастомные курсор эффекты
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Кэширование для оптимизации
const cache = new Map();

function getCachedData(key, fetchFunction) {
    if (cache.has(key)) {
        return Promise.resolve(cache.get(key));
    }
    
    return fetchFunction().then(data => {
        cache.set(key, data);
        return data;
    });
}

// Вспомогательные функции
const utils = {
    // Генерация случайного цвета
    randomColor: () => {
        const colors = ['#00ff41', '#00d4ff', '#8b5cf6', '#ff0040'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Форматирование времени
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Проверка мобильного устройства
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

// Дополнительные интерактивные эффекты
function initializeInteractiveEffects() {
    // Эффект сбоя для заголовков при наведении
    const glitchElements = document.querySelectorAll('.digital-glitch');
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'digital-glitch-1 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        });
    });
    
    // Эффект мерцания для кнопок
    const cyberBtns = document.querySelectorAll('.cyber-btn');
    cyberBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('flicker');
            setTimeout(() => {
                btn.classList.remove('flicker');
            }, 1000);
        });
    });
    
    // Случайное мерцание элементов
    setInterval(() => {
        const flickerElements = document.querySelectorAll('.flicker');
        flickerElements.forEach(element => {
            if (Math.random() > 0.8) {
                element.style.animation = 'flicker 0.3s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            }
        });
    }, 5000);
}

// Добавление эффектов к карточкам
function addCardEffects() {
    const cards = document.querySelectorAll('.card-cyber');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Добавляем эффект сканирования
            if (!card.querySelector('.scan-effect')) {
                const scanEffect = document.createElement('div');
                scanEffect.className = 'scan-effect';
                scanEffect.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.2), transparent);
                    animation: scan 1s ease-in-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                card.style.position = 'relative';
                card.appendChild(scanEffect);
                
                setTimeout(() => {
                    scanEffect.remove();
                }, 1000);
            }
        });
    });
}

// Системные эффекты
function initializeSystemEffects() {
    // Создание случайных системных уведомлений
    const notifications = [
        'Firewall: Blocked suspicious connection',
        'Antivirus: Threat detected and quarantined',
        'IDS: Unusual traffic pattern detected',
        'System: Security update available',
        'VPN: Connection established',
        'Encryption: Files encrypted successfully',
        'Backup: System backup completed',
        'Scanner: Vulnerability scan finished'
    ];
    
    function createNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 65, 0.5);
            border-radius: 5px;
            padding: 10px 15px;
            color: #00ff41;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        notification.textContent = notifications[Math.floor(Math.random() * notifications.length)];
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Удаление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Создаем уведомления каждые 10-20 секунд
    setInterval(createNotification, 10000 + Math.random() * 10000);
    
    // Эффект загрузки системы
    setTimeout(() => {
        const loadingElements = document.querySelectorAll('.system-load');
        loadingElements.forEach(element => {
            element.style.animation = 'system-load-bar 2s ease-in-out';
        });
    }, 2000);
}

// Эффект печати для текста
function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Создание эффекта матричного дождя в фоне
function createMatrixEffect() {
    const matrix = document.createElement('div');
    matrix.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    const characters = '01';
    for (let i = 0; i < 100; i++) {
        const span = document.createElement('span');
        span.textContent = characters[Math.floor(Math.random() * characters.length)];
        span.style.cssText = `
            position: absolute;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            color: rgba(0, 255, 65, ${Math.random() * 0.5 + 0.1});
            font-family: 'JetBrains Mono', monospace;
            font-size: ${Math.random() * 20 + 10}px;
            animation: matrix-fall ${Math.random() * 10 + 5}s linear infinite;
        `;
        matrix.appendChild(span);
    }
    
    document.body.appendChild(matrix);
    
    // CSS анимация для падения
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Эффект кода для терминала
function enhanceTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
        terminalInput.addEventListener('input', (e) => {
            // Добавляем эффект свечения при вводе
            e.target.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
            setTimeout(() => {
                e.target.style.boxShadow = '';
            }, 500);
        });
    }
}

// Экспорт для использования в других файлах
window.CyberSecHub = {
    utils,
    executeCommand,
    playSound,
    cache: getCachedData,
    typewriterEffect,
    createMatrixEffect,
    enhanceTerminal
}; 