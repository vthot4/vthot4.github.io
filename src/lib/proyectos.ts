import proyectosJson from '../data/projects.json';
import sitioJson from '../data/sitio.json';

export const AREAS = {
  naturaleza: 'Naturaleza',
  ciencia: 'Ciencia',
  datos: 'Datos',
  nube: 'Cloud',
  otros: 'Otros',
} as const;

export const ESTADOS = ['activo', 'en construcción', 'archivado'] as const;

export type Area = keyof typeof AREAS;

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  area: Area;
  tags: string[];
  url: string | null;
  repo: string | null;
  estado: (typeof ESTADOS)[number];
}

// Falla el build si projects.json tiene un valor inválido.
function validar(p: Proyecto, i: number): Proyecto {
  const donde = `projects.json[${i}] (${p.id ?? '?'})`;
  if (!p.id || !p.titulo || !p.descripcion) throw new Error(`${donde}: faltan id, titulo o descripcion`);
  if (!(p.area in AREAS)) throw new Error(`${donde}: area "${p.area}" no válida (${Object.keys(AREAS).join(', ')})`);
  if (!ESTADOS.includes(p.estado)) throw new Error(`${donde}: estado "${p.estado}" no válido (${ESTADOS.join(', ')})`);
  if (!p.url && !p.repo) throw new Error(`${donde}: necesita url o repo`);
  return p;
}

export const proyectos: Proyecto[] = (proyectosJson as Proyecto[]).map(validar);
export const sitio = sitioJson;

export const areasEnUso: Area[] = (Object.keys(AREAS) as Area[]).filter((a) =>
  proyectos.some((p) => p.area === a),
);
