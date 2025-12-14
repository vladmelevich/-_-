# Инструкция по запуску проекта

## Структура проекта

```
tpo/
├── main/          # Фронтенд (React + Vite)
└── server/        # Бэкенд (Node.js + Express)
```

## Запуск проекта

### 1. Установка зависимостей

#### Фронтенд:
```bash
cd main
npm install
```

#### Бэкенд:
```bash
cd server
npm install
```

### 2. Настройка переменных окружения

#### Бэкенд:
Создайте файл `server/.env`:
```
PORT=3001
JWT_SECRET=mcb-secret-key-change-in-production-2024
NODE_ENV=development
```

#### Фронтенд (опционально):
Создайте файл `main/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

Если не создадите, будет использован URL по умолчанию: `http://localhost:3001/api`

### 3. Запуск

#### В двух терминалах:

**Терминал 1 - Бэкенд:**
```bash
cd server
npm run dev
```

Сервер запустится на `http://localhost:3001`

**Терминал 2 - Фронтенд:**
```bash
cd main
npm run dev
```

Приложение откроется на `http://localhost:5173`

## Тестирование

### Предустановленный администратор:
- **Username:** `admin`
- **Password:** `admin`

### Проверка работы API:

```bash
# Health check
curl http://localhost:3001/api/health

# Регистрация
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test1234"}'

# Логин
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

## Особенности

- Бэкенд хранит данные в JSON файле `server/data/users.json`
- JWT токены для аутентификации (срок действия: 24 часа)
- Пароли хешируются с помощью bcrypt
- CORS настроен для работы с фронтендом на localhost:5173

## Устранение неполадок

### Порт уже занят
Если порт 3001 занят, измените `PORT` в `server/.env`

### CORS ошибки
Убедитесь, что фронтенд запущен на `http://localhost:5173` или обновите CORS настройки в `server/server.js`

### Ошибки подключения к API
Проверьте, что:
1. Бэкенд запущен и работает на порту 3001
2. URL API правильный в `main/src/utils/api.js` или в `.env`
3. Нет блокировки файрволом
