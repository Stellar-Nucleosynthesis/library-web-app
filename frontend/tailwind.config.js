/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                parchment: {
                    50: '#fdfaf4',
                    100: '#f9f3e3',
                    200: '#f2e6c8',
                    300: '#e8d5a3',
                    400: '#dabe78',
                    500: '#c9a84c',
                    600: '#b8923a',
                    700: '#9a7730',
                    800: '#7d602a',
                    900: '#664f25',
                },
                leather: {
                    50: '#f7f0e8',
                    100: '#ecddd0',
                    200: '#d9bba0',
                    300: '#c49570',
                    400: '#b07247',
                    500: '#9a5e30',
                    600: '#804e28',
                    700: '#673f22',
                    800: '#4e301c',
                    900: '#3d2518',
                },
                ink: {
                    50: '#f4ede8',
                    100: '#e6d5cc',
                    200: '#c9a898',
                    300: '#a87a65',
                    400: '#8a5840',
                    500: '#6b3c26',
                    600: '#592f1c',
                    700: '#452415',
                    800: '#321a0f',
                    900: '#221009',
                },
                // Flat key — avoids clobbering Tailwind's built-in amber scale
                'amber-book': '#c68642',
                cream: '#fffdf7',
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['"Lora"', 'Georgia', 'serif'],
                sans: ['"Source Sans 3"', 'sans-serif'],
            },
            boxShadow: {
                'book': '4px 4px 10px rgba(61, 37, 24, 0.2), -1px 0 3px rgba(61, 37, 24, 0.1)',
                'book-hover': '6px 6px 16px rgba(61, 37, 24, 0.3), -2px 0 6px rgba(61, 37, 24, 0.15)',
                'card': '0 2px 12px rgba(61, 37, 24, 0.12)',
                'card-hover': '0 8px 24px rgba(61, 37, 24, 0.2)',
                'inset-paper': 'inset 0 2px 8px rgba(61, 37, 24, 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'},
                },
                slideUp: {
                    '0%': {opacity: '0', transform: 'translateY(16px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'},
                },
            },
        },
    },
    plugins: [],
};