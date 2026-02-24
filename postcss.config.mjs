/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {}, // Autoprefixer is implicitly handled by Next.js if installed, but explicit is fine.
    },
};
export default config;
