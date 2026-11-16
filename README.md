# Portfolio

Índice de mis proyectos personales. Astro, sin backend, publicado en GitHub Pages.
Cada proyecto sigue siendo un repo independiente con su propio despliegue; aquí solo hay tarjetas con enlaces.

## En local

```sh
npm install
npm run dev       # http://localhost:4321/
npm run build
npm run check
```

## Añadir un proyecto

Con el script (crea carpeta, `git init`, repo en GitHub y la entrada en el JSON):

```sh
npm run nuevo -- mi-proyecto \
  --titulo "Mi proyecto" \
  --descripcion "Qué es, en una o dos frases." \
  --area ciencia \
  --tags Astro,TypeScript
```

Flags: `--url`, `--sin-url`, `--privado`, `--sin-github`, `--estado`. Cabecera de `scripts/nuevo.mjs`.

O a mano: añade un objeto a `src/data/projects.json`. El build falla si `area` o `estado` no son válidos.

| Campo | Valores |
|---|---|
| `area` | `naturaleza`, `ciencia`, `datos`, `nube`, `otros` (en `src/lib/proyectos.ts`) |
| `estado` | `activo`, `en construcción`, `archivado` |
| `url` / `repo` | al menos uno. `repo: null` para repos privados |

Después `git push`: el workflow `.github/workflows/deploy.yml` publica el sitio.

## Estado de todos los repos

```sh
npm run estado            # rama, cambios sin commitear, commits pendientes de push/pull
npm run estado -- pull    # además hace git pull --ff-only en cada uno
```

## Textos del sitio

Nombre, titular, intereses y caja de herramientas: `src/data/sitio.json`.
Colores y tipografía: variables CSS al principio de `src/styles/global.css`.

## Publicar por primera vez

1. Repo en GitHub llamado `vthot4.github.io` (público), con este contenido en `main`.
2. Settings → Pages → Source: **GitHub Actions**.
