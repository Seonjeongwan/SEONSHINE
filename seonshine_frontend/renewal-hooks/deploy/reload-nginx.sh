#!/bin/sh
if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    # mount | grep /etc/nginx/conf.d/default.conf
    cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
    docker-compose -f /path/to/docker-compose.prod.yml exec frontend nginx -s reload
fi