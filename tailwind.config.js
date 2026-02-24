/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' }
                },
                scaleIn: {
                    'from': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
                    'to': { opacity: '1', transform: 'scale(1) translateY(0)' }
                },
                fadeInUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out forwards',
                'scale-in': 'scaleIn 0.2s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.4s ease-out forwards'
            }
        },
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: ["sunset", "winter", "forest", "dracula", "lofi"],
    },
}
