import adapter from '@sveltejs/adapter-netlify';
import dsv from '@rollup/plugin-dsv';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // include netlify adapter so routing is handled appropriately
        adapter: adapter(),
        vite: {
            plugins: [dsv()]
        }
    },

    // enable SCSS
    preprocess: preprocess(),

};

export default config;