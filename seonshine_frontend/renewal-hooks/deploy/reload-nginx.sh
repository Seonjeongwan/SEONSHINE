#!/bin/sh

if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    # 업데이트된 설정 파일을 복사
    docker exec $(docker ps -qf "name=frontend") cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf
    # Nginx를 다시 로드
    # docker exec $(docker ps -qf "name=frontend") nginx -s reload
fi
    # mount | grep /etc/nginx/conf.d/default.conf