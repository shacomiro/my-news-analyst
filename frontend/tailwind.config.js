/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'primary-500': '#148efc',
                'primary-100': '#E6F3FE',
                'gray-900': '#1A1A1A',
                'gray-800': '#333333',
                'gray-600': '#666666',
                'gray-400': '#B0B0B0',
                'gray-200': '#E0E0E0',
                'gray-100': '#F8F8F8',
                'red-500': '#EF4444',
                'green-500': '#22C55E',
            },
        },
    },
    plugins: [],
};
