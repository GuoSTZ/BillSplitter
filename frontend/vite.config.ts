import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/g-bill/',  // 添加这行，设置基础路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
