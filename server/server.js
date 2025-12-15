import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Парсим PORT, убирая возможные переносы строк и лишние символы
const PORT = parseInt((process.env.PORT || '3001').split('\n')[0].trim(), 10) || 3001;
const JWT_SECRET = (process.env.JWT_SECRET || 'default-secret-key-change-in-production').split('\n')[0].trim();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Путь к файлу с данными
const DATA_DIR = join(__dirname, 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

// Хранилище статистики игр в памяти
// Структура: { userId: { wins: number, losses: number, games: [] } }
const gameStats = new Map();

// Инициализация директории данных
async function initDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const fileExists = await fs.access(USERS_FILE).then(() => true).catch(() => false);
    
    if (!fileExists) {
      // Создаем начального админа
      const initialUsers = [{
        id: 'admin_001',
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        credits: 0,
        wins: 0,
        losses: 0,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        createdAt: Date.now()
      }];
      
      await fs.writeFile(USERS_FILE, JSON.stringify(initialUsers, null, 2));
      console.log('Initialized users database with admin user');
    }
    
    // Очищаем файл сессий при запуске
    await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
    console.log('🧹 Sessions cleared on server startup');
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

// Чтение пользователей из файла
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Запись пользователей в файл
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
    throw error;
  }
}

// Чтение сессий из файла
async function readSessions() {
  try {
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading sessions:', error);
    return [];
  }
}

// Запись сессий в файл
async function writeSessions(sessions) {
  try {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error writing sessions:', error);
    throw error;
  }
}

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Валидация
    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Имя пользователя должно содержать от 3 до 20 символов' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 4 символа' });
    }

    // Валидация роли
    if (role !== 'user' && role !== 'teacher') {
      return res.status(400).json({ error: 'Неверная роль. Допустимые значения: user, teacher' });
    }

    const users = await readUsers();

    // Проверка существования пользователя
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: 'Пользователь с таким именем уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Определяем начальные зачеты в зависимости от роли
    const initialCredits = role === 'teacher' ? 100000 : 10;

    // Создание нового пользователя
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role: role,
      credits: initialCredits,
      wins: 0,
      losses: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: Date.now()
    };

    users.push(newUser);
    await writeUsers(users);

    // Создание JWT токена
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

// Логин
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Валидация
    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь с таким именем не найден' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

// Получение текущего пользователя
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Синхронизируем статистику из файла в память при первом обращении
    if (!gameStats.has(req.user.id)) {
      gameStats.set(req.user.id, {
        wins: user.wins || 0,
        losses: user.losses || 0,
        games: []
      });
    } else {
      // Обновляем статистику в памяти из файла (если файл более актуален)
      const memoryStats = gameStats.get(req.user.id);
      if ((user.wins || 0) > memoryStats.wins || (user.losses || 0) > memoryStats.losses) {
        memoryStats.wins = user.wins || 0;
        memoryStats.losses = user.losses || 0;
      }
    }

    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
});

// Сохранение результата игры (в память и файл)
app.post('/api/games/result', authenticateToken, async (req, res) => {
  try {
    const { isWinner, gameMode, isVip } = req.body;
    const userId = req.user.id;

    if (typeof isWinner !== 'boolean') {
      return res.status(400).json({ error: 'Неверный формат результата игры' });
    }

    // Получаем пользователя
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем статистику в памяти
    if (!gameStats.has(userId)) {
      gameStats.set(userId, { wins: 0, losses: 0, games: [] });
    }
    
    const stats = gameStats.get(userId);
    const user = users[userIndex];
    
    // Обновляем статистику побед/поражений для всех
    if (isWinner) {
      stats.wins += 1;
      users[userIndex].wins = (users[userIndex].wins || 0) + 1;
    } else {
      stats.losses += 1;
      users[userIndex].losses = (users[userIndex].losses || 0) + 1;
    }
    
    // Обновляем зачеты только для учащихся (role === 'user')
    if (user.role === 'user') {
      if (isWinner) {
        users[userIndex].credits = Math.max(0, (users[userIndex].credits || 0) + 1);
      } else {
        users[userIndex].credits = Math.max(0, (users[userIndex].credits || 0) - 1);
      }
    }

    // Сохраняем историю игры
    stats.games.push({
      isWinner,
      gameMode: gameMode || 'unknown',
      isVip: isVip || false,
      timestamp: Date.now()
    });

    // Сохраняем в файл
    await writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({ 
      user: userWithoutPassword,
      stats: {
        wins: stats.wins,
        losses: stats.losses,
        totalGames: stats.games.length
      }
    });
  } catch (error) {
    console.error('Game result error:', error);
    res.status(500).json({ error: 'Ошибка при сохранении результата игры' });
  }
});

