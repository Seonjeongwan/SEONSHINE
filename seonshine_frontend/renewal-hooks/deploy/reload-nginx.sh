#!/bin/sh
if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    mount | grep /etc/nginx/conf.d/default.conf
    cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
    nginx -s reload
fi