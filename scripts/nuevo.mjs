#!/usr/bin/env node
// Crea un proyecto nuevo en ~/Proyectos, su repo en GitHub y su entrada en el portfolio.
//
//   npm run nuevo -- mi-proyecto --titulo "Mi proyecto" --descripcion "Qué es" --area ciencia --tags Astro,TypeScript
//
// Opciones:
//   --titulo       Título visible (por defecto, el nombre de la carpeta)
//   --descripcion  Obligatoria. Una o dos frases.
//   --area         naturaleza | ciencia | datos | nube | otros   (obligatoria)
//   --tags         Lista separada por comas
//   --url          URL pública (por defecto https://vthot4.github.io/<nombre>/)
//   --sin-url      El proyecto no tiene web (solo código)
//   --privado      Repo privado en GitHub (no se enlaza el código)
//   --sin-github   Solo crea carpeta + git init + entrada; no toca GitHub
//   --estado       activo | "en construcción" | archivado  (por defecto: en construcción)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const proyectos = resolve(raiz, '..');
const jsonPath = join(raiz, 'src/data/projects.json');
const AREAS = ['naturaleza', 'ciencia', 'datos', 'nube', 'otros'];
const ESTADOS = ['activo', 'en construcción', 'archivado'];

const { values: v, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    titulo: { type: 'string' },
    descripcion: { type: 'string' },
    area: { type: 'string' },
    tags: { type: 'string', default: '' },
    url: { type: 'string' },
    'sin-url': { type: 'boolean', default: false },
    privado: { type: 'boolean', default: false },
    'sin-github': { type: 'boolean', default: false },
    estado: { type: 'string', default: 'en construcción' },
  },
});

const fallo = (m) => { console.error(`✗ ${m}`); process.exit(1); };
const [nombre] = positionals;
if (!nombre || !/^[\w.-]+$/.test(nombre)) fallo('Falta el nombre (letras, números, - _ .)');
if (!v.descripcion) fallo('Falta --descripcion');
if (!AREAS.includes(v.area)) fallo(`--area debe ser: ${AREAS.join(' | ')}`);
if (!ESTADOS.includes(v.estado)) fallo(`--estado debe ser: ${ESTADOS.join(' | ')}`);

if (v['sin-url'] && (v['sin-github'] || v.privado)) fallo('Sin URL ni repo público la tarjeta no tendría enlace');
const lista = JSON.parse(readFileSync(jsonPath, 'utf8'));
if (lista.some((p) => p.id === nombre)) fallo(`"${nombre}" ya está en projects.json`);

const carpeta = join(proyectos, nombre);
const run = (cmd, args, cwd = carpeta) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

if (existsSync(carpeta)) {
  console.log(`· La carpeta ${carpeta} ya existe; se reutiliza.`);
} else {
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(join(carpeta, 'README.md'), `# ${v.titulo ?? nombre}\n\n${v.descripcion}\n`);
}
if (!existsSync(join(carpeta, '.git'))) {
  run('git', ['init', '-q', '-b', 'main']);
  run('git', ['add', '-A']);
  run('git', ['commit', '-q', '-m', 'Commit inicial']);
}

let repoUrl = null;
if (!v['sin-github']) {
  const visibilidad = v.privado ? '--private' : '--public';
  run('gh', ['repo', 'create', `vthot4/${nombre}`, visibilidad, '--source', '.', '--remote', 'origin', '--push', '--description', v.descripcion]);
  if (!v.privado) repoUrl = `https://github.com/vthot4/${nombre}`;
}

lista.push({
  id: nombre,
  titulo: v.titulo ?? nombre,
  descripcion: v.descripcion,
  area: v.area,
  tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean),
  url: v['sin-url'] ? null : (v.url ?? `https://vthot4.github.io/${nombre}/`),
  repo: repoUrl,
  estado: v.estado,
});
// Arrays de valores simples (tags) en una línea, como en el JSON escrito a mano.
const json = JSON.stringify(lista, null, 2).replace(/\[\n\s+([^[\]{}]*?)\n\s+\]/g, (_, items) => `[${items.replace(/,\n\s+/g, ', ')}]`);
writeFileSync(jsonPath, json + '\n');

console.log(`\n✓ ${nombre} creado y añadido a src/data/projects.json`);
console.log('  Para publicarlo en el portfolio: git add -A && git commit -m "Añade ' + nombre + '" && git push');
