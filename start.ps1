# CyberSec Hub - Скрипт запуска проекта
# PowerShell скрипт для Windows

Write-Host "🛡️  CyberSec Hub - Запуск проекта" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Проверка наличия Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден. Пожалуйста, установите Node.js с https://nodejs.org/" -ForegroundColor Red
    Write-Host "Продолжаем запуск без Node.js (базовая функциональность)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

# Проверка наличия npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm найден: $npmVersion" -ForegroundColor Green
    
    # Проверка существования package.json
    if (Test-Path "package.json") {
        Write-Host "📦 Установка зависимостей..." -ForegroundColor Blue
        npm install
        
        Write-Host "🎨 Сборка CSS..." -ForegroundColor Blue
        npm run build-css
        
        Write-Host "🚀 Запуск сервера разработки..." -ForegroundColor Blue
        Write-Host "Сайт будет доступен по адресу: http://localhost:3000" -ForegroundColor Yellow
        npm run dev
    } else {
        Write-Host "⚠️  package.json не найден" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  npm не найден. Запуск без сервера разработки..." -ForegroundColor Yellow
    
    # Альтернативный способ запуска
    Write-Host "🌐 Открытие главной страницы в браузере..." -ForegroundColor Blue
    
    # Получение пути к index.html
    $indexPath = Join-Path $PSScriptRoot "index.html"
    
    if (Test-Path $indexPath) {
        # Открытие в браузере по умолчанию
        Start-Process $indexPath
        Write-Host "✅ Главная страница открыта в браузере" -ForegroundColor Green
        Write-Host "📄 Файл: $indexPath" -ForegroundColor Gray
    } else {
        Write-Host "❌ Файл index.html не найден" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 Доступные страницы:" -ForegroundColor Cyan
Write-Host "   • index.html - Главная страница" -ForegroundColor White
Write-Host "   • pages/pentesting.html - Пентестинг" -ForegroundColor White
Write-Host "   • pages/articles.html - Статьи" -ForegroundColor White
Write-Host "   • pages/threats.html - Угрозы" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Полезные команды:" -ForegroundColor Cyan
Write-Host "   • npm run dev - Запуск сервера разработки" -ForegroundColor White
Write-Host "   • npm run build-css - Сборка CSS" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Проект готов к использованию!" -ForegroundColor Green
Write-Host "Для остановки сервера нажмите Ctrl+C" -ForegroundColor Yellow

# Пауза для чтения сообщений
if ($args -notcontains "-auto") {
    Write-Host ""
    Write-Host "Нажмите любую клавишу для продолжения..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 