#!/usr/bin/env bash
# LabUNAM
# Scripts
# server-setup.sh (prepara una vez el servidor: Node, PM2, usuario de despliegue y Apache)
# Raúl Salinas <raul.teo.salinas@cic.unam.mx>

# Uso en el servidor, con la llave pública que usará GitHub Actions:
#   sudo bash server-setup.sh <llave.pub> [nombre del sitio]
# El nombre del sitio es el dominio o la IP con que Apache lo atiende (132.248.31.102 si
# se omite). Se puede repetir: cada paso revisa si ya está hecho. No modifica otros sitios.
#
# Los despliegues usan la misma cuenta que ejecuta este script con sudo. En el servidor de
# desarrollo esa cuenta también administra otros sitios: se aceptó que la llave de GitHub
# tenga ese alcance en lugar de crear un usuario exclusivo para el portal.
set -euo pipefail

public_key="${1:?Falta la llave pública de despliegue}"
server_name="${2:-132.248.31.102}"
user="${SUDO_USER:?Ejecutar con sudo desde la cuenta que hará los despliegues}"
base="/srv/labunam-next"
pm2_version="7.1.0"

if [[ $EUID -ne 0 ]]; then
  echo "Ejecutar con sudo." >&2
  exit 1
fi

echo "== Node 24 desde NodeSource"
# Ubuntu sólo trae Node 18; NodeSource publica la rama 24 firmada.
if [[ "$(node --version 2>/dev/null)" != v24.* ]]; then
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |
    gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" \
    >/etc/apt/sources.list.d/nodesource.list
  apt-get update
  apt-get install -y nodejs
fi
node --version

echo "== PM2 $pm2_version"
if [[ "$(pm2 --version 2>/dev/null)" != "$pm2_version" ]]; then
  npm install -g "pm2@$pm2_version"
fi

echo "== Carpetas de $user"
install -d -o "$user" -g "$user" -m 0755 "$base" "$base/releases" "$base/shared"
if [[ ! -e "$base/shared/.env" ]]; then
  install -o "$user" -g "$user" -m 0600 /dev/null "$base/shared/.env"
fi
if [[ ! -d "$base/repo.git" ]]; then
  sudo -u "$user" git clone --quiet --bare https://github.com/cicunam/labunam-next.git "$base/repo.git"
fi

echo "== Llave de GitHub Actions"
# restrict quita reenvío de puertos, agente y terminal; sólo permite ejecutar comandos.
home="$(getent passwd "$user" | cut -d: -f6)"
install -d -o "$user" -g "$user" -m 0700 "$home/.ssh"
touch "$home/.ssh/authorized_keys"
key="restrict $(cat "$public_key")"
if ! grep -qxF "$key" "$home/.ssh/authorized_keys"; then
  echo "$key" >>"$home/.ssh/authorized_keys"
fi
chown "$user:$user" "$home/.ssh/authorized_keys"
chmod 0600 "$home/.ssh/authorized_keys"

echo "== PM2 al arrancar el servidor"
pm2 startup systemd -u "$user" --hp "$home" >/dev/null
systemctl start "pm2-$user"
sudo -u "$user" -H pm2 install pm2-logrotate >/dev/null

echo "== Apache"
a2enmod -q proxy proxy_http headers
# Apache elige el sitio por el nombre pedido; éste sólo atiende a $server_name.
# flushpackets envía cada fragmento en cuanto llega para no romper el streaming de Next.
cat >/etc/apache2/sites-available/labunam-next.conf <<EOF
<VirtualHost *:80>
    ServerName $server_name
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/ flushpackets=on
    ProxyPassReverse / http://127.0.0.1:3000/
    RequestHeader set X-Forwarded-Proto "http"
    ErrorLog \${APACHE_LOG_DIR}/labunam-next-error.log
    CustomLog \${APACHE_LOG_DIR}/labunam-next-access.log combined
</VirtualHost>
EOF
a2ensite -q labunam-next
apachectl configtest
systemctl reload apache2

echo
echo "Listo. Falta escribir las variables en $base/shared/.env:"
echo "  nano $base/shared/.env"
