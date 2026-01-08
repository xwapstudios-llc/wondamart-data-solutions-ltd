import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import {defineConfig} from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
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
                    'auth': ['src/pages/LoginPage', 'src/pages/SignupPage', "src/pages/auth/ForgotPasswordPage", "src/pages/auth/AuthAction", "src/pages/auth/OTPPage", "src/pages/auth/ResetPasswordPage"],
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