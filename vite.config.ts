import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"./",
  build: {
    outDir: 'dist-react',
    rollupOptions: {
      external: ['diskusage']
    }
  },
  server: {
      port: 5173,
      strictPort: true,
  },
});
