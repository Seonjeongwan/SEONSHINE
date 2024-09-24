#!/bin/sh

# frontend 컨테이너 ID 추출
FRONTEND_CONTAINER=$(docker ps -qf "name=frontend")

# 컨테이너가 존재하는지 확인
if [ -z "$FRONTEND_CONTAINER" ]; then
  echo "Error: frontend 컨테이너가 실행 중이지 않음."
  exit 1
fi

# Nginx 설정 파일이 존재하는지 확인
if [ -f /etc/nginx/conf.d/default.ssl.conf ]; then
    echo "SSL 설정 파일이 존재함. Nginx 설정을 업데이트하고 재시작합니다."

    # 업데이트된 설정 파일을 복사
    docker exec "$FRONTEND_CONTAINER" cp /etc/nginx/conf.d/default.ssl.conf /etc/nginx/conf.d/default.conf

    # Nginx를 다시 로드
    docker exec "$FRONTEND_CONTAINER" nginx -s reload

    # Nginx 다시 로드 성공 여부 확인
    if [ $? -eq 0 ]; then
      echo "Nginx 설정이 성공적으로 다시 로드되었습니다."
    else
      echo "Nginx 설정 다시 로드 실패."
    fi
else
    echo "SSL 설정 파일을 찾을 수 없습니다. 설정 파일을 확인해주세요."
fi

# mount 확인 (이 부분이 필요한 작업인지 재검토)
# mount | grep /etc/nginx/conf.d/default.conf