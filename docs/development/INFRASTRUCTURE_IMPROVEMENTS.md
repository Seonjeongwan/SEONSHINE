# 인프라 및 Docker 개선점 분석

## ✅ 적용 완료된 개선 사항

### 1. 보안 개선

#### ✅ 비밀번호 환경 변수화

- **적용 완료**: `docker-compose.prod.yml`에서 환경 변수 사용
- **변경 사항**: `DB_PASSWORD`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`를 `${DB_PASSWORD:-기본값}` 형식으로 변경
- **다음 단계**: 서버에 `.env.prod` 파일 생성 (선택사항)

#### ✅ DB 포트 외부 노출 차단

- **적용 완료**: DB 포트(3306) 외부 노출 제거
- **변경 사항**: `ports: []`로 설정하여 내부 Docker 네트워크만 사용
- **효과**: 외부에서 DB 직접 접근 불가능

#### ✅ Redis 포트 외부 노출 차단

- **적용 완료**: Redis 포트(6379) 외부 노출 제거
- **변경 사항**: `ports: []`로 설정하여 내부 Docker 네트워크만 사용
- **추가**: Redis AOF(appendonly) 활성화로 데이터 영속성 강화

### 2. 모니터링 및 안정성 개선

#### ✅ Healthcheck 추가

- **적용 완료**: 모든 주요 서비스에 healthcheck 추가
  - **Frontend**: `/health` 엔드포인트 (nginx)
  - **Backend**: `/health` 엔드포인트 (Express)
  - **Fileserver**: `/health` 엔드포인트 (Express)
  - **DB**: `mysqladmin ping`
  - **Redis**: `redis-cli ping`

#### ✅ 로그 관리 전략

- **적용 완료**: 모든 서비스에 로그 로테이션 설정
- **설정**: 최대 10MB, 3개 파일 유지
- **효과**: 디스크 공간 절약 및 로그 관리 자동화

#### ✅ 서비스 의존성 개선

- **적용 완료**: Frontend가 Backend healthcheck를 기다리도록 설정
- **변경 사항**: `depends_on`에 `condition: service_healthy` 추가

### 3. 코드 개선

#### ✅ Healthcheck 엔드포인트 추가

- **Backend**: `seonshine_backend/server.js`에 `/health` 엔드포인트 추가
- **Fileserver**: `seonshine_fileserver/server.js`에 `/health` 엔드포인트 추가
- **Frontend**: `seonshine_frontend/default.ssl.conf`에 `/health` location 추가

### 4. 검증 도구

#### ✅ 검증 스크립트 생성

- **파일**: `validate-infrastructure.sh`
- **기능**:
  - docker-compose 문법 검증
  - 보안 설정 확인
  - Healthcheck 설정 확인
  - 로그 관리 설정 확인
  - Healthcheck 엔드포인트 확인

---

## 📋 적용된 개선 사항 요약

| 개선 항목                 | 상태    | 설명                          |
| ------------------------- | ------- | ----------------------------- |
| 비밀번호 환경 변수화      | ✅ 완료 | 환경 변수 사용 (기본값 제공)  |
| DB 포트 외부 노출 차단    | ✅ 완료 | `ports: []` 설정              |
| Redis 포트 외부 노출 차단 | ✅ 완료 | `ports: []` 설정              |
| Redis AOF 활성화          | ✅ 완료 | `--appendonly yes` 추가       |
| Healthcheck 추가          | ✅ 완료 | 모든 주요 서비스에 적용       |
| 로그 관리                 | ✅ 완료 | 로그 로테이션 설정            |
| 서비스 의존성 개선        | ✅ 완료 | Healthcheck 기반 의존성       |
| Healthcheck 엔드포인트    | ✅ 완료 | Backend, Fileserver, Frontend |

---

## 🔴 주의사항

### 서버 배포 시 확인 사항

1. **환경 변수 파일 (선택사항)**

   ```bash
   # 서버에서 .env.prod 파일 생성 (기본값 사용 시 생략 가능)
   cd /home/ubuntu/SEONSHINE
   # 필요시 .env.prod 파일 생성
   ```

2. **DB 포트 변경으로 인한 영향**

   - 기존에 외부에서 DB에 직접 접근하던 경우 더 이상 불가능
   - Backend는 Docker 네트워크를 통해 정상 접근 가능

3. **Redis 포트 변경으로 인한 영향**

   - 기존에 외부에서 Redis에 직접 접근하던 경우 더 이상 불가능
   - Backend는 Docker 네트워크를 통해 정상 접근 가능

4. **Healthcheck 엔드포인트**
   - Backend와 Fileserver 이미지 재빌드 필요
   - Frontend nginx 설정은 볼륨 마운트로 자동 적용

---

## 📊 서비스 재시작 영향도 분석

### 일부 서비스만 재시작해도 되는가?

**답: 대부분 가능하지만, 의존성 고려 필요**

#### ✅ 독립적으로 재시작 가능한 서비스

| 서비스         | 독립 재시작 가능 | 영향도                     |
| -------------- | ---------------- | -------------------------- |
| **portainer**  | ✅ 가능          | 없음 (관리 도구)           |
| **certbot**    | ✅ 가능          | 없음 (SSL 인증서만 갱신)   |
| **fileserver** | ⚠️ 주의          | 업로드 중인 요청 실패 가능 |
| **frontend**   | ⚠️ 주의          | 사용자 요청 일시 중단      |

#### ⚠️ 의존성 고려 필요

| 서비스      | 의존성    | 재시작 시 영향                     |
| ----------- | --------- | ---------------------------------- |
| **backend** | DB, Redis | DB 연결 끊김, Redis 세션 손실 가능 |
| **db**      | 없음      | **모든 서비스 영향** (연결 끊김)   |
| **redis**   | 없음      | Backend 세션/캐시 손실             |

### 재시작 시나리오별 영향도

#### 시나리오 1: Frontend만 재시작

```
✅ 가능
- 영향: 사용자 요청 1-2초 중단
- Backend, DB, Redis는 계속 동작
- 재시작 후 즉시 복구
```

#### 시나리오 2: Backend만 재시작

```
⚠️ 주의 필요
- 영향: API 요청 실패 (재시작 중)
- DB 연결: 재시작 시 자동 재연결
- Redis 세션: 일시적 손실 가능 (재시작 시간 < 5초면 대부분 유지)
- 권장: 재시작 전 graceful shutdown 고려
```

#### 시나리오 3: DB만 재시작

```
🔴 위험
- 영향: 모든 서비스 DB 연결 끊김
- Backend: DB 연결 실패 → 에러 발생
- 권장: 가능하면 피하거나, 유지보수 시간에 수행
```

#### 시나리오 4: Redis만 재시작

```
⚠️ 주의 필요
- 영향: Backend 세션/캐시 손실
- 사용자: 로그인 세션 손실 가능
- 권장: Redis 데이터 영속성 설정 확인
```

---

## 🛠️ 인프라 개선점

### 1. 보안 개선 (✅ 적용 완료)

#### ✅ 하드코딩된 비밀번호 환경 변수화

**적용 완료**: 환경 변수 사용 (기본값 제공)

```yaml
# 적용됨
environment:
  - DB_USER=${DB_USER:-seonshine_mgr}
  - DB_PASSWORD=${DB_PASSWORD:-seonshine@2}
  - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-seonshine@2}
