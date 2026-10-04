#!/bin/sh
# fonttools 4.66.1 y brotli 1.2.0; conserva peso y tamaño óptico variables.
# Ejecutar desde la raíz del proyecto con pyftsubset disponible en PATH.
set -eu
pyftsubset public/assets/fonts/Inter.woff2 \
  --output-file=public/assets/fonts/Inter-latino.woff2 \
  --flavor=woff2 \
  --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212'
