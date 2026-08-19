import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  base: process.env.VERCEL || (command === 'serve' && !isPreview) ? '/' : '/yandex-pet-day/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