```

**추가 개선 (선택사항)**:

- 서버에 `.env.prod` 파일 생성하여 실제 비밀번호 관리
- `.gitignore`에 `.env.prod` 추가됨 ✅

#### ✅ DB 포트 외부 노출 차단

**적용 완료**: DB 포트(3306) 외부 노출 제거

```yaml
# 적용됨
db:
  ports: [] # 내부 네트워크만 사용
```

#### ✅ Redis 포트 외부 노출 차단

**적용 완료**: Redis 포트(6379) 외부 노출 제거 및 AOF 활성화

```yaml
# 적용됨
redis:
  ports: [] # 내부 네트워크만 사용
  command: redis-server --appendonly yes # AOF 활성화
```

### 2. 성능 및 안정성 개선

#### ✅ Redis 데이터 영속성

**적용 완료**: `redis-data` volume 설정 및 AOF 활성화 ✅

```yaml
# 적용됨
redis:
  command: redis-server --appendonly yes # AOF 활성화
  volumes:
    - redis-data:/data
```

#### ⚠️ DB 백업 전략 부재 (미적용)

**개선 방안**:

```yaml
# 백업 서비스 추가
backup:
  image: mysql:8.0.36
  volumes:
    - mysql-data:/var/lib/mysql
    - ./backups:/backups
  command: >
    sh -c "
    while true; do
      mysqldump -h db -u seonshine_mgr -pseonshine@2 --all-databases > /backups/backup-$$(date +%Y%m%d-%H%M%S).sql;
      sleep 86400;  # 24시간마다
    done
    "
