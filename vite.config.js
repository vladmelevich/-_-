import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Автоматически открывать браузер
    host: true // Доступ с других устройств
  },
  // Настройка для вывода логов в терминал
  build: {
    minify: false,
    sourcemap: true
  }
});
