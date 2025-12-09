// Dev Mode - логирование ошибок в терминал компилятора
//Active
// Логирование ошибок (выводится в терминал Vite)
export const logError = (category, error, context = null) => {
  const timestamp = new Date().toLocaleTimeString('ru-RU');
  const prefix = `[${timestamp}] [ERROR] [${category.toUpperCase()}]`;
  const errorMessage = error?.message || error || 'Неизвестная ошибка';
  
  if (context) {
    console.error(`${prefix} ${errorMessage}`, context);
  } else {
    console.error(`${prefix} ${errorMessage}`, error);
  }
};

// Логирование (выводится в терминал Vite)
export const log = (category, message, data = null) => {
  const timestamp = new Date().toLocaleTimeString('ru-RU');
  const prefix = `[${timestamp}] [${category.toUpperCase()}]`;
  
  if (data !== null) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

// Логирование действий пользователя
export const logAction = (action, details = null) => {
  console.log(`[ACTION] ${action}`, details || '');
};

// Логирование состояния
export const logState = (component, stateName, stateValue) => {
  console.log(`[STATE] ${component}: ${stateName}`, stateValue);
};

// Логирование данных
export const logData = (operation, data) => {
  console.log(`[DATA] ${operation}`, data);
};

// Валидация данных с логированием ошибок
export const validateAndLog = (data, schema, context = '') => {
  const result = validate(data, schema);
  
  if (!result.valid) {
    console.error(`[VALIDATION ERROR] ${context}:`, result.errors, data);
  }
  
  return result;
};

// Простая валидация
const validate = (data, schema) => {
  const errors = [];
  
  for (const [key, validator] of Object.entries(schema)) {
    if (validator.required && (data[key] === undefined || data[key] === null)) {
      errors.push(`Поле ${key} обязательно`);
      continue;
    }
    
    if (data[key] !== undefined && data[key] !== null) {
      if (validator.type && typeof data[key] !== validator.type) {
        errors.push(`Поле ${key} должно быть типа ${validator.type}`);
      }
      
      if (validator.min !== undefined && data[key] < validator.min) {
        errors.push(`Поле ${key} должно быть >= ${validator.min}`);
      }
      
      if (validator.max !== undefined && data[key] > validator.max) {
        errors.push(`Поле ${key} должно быть <= ${validator.max}`);
      }
      
      if (validator.custom && !validator.custom(data[key])) {
        errors.push(`Поле ${key} не прошло кастомную валидацию`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Перехват глобальных ошибок
if (typeof window !== 'undefined') {
  // Перехват необработанных ошибок
  window.addEventListener('error', (event) => {
    console.error('[GLOBAL ERROR]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  // Перехват отклоненных промисов
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[PROMISE REJECTION]', {
      reason: event.reason,
      promise: event.promise
    });
  });
  
  console.log('[DEV MODE] Инициализирован - все логи выводятся в терминал компилятора');
}
