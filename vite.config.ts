import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    hmr: { port: Number(process.env.PORT) },
  },
  preview:{
    port: Number(process.env.PORT),
  },
})
