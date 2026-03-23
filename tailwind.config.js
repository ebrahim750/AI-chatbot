/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'simplyit-chatbot-',
  corePlugins: {
    preflight: false,
  },
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
