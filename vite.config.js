import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/yandex-pet-day/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
