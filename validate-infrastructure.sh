#!/bin/bash

# 인프라 개선 사항 검증 스크립트
# 사용법: ./validate-infrastructure.sh

set -e

echo "=========================================="
echo "인프라 개선 사항 검증 시작"
echo "=========================================="

# 1. docker-compose.prod.yml 문법 검증
echo ""
echo "[1/6] docker-compose.prod.yml 문법 검증..."
if docker-compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.prod.yml 문법 정상"
else
    echo "❌ docker-compose.prod.yml 문법 오류"
    docker-compose -f docker-compose.prod.yml config
    exit 1
fi

# 2. 환경 변수 파일 확인
echo ""
echo "[2/6] 환경 변수 파일 확인..."
if [ -f ".env.prod" ]; then
    echo "✅ .env.prod 파일 존재"
    if grep -q "DB_PASSWORD" .env.prod && grep -q "MYSQL_ROOT_PASSWORD" .env.prod; then
        echo "✅ 필수 환경 변수 설정됨"
    else
        echo "⚠️  일부 환경 변수가 누락되었을 수 있습니다"
    fi
else
    echo "⚠️  .env.prod 파일이 없습니다 (기본값 사용)"
fi

# 3. 보안 검증: DB 포트 외부 노출 확인
echo ""
echo "[3/6] 보안 검증: DB 포트 외부 노출 확인..."
if grep -q 'ports:\s*\[\]' docker-compose.prod.yml || ! grep -q '"3306:3306"' docker-compose.prod.yml; then
    echo "✅ DB 포트 외부 노출 차단됨"
else
    echo "❌ DB 포트(3306)가 외부에 노출되어 있습니다"
    exit 1
fi

# 4. 보안 검증: Redis 포트 외부 노출 확인
echo ""
echo "[4/6] 보안 검증: Redis 포트 외부 노출 확인..."
if grep -q 'ports:\s*\[\]' docker-compose.prod.yml || ! grep -q '"6379:6379"' docker-compose.prod.yml; then
    echo "✅ Redis 포트 외부 노출 차단됨"
else
    echo "❌ Redis 포트(6379)가 외부에 노출되어 있습니다"
    exit 1
fi

# 5. Healthcheck 설정 확인
echo ""
echo "[5/6] Healthcheck 설정 확인..."
services_with_healthcheck=0
services_expected=4  # frontend, backend, db, redis, fileserver

if grep -q "healthcheck:" docker-compose.prod.yml; then
    services_with_healthcheck=$(grep -c "healthcheck:" docker-compose.prod.yml || echo "0")
    echo "✅ Healthcheck 설정된 서비스: $services_with_healthcheck개"
    if [ "$services_with_healthcheck" -ge "$services_expected" ]; then
        echo "✅ 모든 주요 서비스에 Healthcheck 설정됨"
    else
        echo "⚠️  일부 서비스에 Healthcheck가 없을 수 있습니다"
    fi
else
    echo "❌ Healthcheck 설정이 없습니다"
    exit 1
fi

# 6. 로그 관리 설정 확인
echo ""
echo "[6/6] 로그 관리 설정 확인..."
if grep -q "logging:" docker-compose.prod.yml; then
    logging_services=$(grep -c "logging:" docker-compose.prod.yml || echo "0")
    echo "✅ 로그 관리 설정된 서비스: $logging_services개"
else
    echo "⚠️  로그 관리 설정이 없습니다"
fi

# 7. Healthcheck 엔드포인트 확인
echo ""
echo "[7/7] Healthcheck 엔드포인트 확인..."
if grep -q 'app.get("/health"' seonshine_backend/server.js; then
    echo "✅ Backend healthcheck 엔드포인트 존재"
else
    echo "❌ Backend healthcheck 엔드포인트가 없습니다"
    exit 1
fi

if grep -q 'app.get("/health"' seonshine_fileserver/server.js; then
    echo "✅ Fileserver healthcheck 엔드포인트 존재"
else
    echo "❌ Fileserver healthcheck 엔드포인트가 없습니다"
    exit 1
fi

if grep -q 'location /health' seonshine_frontend/default.ssl.conf; then
    echo "✅ Frontend healthcheck 엔드포인트 존재"
else
    echo "❌ Frontend healthcheck 엔드포인트가 없습니다"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 모든 검증 완료!"
echo "=========================================="
echo ""
echo "다음 단계:"
echo "1. .env.prod 파일 생성 (필요시)"
echo "2. git add . && git commit -m '인프라 개선 사항 적용'"
echo "3. git push origin main"
echo "4. 서버에서 docker-compose -f docker-compose.prod.yml up -d 실행"