```

#### ⚠️ 리소스 제한 미설정

**개선 방안**:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
```

### 3. 모니터링 개선 (✅ 적용 완료)

#### ✅ Healthcheck 추가

**적용 완료**: 모든 주요 서비스에 healthcheck 추가

```yaml
# 적용됨
backend:
  healthcheck:
    test:
      [
        "CMD",
        "wget",
        "--quiet",
        "--tries=1",
        "--spider",
        "http://localhost:5050/health",
      ]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s

frontend:
  healthcheck:
    test:
      [
        "CMD",
        "wget",
        "--quiet",
        "--tries=1",
        "--spider",
        "http://localhost:80/health",
      ]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s

redis:
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s

fileserver:
  healthcheck:
    test:
      [
        "CMD",
        "wget",
        "--quiet",
        "--tries=1",
        "--spider",
        "http://localhost:4000/health",
      ]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
```

### 4. 로깅 개선 (✅ 적용 완료)

#### ✅ 로그 관리 전략

**적용 완료**: 모든 주요 서비스에 로그 로테이션 설정

```yaml
# 적용됨
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. 네트워크 보안

#### ⚠️ Docker 네트워크 격리

**개선 방안**:

```yaml
networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
  db-network:
    driver: bridge
    internal: true # 외부 접근 차단

services:
  frontend:
    networks:
      - frontend-network
      - backend-network

  backend:
    networks:
      - backend-network
      - db-network

  db:
    networks:
      - db-network
```

### 6. 배포 전략 개선

#### ⚠️ 무중단 배포 미구현

**현재**: `docker-compose down` → 모든 서비스 중지

**개선 방안**:

```yaml
# Blue-Green 배포 또는 Rolling Update
# 또는 docker-compose up -d만 사용 (변경된 서비스만 재시작)
```

---

## 📋 개선 우선순위

### ✅ 완료된 항목

1. ✅ **비밀번호 환경 변수화**
2. ✅ **DB 포트 외부 노출 차단**
3. ✅ **Redis 포트 외부 노출 차단**
4. ✅ **Redis AOF 활성화**
5. ✅ **Healthcheck 추가**
6. ✅ **로그 관리 전략 수립**
7. ✅ **서비스 의존성 개선**

### ⚠️ 미적용 항목 (선택사항)

8. **Redis 인증 추가** (내부 네트워크만 사용하므로 선택사항)
9. **DB 백업 자동화** (별도 스크립트 필요)
10. **리소스 제한 설정** (서버 리소스에 따라 조정)
11. **네트워크 격리** (현재 구조에서 선택사항)
12. **무중단 배포 전략** (현재 `docker-compose up -d`로 충분)

---

## 🔄 서비스 재시작 권장 방법

### 안전한 재시작 순서

```bash
# 1. 독립 서비스 먼저
docker-compose -f docker-compose.prod.yml restart portainer certbot

# 2. 의존성이 없는 서비스
docker-compose -f docker-compose.prod.yml restart fileserver

# 3. Frontend (Backend는 계속 동작)
docker-compose -f docker-compose.prod.yml restart frontend

# 4. Backend (DB, Redis는 계속 동작)
docker-compose -f docker-compose.prod.yml restart backend

# 5. Redis (Backend 재시작 필요할 수 있음)
docker-compose -f docker-compose.prod.yml restart redis
docker-compose -f docker-compose.prod.yml restart backend

# 6. DB (가능하면 피하기, 유지보수 시간에)
docker-compose -f docker-compose.prod.yml restart db
```

### docker-compose up -d 사용 (권장)

```bash
# 변경된 서비스만 자동 재시작
docker-compose -f docker-compose.prod.yml up -d

# 장점:
# - 변경된 서비스만 재시작
# - 의존성 자동 처리
# - 다운타임 최소화
```

---

## 📝 결론

### 일부 서비스만 재시작 가능 여부

**답: 가능하지만 주의 필요**

- ✅ **독립 서비스**: portainer, certbot → 영향 없음
- ⚠️ **의존 서비스**: frontend, backend, fileserver → 일시적 영향 있음
- 🔴 **인프라 서비스**: db, redis → 전체 영향

### 권장 사항

1. **docker-compose up -d 사용**: 변경된 서비스만 자동 재시작
2. **DB 재시작 피하기**: 가능하면 유지보수 시간에
3. **Healthcheck 추가**: 서비스 상태 모니터링
4. **보안 강화**: 비밀번호 환경 변수화, 포트 노출 최소화
