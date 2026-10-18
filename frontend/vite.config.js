import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host:true, //make sure to have this line for react prject
        port: 3000,
        proxy: {
            '/socket.io': {
                target: 'http://localhost:5000',
                ws: true
            }
        }
    }
})
