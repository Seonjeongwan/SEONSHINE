#!/bin/sh

# frontend 컨테이너 ID 추출
FRONTEND_CONTAINER=$(docker ps -qf "name=frontend")

# 컨테이너가 존재하는지 확인
if [ -z "$FRONTEND_CONTAINER" ]; then
  echo "Error: frontend 컨테이너가 실행 중이지 않음."
  exit 1
fi

# 갱신된 인증서를 반영하기 위해 nginx reload만 수행
# (주의: 예전에는 여기서 default.ssl.conf를 default.conf로 cp 했는데,
#  그 동작이 80포트 설정(default.conf)을 덮어써 ACME 갱신을 망가뜨렸으므로 제거함)
if docker exec "$FRONTEND_CONTAINER" nginx -s reload; then
  echo "Nginx 설정이 성공적으로 다시 로드되었습니다."
else
  echo "Nginx 설정 다시 로드 실패."
  exit 1
fi
