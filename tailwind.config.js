/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'simplyit-chatbot-',
  content: [
    './index.html',
    './**/*.html',
    './**/*.php',
    './**/*.js',
    '!./node_modules/**',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
