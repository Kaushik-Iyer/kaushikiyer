import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        // Scan files directly inside src/app/ (like layout.tsx, page.tsx)
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        // Explicitly scan inside src/app/components/
        './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
        // Add other paths if you have them, e.g. './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                background: 'var(--color-background)',
                text: 'var(--color-text)',
            },
        },
    },
    plugins: [],
}
export default config;