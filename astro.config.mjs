import { defineConfig } from 'astro/config';

// Repo `vthot4.github.io` => se publica en la raíz de https://vthot4.github.io/
// (los demás proyectos cuelgan de ella: /<repo>/).
export default defineConfig({
  site: 'https://vthot4.github.io',
  trailingSlash: 'always',
});
