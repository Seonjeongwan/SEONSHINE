#!/bin/sh
if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
    docker exec $(docker ps -qf "name=frontend") nginx -s reload
fi

    # mount | grep /etc/nginx/conf.d/default.conf