#!/usr/bin/env bash
# LabUNAM
# Scripts
# deploy.sh (instala, construye y activa una versión del portal en el servidor)
# Raúl Salinas <raul.teo.salinas@cic.unam.mx>

# Uso en el servidor: bash scripts/deploy.sh <commit> [rama]
# GitHub Actions lo envía por SSH con `bash -s -- <commit> < scripts/deploy.sh`.
# La rama es master si se omite; otra rama sirve para probar un cambio antes de mezclarlo.
# Todo vive en main: bash lee la función completa antes de ejecutarla, así ningún
# comando que lea la entrada estándar consume el resto del script.
#
# Estructura en el servidor (base: LABUNAM_DESPLIEGUE, /srv/labunam-next por defecto):
#   repo.git/      clon sin árbol de trabajo de GitHub
#   releases/      una carpeta por versión construida; se conservan las tres últimas
#   current        enlace a la versión activa; PM2 trabaja sobre él
#   shared/.env    variables del servidor, enlazadas en cada versión
#   shared/fotos/  si existe, se enlaza como public/fotos

main() {
  set -euo pipefail
  local commit="${1:?Falta el commit a desplegar}"
  local branch="${2:-master}"
  local base="${LABUNAM_DESPLIEGUE:-/srv/labunam-next}"
  local keep=3
  cd "$base"

  # Un despliegue a la vez: si llega otra mezcla, espera a que termine la anterior.
  exec 9>"$base/deploy.lock"
  flock 9

  # Sólo se despliegan commits publicados en la rama de GitHub.
  git --git-dir=repo.git fetch --quiet origin "+refs/heads/$branch:refs/heads/$branch"
  if ! git --git-dir=repo.git merge-base --is-ancestor "$commit" "$branch"; then
    echo "El commit $commit no está en $branch." >&2
    return 1
  fi

  # Cada versión se construye en su carpeta mientras la anterior sigue atendiendo.
  local release
  release="$base/releases/$(date +%Y%m%d%H%M%S)-${commit:0:7}"
  mkdir -p "$release"
  git --git-dir=repo.git archive "$commit" | tar -x -C "$release"
  ln -s "$base/shared/.env" "$release/.env"
  if [[ -d "$base/shared/fotos" ]]; then
    ln -s "$base/shared/fotos" "$release/public/fotos"
  fi

  cd "$release"
  local node_major
  node_major="$(cut -d. -f1 .nvmrc)"
  if [[ "$(node --version)" != "v$node_major."* ]]; then
    echo "Se requiere Node $node_major (.nvmrc) y el servidor tiene $(node --version)." >&2
    return 1
  fi
  # El servidor es compartido: la compilación cede la CPU a los demás sitios.
  echo "Construyendo ${commit:0:7} en $release"
  nice -n 10 npm ci --no-audit --no-fund
  nice -n 10 npm run build

  # El cambio de enlace es atómico: `current` siempre apunta a una versión completa.
  local previous=""
  if [[ -L "$base/current" ]]; then
    previous="$(readlink "$base/current")"
  fi
  activate "$base" "$release"

  if ! healthy; then
    echo "El portal no respondió tras activar ${commit:0:7}." >&2
    if [[ -n "$previous" ]]; then
      echo "Se restaura $previous." >&2
      activate "$base" "$previous"
    fi
    return 1
  fi
  pm2 save

  # Las versiones antiguas se borran al final para conservar la anterior durante el cambio.
  find "$base/releases" -mindepth 1 -maxdepth 1 -type d | sort | head -n "-$keep" |
    xargs -r rm -rf
  echo "Desplegado ${commit:0:7}."
}

# Apunta `current` a una versión y reinicia el proceso de PM2 sobre ella.
activate() {
  ln -sfn "$2" "$1/current.tmp"
  mv -T "$1/current.tmp" "$1/current"
  pm2 startOrReload "$1/current/ecosystem.config.cjs" --update-env
}

# La portada consulta MySQL, así que responder 200 confirma también la conexión.
healthy() {
  curl -fsS -o /dev/null --retry 10 --retry-delay 3 --retry-all-errors \
    http://127.0.0.1:3000/
}

main "$@" </dev/null
