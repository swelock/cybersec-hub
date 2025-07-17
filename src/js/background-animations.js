// Анимации заднего плана для хакерской тематики
class HackerBackgroundAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createMatrixRain();
        this.createFloatingCode();
        this.createNetworkPackets();
        this.createSystemLogs();
        this.createBruteForceAnimation();
        this.createSQLInjectionFlow();
        this.createDDoSVisualization();
    }

    // Матричный дождь с кодом
    createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-rain';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -10;
            opacity: 0.3;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const characters = 'SELECT * FROM users WHERE password="admin"/**/UNION/**/SELECT/**/password/**/FROM/**/admin_users--';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 50);
    }

    // Плавающий код
    createFloatingCode() {
        const container = document.createElement('div');
        container.id = 'floating-code';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -9;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const codeSnippets = [
            'nc -lvnp 4444',
            'nmap -sS -A target.com',
            'sqlmap -u "http://target.com/login.php" --dbs',
            'hydra -l admin -P passwords.txt ssh://target.com',
            'john --wordlist=rockyou.txt hashes.txt',
            'msfconsole',
            'exploit/multi/handler',
            'set PAYLOAD windows/meterpreter/reverse_tcp',
            'use auxiliary/scanner/portscan/tcp',
            'searchsploit apache 2.4',
            'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt',
            'nikto -h http://target.com',
            'burpsuite --proxy-port 8080',
            'wireshark -i eth0',
            'ettercap -T -M arp:remote /192.168.1.1// /192.168.1.100//',
            'aircrack-ng -a2 -b 00:11:22:33:44:55 -w wordlist.txt capture.cap',
            'hashcat -m 0 -a 0 hash.txt rockyou.txt',
            'python3 exploit.py',
            'chmod +x reverse_shell.sh',
            './reverse_shell.sh',
            'ps aux | grep root',
            'sudo -l',
            'find / -perm -4000 2>/dev/null',
            'cat /etc/passwd',
            'uname -a',
            'id',
            'whoami',
            'ls -la /root',
            'netstat -tulpn',
            'ss -tuln'
        ];

        const createFloatingElement = () => {
            const element = document.createElement('div');
            element.style.cssText = `
                position: absolute;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                color: rgba(0, 255, 65, 0.6);
                white-space: nowrap;
                animation: float-across 15s linear infinite;
                top: ${Math.random() * 100}%;
                left: -200px;
            `;
            
            element.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            container.appendChild(element);

            setTimeout(() => {
                element.remove();
            }, 15000);
        };

        // Создаем новый элемент каждые 2 секунды
        setInterval(createFloatingElement, 2000);

        // Добавляем CSS анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-across {
                0% { transform: translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Сетевые пакеты
    createNetworkPackets() {
        const container = document.createElement('div');
        container.id = 'network-packets';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -8;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const packets = [
            'TCP 192.168.1.100:22 → 10.0.0.1:4444 [SYN]',
            'HTTP GET /admin/login.php',
            'SSH bruteforce attempt: admin:password123',
            'DNS query: evil.com',
            'ICMP flood detected',
            'Port scan: 80,443,22,21,23,25,53,135,139,445',
            'SQL injection detected: \' OR 1=1--',
            'Reverse shell established',
            'Privilege escalation attempt',
            'Lateral movement detected',
            'Data exfiltration: 2.3GB transferred',
            'Malware C2 callback',
            'Phishing email sent',
            'Keylogger installed',
            'Ransomware encryption started',
            'Firewall rule bypassed',
            'VPN tunnel established',
            'Tor connection detected',
            'Cryptocurrency mining started',
            'Botnet command received'
        ];

        const createPacket = () => {
            const packet = document.createElement('div');
            packet.style.cssText = `
                position: absolute;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: rgba(0, 212, 255, 0.7);
                background: rgba(0, 0, 0, 0.3);
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid rgba(0, 212, 255, 0.3);
                animation: packet-flow 12s ease-in-out infinite;
                right: -300px;
                top: ${Math.random() * 100}%;
            `;
            
            packet.textContent = packets[Math.floor(Math.random() * packets.length)];
            container.appendChild(packet);

            setTimeout(() => {
                packet.remove();
            }, 12000);
        };

        setInterval(createPacket, 1500);

        // CSS анимация для пакетов
        const style = document.createElement('style');
        style.textContent = `
            @keyframes packet-flow {
                0% { transform: translateX(0); opacity: 0; }
                15% { opacity: 1; }
                85% { opacity: 1; }
                100% { transform: translateX(calc(-100vw - 300px)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Системные логи
    createSystemLogs() {
        const container = document.createElement('div');
        container.id = 'system-logs';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            height: 200px;
            pointer-events: none;
            z-index: -7;
            overflow: hidden;
            background: rgba(12, 12, 12, 0.8);
            border: 1px solid rgba(255, 0, 64, 0.3);
            border-radius: 5px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #ff0040;
            padding: 10px;
        `;
        document.body.appendChild(container);

        const logs = [
            '[ERROR] Failed login attempt for user: admin',
            '[ALERT] SQL injection detected in parameter: id',
            '[WARNING] Unusual traffic pattern detected',
            '[CRITICAL] Privilege escalation attempt',
            '[INFO] Firewall rule triggered',
            '[ERROR] Buffer overflow detected',
            '[ALERT] Malware signature found',
            '[WARNING] Suspicious file execution',
            '[CRITICAL] Data breach detected',
            '[INFO] Intrusion detection system activated',
            '[ERROR] Authentication bypass attempt',
            '[ALERT] Command injection in web form',
            '[WARNING] Brute force attack detected',
            '[CRITICAL] Ransomware behavior detected',
            '[INFO] Network scan from external IP',
            '[ERROR] Cross-site scripting attempt',
            '[ALERT] Unusual outbound traffic',
            '[WARNING] Trojan communication detected',
            '[CRITICAL] Root access compromised',
            '[INFO] Security policy violation'
        ];

        const addLog = () => {
            const logEntry = document.createElement('div');
            const timestamp = new Date().toLocaleTimeString();
            logEntry.textContent = `${timestamp} ${logs[Math.floor(Math.random() * logs.length)]}`;
            logEntry.style.cssText = `
                margin-bottom: 2px;
                opacity: 0;
                animation: log-appear 0.5s ease-in-out forwards;
            `;
            
            container.appendChild(logEntry);
            
            // Удаляем старые логи
            while (container.children.length > 15) {
                container.removeChild(container.firstChild);
            }
        };

        setInterval(addLog, 2000);

        // CSS анимация для логов
        const style = document.createElement('style');
        style.textContent = `
            @keyframes log-appear {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Brute force анимация
    createBruteForceAnimation() {
        const container = document.createElement('div');
        container.id = 'brute-force';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 350px;
            height: 150px;
            pointer-events: none;
            z-index: -6;
            overflow: hidden;
            background: rgba(12, 12, 12, 0.9);
            border: 1px solid rgba(255, 165, 0, 0.3);
            border-radius: 5px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #ffa500;
            padding: 10px;
        `;
        document.body.appendChild(container);

        const passwords = [
            'admin', 'password', '123456', 'password123', 'admin123',
            'root', 'toor', 'qwerty', 'letmein', 'welcome',
            'monkey', 'dragon', 'master', 'shadow', 'jesus',
            'michael', 'superman', 'mustang', 'access', 'trustno1',
            'jordan', 'hunter', 'ranger', 'tiger', 'secret',
            'charlie', 'donald', 'freedom', 'pass', 'maggie'
        ];

        const attemptBruteForce = () => {
            const attempt = document.createElement('div');
            const password = passwords[Math.floor(Math.random() * passwords.length)];
            const isSuccess = Math.random() > 0.95; // 5% успех
            
            attempt.style.cssText = `
                margin-bottom: 1px;
                color: ${isSuccess ? '#00ff41' : '#ffa500'};
                opacity: 0;
                animation: brute-appear 0.3s ease-in-out forwards;
            `;
            
            attempt.textContent = `[${new Date().toLocaleTimeString()}] Trying: ${password} ${isSuccess ? '✓ SUCCESS' : '✗ FAILED'}`;
            container.appendChild(attempt);
            
            // Удаляем старые попытки
            while (container.children.length > 12) {
                container.removeChild(container.firstChild);
            }

            if (isSuccess) {
                setTimeout(() => {
                    container.innerHTML = '<div style="color: #00ff41; text-align: center; margin-top: 50px;">ACCESS GRANTED<br/>Password: ' + password + '</div>';
                    setTimeout(() => {
                        container.innerHTML = '';
                    }, 3000);
                }, 1000);
            }
        };

        setInterval(attemptBruteForce, 300);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes brute-appear {
                0% { opacity: 0; transform: translateX(-10px); }
                100% { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // SQL Injection поток
    createSQLInjectionFlow() {
        const container = document.createElement('div');
        container.id = 'sql-injection';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 100px;
            pointer-events: none;
            z-index: -5;
            overflow: hidden;
            opacity: 0.4;
        `;
        document.body.appendChild(container);

        const sqlInjections = [
            "' OR '1'='1' --",
            "'; DROP TABLE users; --",
            "' UNION SELECT username, password FROM admin_users --",
            "' OR 1=1 UNION SELECT null, concat(user,0x3a,password) FROM mysql.user --",
            "') OR ('1'='1",
            "' AND (SELECT COUNT(*) FROM users) > 0 --",
            "' OR 1=1 INTO OUTFILE '/tmp/dump.txt' --",
            "'; EXEC xp_cmdshell('net user hacker password /add') --",
            "' OR EXISTS(SELECT * FROM users WHERE username='admin') --",
            "' AND ASCII(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)) > 64 --"
        ];

        const createSQLFlow = () => {
            const injection = document.createElement('div');
            injection.style.cssText = `
                position: absolute;
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                color: #8b5cf6;
                background: rgba(139, 92, 246, 0.1);
                padding: 5px 10px;
                border-radius: 5px;
                border: 1px solid rgba(139, 92, 246, 0.3);
                animation: sql-flow 8s ease-in-out infinite;
                top: ${Math.random() * 80}px;
                left: -400px;
                white-space: nowrap;
            `;
            
            injection.textContent = sqlInjections[Math.floor(Math.random() * sqlInjections.length)];
            container.appendChild(injection);

            setTimeout(() => {
                injection.remove();
            }, 8000);
        };

        setInterval(createSQLFlow, 3000);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sql-flow {
                0% { transform: translateX(0) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateX(800px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // DDoS визуализация
    createDDoSVisualization() {
        const container = document.createElement('div');
        container.id = 'ddos-visualization';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -4;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const createDDoSPacket = () => {
            const packet = document.createElement('div');
            const targetX = window.innerWidth / 2;
            const targetY = window.innerHeight / 2;
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            
            packet.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff0040;
                border-radius: 50%;
                left: ${startX}px;
                top: ${startY}px;
                animation: ddos-attack 2s ease-in-out forwards;
                box-shadow: 0 0 6px #ff0040;
            `;
            
            container.appendChild(packet);
            
            // Анимация к центру
            const deltaX = targetX - startX;
            const deltaY = targetY - startY;
            
            packet.style.animation = 'none';
            packet.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            packet.style.transition = 'transform 2s ease-in-out, opacity 2s ease-in-out';
            packet.style.opacity = '0';

            setTimeout(() => {
                packet.remove();
            }, 2000);
        };

        // Создаем пакеты каждые 50ms для эффекта DDoS
        setInterval(createDDoSPacket, 50);

        // Центральная цель
        const target = document.createElement('div');
        target.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 2px solid #ff0040;
            border-radius: 50%;
            background: rgba(255, 0, 64, 0.1);
            animation: target-pulse 1s ease-in-out infinite alternate;
        `;
        container.appendChild(target);

        // CSS анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes target-pulse {
                0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px #ff0040; }
                100% { transform: translate(-50%, -50%) scale(1.2); box-shadow: 0 0 40px #ff0040; }
            }
        `;
        document.head.appendChild(style);
    }

    // Создание движущихся хешей
    createHashFlow() {
        const container = document.createElement('div');
        container.id = 'hash-flow';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -3;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const hashes = [
            '5d41402abc4b2a76b9719d911017c592',
            'e3b0c44298fc1c149afbf4c8996fb924',
            'a665a45920422f9d417e4867efdc4fb8',
            '098f6bcd4621d373cade4e832627b4f6',
            'b1946ac92492d2347c6235b4d2611184',
            '5e884898da28047151d0e56f8dc6292',
            'ad0234829205b9033196ba818f7a872b',
            '9bb58f26192e4ba00f01e2e7b136bbd8',
            '7d793037a0760186574b0282f2f435e7',
            'b6d767d2f8ed5d21a44b0e5886680cb9'
        ];

        const createHash = () => {
            const hash = document.createElement('div');
            hash.style.cssText = `
                position: absolute;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                color: rgba(255, 255, 0, 0.6);
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: hash-drift 20s linear infinite;
            `;
            
            hash.textContent = hashes[Math.floor(Math.random() * hashes.length)];
            container.appendChild(hash);

            setTimeout(() => {
                hash.remove();
            }, 20000);
        };

        setInterval(createHash, 4000);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes hash-drift {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new HackerBackgroundAnimations();
});

// Экспорт для использования в других файлах
window.HackerBackgroundAnimations = HackerBackgroundAnimations; 