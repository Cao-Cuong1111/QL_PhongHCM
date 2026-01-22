/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Define your offline fonts here
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
