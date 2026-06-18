import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    '.nuxt/**',
    '.output/**',
    // Referenced in nuxt.config.ts css array
    'assets/css/main.css',
  ],
  ignoreExportsUsedInFile: true,
  // Nuxt 4 Knip plugin expects app/ dir; this project uses root srcDir
  entry: [
    'app.vue',
    'app.config.ts',
    'pages/**/*.{vue,jsx,tsx}',
    'layouts/**/*.{vue,jsx,tsx}',
    'middleware/**/*.ts',
    'plugins/**/*.ts',
    'components/**/*.{vue,jsx,tsx}',
    'composables/**/*.ts',
    'utils/**/*.ts',
    'features/**/*.{vue,ts}',
    'store/**/*.ts',
    'models/**/*.ts',
    'mocks/**/*.ts',
  ],
  ignoreDependencies: [
    // Nuxt module runtime deps (not imported directly in source)
    '@takumi-rs/core',
    'tailwindcss',
    'postcss',
    'autoprefixer',
    'ofetch',
    '@vueuse/core',
    '@tanstack/vue-table',
  ],
};

export default config;
