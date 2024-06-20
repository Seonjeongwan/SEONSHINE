#!/bin/sh
# Move the SSL configuration into place and reload NGINX
mv /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
nginx -s reload
