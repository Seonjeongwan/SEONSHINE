#!/bin/sh
if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
    nginx -s reload
fi