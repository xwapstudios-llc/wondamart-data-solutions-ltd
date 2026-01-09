import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import {defineConfig} from "vite"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
// @ts-ignore
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo/*.png'],
            manifest: {
                name: 'Wondamart Data Solutions',
                short_name: 'Wondamart',
                description: 'Digital services platform for data bundles and more',
                theme_color: '#071026',
                background_color: '#071026',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: 'icon/pwa-192-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon/pwa-512-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@common": path.resolve(__dirname, "./../common"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router-dom'],
                    'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
                    'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
                    'chart-vendor': ['recharts'],
                    'firebase': ['firebase/auth', 'firebase/firestore'],
                    'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],

                    // App chunks
                    'auth': ['src/pages/LoginPage', 'src/pages/SignupPage', "src/pages/auth/ForgotPasswordPage", "src/pages/auth/AuthAction", "src/pages/auth/OTPPage"],
                    'dashboard': ['src/pages/app/dashboard'],
                    'purchase': ['src/pages/app/purchase'],
                    'history': ['src/pages/app/history'],
                    'user': ['src/pages/app/user'],
                    'deposit': ['src/pages/app/deposit'],
                    'commissions': ['src/pages/app/commissions'],
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
})