// Получение статистики игр пользователя
app.get('/api/games/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = gameStats.get(userId) || { wins: 0, losses: 0, games: [] };
    
    res.json({
      wins: stats.wins,
      losses: stats.losses,
      totalGames: stats.games.length,
      games: stats.games.slice(-50) // Последние 50 игр
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

// Обновление данных пользователя
app.put('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const { credits, wins, losses } = req.body;
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем только разрешенные поля
    // Убеждаемся, что credits не меньше 0
    if (credits !== undefined) {
      users[userIndex].credits = Math.max(0, credits);
    }
    if (wins !== undefined) {
      users[userIndex].wins = Math.max(0, wins);
      // Синхронизируем с памятью
      if (!gameStats.has(req.user.id)) {
        gameStats.set(req.user.id, { wins: 0, losses: 0, games: [] });
      }
      gameStats.get(req.user.id).wins = users[userIndex].wins;
    }
    if (losses !== undefined) {
      users[userIndex].losses = Math.max(0, losses);
      // Синхронизируем с памятью
      if (!gameStats.has(req.user.id)) {
        gameStats.set(req.user.id, { wins: 0, losses: 0, games: [] });
      }
      gameStats.get(req.user.id).losses = users[userIndex].losses;
    }

    await writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
});

// Получение всех пользователей (только для админа)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const users = await readUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

// Получение только студентов (только для админа)
app.get('/api/users/students', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const users = await readUsers();
    const students = users
      .filter(u => u.role === 'user')
      .map(({ password, ...user }) => user);

    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Ошибка при получении студентов' });
  }
});

// Обновление зачетов конкретного пользователя (только для админа)
app.put('/api/users/:userId/credits', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const { userId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Неверный формат количества зачетов' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем зачеты
    users[userIndex].credits = Math.max(0, (users[userIndex].credits || 0) + amount);

    await writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update user credits error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении зачетов' });
  }
});

// ========== SESSIONS API ==========

// Получить все активные сессии
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await readSessions();
    // Фильтруем только валидные сессии (не старше 1 часа)
    const now = Date.now();
    const validSessions = sessions.filter(s => (now - s.createdAt) < 3600000);
    
    // Если есть невалидные, сохраняем только валидные
    if (validSessions.length !== sessions.length) {
      await writeSessions(validSessions);
    }
    
    res.json({ sessions: validSessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Ошибка при получении сессий' });
  }
});

// Создать новую сессию
app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const { mode, rounds, creatorName, creator, creatorId, creatorUserRole } = req.body;
    
    if (!mode || !rounds || !creatorName || !creator) {
      return res.status(400).json({ error: 'Недостаточно данных для создания сессии' });
    }
    
    const sessions = await readSessions();
    
    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      rounds,
      creatorName,
      creator,
      creatorId: creatorId || req.user.id,
      creatorUserRole: creatorUserRole || req.user.role,
      createdAt: Date.now()
    };
    
    sessions.push(newSession);
    await writeSessions(sessions);
    
    res.status(201).json({ session: newSession });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Ошибка при создании сессии' });
  }
});

// Удалить сессию
app.delete('/api/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = await readSessions();
    
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    await writeSessions(filteredSessions);
    
    res.json({ message: 'Сессия удалена', sessionId });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Ошибка при удалении сессии' });
  }
});

// Очистить все сессии
app.delete('/api/sessions', authenticateToken, async (req, res) => {
  try {
    await writeSessions([]);
    res.json({ message: 'Все сессии очищены' });
  } catch (error) {
    console.error('Clear sessions error:', error);
    res.status(500).json({ error: 'Ошибка при очистке сессий' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Запуск сервера
async function startServer() {
  await initDataDir();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
  });
}

startServer().catch(console.error);
