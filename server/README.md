# MCB Backend API

Node.js бэкенд для приложения MCB Casino.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Настройте переменные окружения в `.env`:
```
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Запуск

### Режим разработки (с автоперезагрузкой):
```bash
npm run dev
```

### Продакшн режим:
```bash
npm start
```

Сервер запустится на `http://localhost:3001`

## API Endpoints

### Авторизация

#### POST `/api/auth/register`
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "username": "string (3-20 символов)",
  "password": "string (минимум 4 символа)"
}
```

**Ответ:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "user",
    "credits": 0,
    "wins": 0,
    "losses": 0,
    "avatar": "string",
    "createdAt": "number"
  },
  "token": "JWT токен"
}
```

#### POST `/api/auth/login`
Вход в систему

**Тело запроса:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Ответ:**
```json
{
  "user": { ... },
  "token": "JWT токен"
}
```

#### GET `/api/auth/me`
Получение текущего пользователя (требует авторизации)

**Заголовки:**
```
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "user": { ... }
}
```

#### PUT `/api/auth/user`
Обновление данных пользователя (требует авторизации)

**Тело запроса:**
```json
{
  "credits": 10,
  "wins": 5,
  "losses": 3
}
```

### Пользователи (только для админов)

#### GET `/api/users`
Получение всех пользователей (требует роль admin)

**Ответ:**
```json
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "role": "user|admin",
      "credits": 0,
      "wins": 0,
      "losses": 0,
      "avatar": "string",
      "createdAt": "number"
    }
  ]
}
```

#### GET `/api/users/students`
Получение только студентов (требует роль admin)

**Ответ:**
```json
{
  "students": [
    {
      "id": "string",
      "username": "string",
      "role": "user",
      "credits": 0,
      "wins": 0,
      "losses": 0,
      "avatar": "string",
      "createdAt": "number"
    }
  ]
}
```

#### PUT `/api/users/:userId/credits`
Обновление зачетов конкретного пользователя (требует роль admin)

**Тело запроса:**
```json
{
  "amount": 1  // положительное или отрицательное число
}
```

**Ответ:**
```json
{
  "user": { ... }
}
```

### Health Check

#### GET `/api/health`
Проверка работоспособности сервера

## Хранение данных

Данные хранятся в JSON файле `data/users.json`. При первом запуске автоматически создается администратор:
- Username: `admin`
- Password: `admin`

## Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены для аутентификации
- CORS настроен для работы с фронтендом
- Валидация входных данных

## Структура проекта

```
server/
├── server.js          # Основной файл сервера
├── package.json       # Зависимости
├── .env               # Переменные окружения (не в git)
├── .env.example       # Пример переменных окружения
├── data/              # Директория с данными
│   └── users.json     # Файл с пользователями
└── README.md          # Документация
```
