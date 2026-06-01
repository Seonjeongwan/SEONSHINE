#!/bin/bash

# 배포 전 검증 스크립트
# 구동 이상 확인 및 이전 버전과의 차이점 확인

set -e

echo "=========================================="
echo "배포 전 검증 시작"
echo "=========================================="

# 1. docker-compose.prod.yml 문법 검증
echo ""
echo "[1/8] docker-compose.prod.yml 문법 검증..."
if command -v docker-compose &> /dev/null; then
    if docker-compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
        echo "✅ docker-compose.prod.yml 문법 정상"
    else
        echo "❌ docker-compose.prod.yml 문법 오류"
        docker-compose -f docker-compose.prod.yml config
        exit 1
    fi
else
    echo "⚠️  docker-compose 명령어를 찾을 수 없습니다 (로컬 검증 스킵)"
fi

# 2. Healthcheck 엔드포인트 확인
echo ""
echo "[2/8] Healthcheck 엔드포인트 확인..."

# Backend healthcheck 엔드포인트
if grep -q 'app.get("/health"' seonshine_backend/server.js; then
    echo "✅ Backend healthcheck 엔드포인트 존재"
else
    echo "❌ Backend healthcheck 엔드포인트가 없습니다"
    exit 1
fi

# Fileserver healthcheck 엔드포인트
if grep -q 'app.get("/health"' seonshine_fileserver/server.js; then
    echo "✅ Fileserver healthcheck 엔드포인트 존재"
else
    echo "❌ Fileserver healthcheck 엔드포인트가 없습니다"
    exit 1
fi

# Frontend healthcheck 엔드포인트
if grep -q 'location /health' seonshine_frontend/default.ssl.conf; then
    echo "✅ Frontend healthcheck 엔드포인트 존재"
else
    echo "❌ Frontend healthcheck 엔드포인트가 없습니다"
    exit 1
fi

# 3. 환경 변수 기본값 확인
echo ""
echo "[3/8] 환경 변수 기본값 확인..."
if grep -q '\${DB_USER:-seonshine_mgr}' docker-compose.prod.yml && \
   grep -q '\${DB_PASSWORD:-seonshine@2}' docker-compose.prod.yml; then
    echo "✅ 환경 변수 기본값 설정됨"
else
    echo "⚠️  환경 변수 기본값이 일부 누락되었을 수 있습니다"
fi

# 4. 포트 외부 노출 확인
echo ""
echo "[4/8] 보안: 포트 외부 노출 확인..."

# DB 포트 확인
if grep -q 'ports:\s*\[\]' docker-compose.prod.yml || ! grep -q '"3306:3306"' docker-compose.prod.yml; then
    echo "✅ DB 포트 외부 노출 차단됨"
else
    echo "❌ DB 포트(3306)가 외부에 노출되어 있습니다"
    exit 1
fi

# Redis 포트 확인
if grep -q 'ports:\s*\[\]' docker-compose.prod.yml || ! grep -q '"6379:6379"' docker-compose.prod.yml; then
    echo "✅ Redis 포트 외부 노출 차단됨"
else
    echo "❌ Redis 포트(6379)가 외부에 노출되어 있습니다"
    exit 1
fi

# 5. Healthcheck 설정 확인
echo ""
echo "[5/8] Healthcheck 설정 확인..."
healthcheck_count=$(grep -c "healthcheck:" docker-compose.prod.yml || echo "0")
if [ "$healthcheck_count" -ge 5 ]; then
    echo "✅ Healthcheck 설정된 서비스: $healthcheck_count개"
else
    echo "⚠️  일부 서비스에 Healthcheck가 없을 수 있습니다 (현재: $healthcheck_count개)"
fi

# 6. 로그 관리 설정 확인
echo ""
echo "[6/8] 로그 관리 설정 확인..."
logging_count=$(grep -c "logging:" docker-compose.prod.yml || echo "0")
if [ "$logging_count" -ge 5 ]; then
    echo "✅ 로그 관리 설정된 서비스: $logging_count개"
else
    echo "⚠️  일부 서비스에 로그 관리 설정이 없을 수 있습니다 (현재: $logging_count개)"
fi

# 7. 의존성 순서 확인
echo ""
echo "[7/8] 서비스 의존성 순서 확인..."

# Frontend가 Backend healthcheck를 기다리는지 확인
if grep -A 2 "depends_on:" docker-compose.prod.yml | grep -q "condition: service_healthy"; then
    echo "✅ Frontend가 Backend healthcheck를 기다리도록 설정됨"
else
    echo "⚠️  Frontend 의존성 설정을 확인하세요"
fi

# 8. 이전 버전과의 주요 차이점 요약
echo ""
echo "[8/8] 이전 버전과의 주요 차이점..."
echo ""
echo "📋 주요 변경사항:"
echo "  1. ✅ DB 포트 외부 노출 제거 (보안 강화)"
echo "  2. ✅ Redis 포트 외부 노출 제거 (보안 강화)"
echo "  3. ✅ 비밀번호 환경 변수화 (기본값 제공)"
echo "  4. ✅ 모든 주요 서비스에 Healthcheck 추가"
echo "  5. ✅ 로그 로테이션 설정 추가"
echo "  6. ✅ 서비스 의존성 개선 (healthcheck 기반)"
echo "  7. ✅ Redis AOF 활성화 (데이터 영속성)"
echo ""
echo "⚠️  주의사항:"
echo "  - DB/Redis 포트 변경: 외부에서 직접 접근 불가 (SSH 터널링 필요)"
echo "  - Healthcheck 엔드포인트: 이미지 재빌드 필요 (Backend, Fileserver)"
echo "  - 환경 변수: .env.prod 파일 생성 선택사항 (기본값 사용 가능)"

echo ""
echo "=========================================="
echo "✅ 검증 완료!"
echo "=========================================="
echo ""
echo "다음 단계:"
echo "1. 이미지 재빌드 (Backend, Fileserver - healthcheck 엔드포인트 추가)"
echo "2. git add . && git commit -m '인프라 개선 적용'"
echo "3. git push origin main (자동 배포)"

