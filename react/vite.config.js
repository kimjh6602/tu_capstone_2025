import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/static/',  // ✅ 정적 파일을 Django의 STATIC_URL과 맞춤
});
