#!/usr/bin/env bash
# Resumen del estado git de todos los proyectos de ~/Proyectos.
#   npm run estado            -> estado
#   npm run estado -- pull    -> además hace `git pull --ff-only` en cada uno
set -u
raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
accion="${1:-}"
printf '%-28s %-10s %-9s %s\n' PROYECTO RAMA CAMBIOS REMOTO
for d in "$raiz"/*/; do
  [ -d "$d/.git" ] || continue
  n="$(basename "$d")"
  rama="$(git -C "$d" branch --show-current)"
  sucios="$(git -C "$d" status --porcelain | wc -l)"
  if [ -z "$(git -C "$d" remote)" ]; then
    remoto="sin remoto"
  else
    [ "$accion" = pull ] && git -C "$d" pull --ff-only -q 2>/dev/null
    git -C "$d" fetch -q 2>/dev/null
    if up="$(git -C "$d" rev-list --left-right --count 'HEAD...@{u}' 2>/dev/null)"; then
      read -r adel atras <<<"$up"
      remoto="↑$adel ↓$atras"
    else
      remoto="sin upstream"
    fi
  fi
  printf '%-28s %-10s %-9s %s\n' "$n" "$rama" "$sucios" "$remoto"
done
