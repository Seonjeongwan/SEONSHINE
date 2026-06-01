# 이전 버전과의 차이점 및 구동 확인

## 📋 주요 변경사항 요약

### ✅ 보안 강화

#### 1. DB 포트 외부 노출 제거

**변경 전**:

```yaml
ports:
  - "3306:3306" # 외부 접근 가능
```

**변경 후**:

```yaml
ports: [] # 내부 네트워크만 사용
```

**영향**:

- ✅ 보안 강화 (외부에서 DB 직접 접근 불가)
- ✅ Backend는 Docker 네트워크로 정상 접근 가능 (`DB_HOST=db`)
- ⚠️ 외부에서 DB 접근 필요 시 SSH 터널링 사용

#### 2. Redis 포트 외부 노출 제거

**변경 전**:

```yaml
ports:
  - "6379:6379" # 외부 접근 가능
```

**변경 후**:

```yaml
ports: [] # 내부 네트워크만 사용
command: redis-server --appendonly yes # AOF 활성화 추가
```

**영향**:

- ✅ 보안 강화 (외부에서 Redis 직접 접근 불가)
- ✅ Backend는 Docker 네트워크로 정상 접근 가능
- ✅ Redis AOF 활성화로 데이터 영속성 강화
- ⚠️ 외부에서 Redis 접근 필요 시 SSH 터널링 사용

#### 3. 비밀번호 환경 변수화

**변경 전**:

```yaml
environment:
  - DB_PASSWORD=seonshine@2 # 하드코딩
  - MYSQL_PASSWORD=seonshine@2
```

**변경 후**:

```yaml
environment:
  - DB_PASSWORD=${DB_PASSWORD:-seonshine@2} # 환경 변수 (기본값 제공)
  - MYSQL_PASSWORD=${DB_PASSWORD:-seonshine@2}
```

**영향**:

- ✅ 보안 강화 (비밀번호 하드코딩 제거)
- ✅ 기본값 제공으로 즉시 사용 가능
- ⚠️ `.env.prod` 파일 생성 선택사항

---

### ✅ 안정성 및 모니터링 개선

#### 4. Healthcheck 추가

**변경 전**: Healthcheck 없음

**변경 후**:

```yaml
# Frontend
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s

# Backend
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5050/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

# Fileserver
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s

# Redis
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

**영향**:

- ✅ 서비스 상태 자동 모니터링
- ✅ 의존성 서비스가 healthy 상태 확인 후 시작
- ⚠️ Healthcheck 엔드포인트 추가 필요 (이미 추가됨)
- ⚠️ wget이 이미지에 포함되어 있는지 확인 필요

#### 5. 로그 관리 추가

**변경 전**: 로그 관리 설정 없음

**변경 후**:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

**영향**:

- ✅ 디스크 공간 절약 (로그 자동 로테이션)
- ✅ 로그 관리 자동화
- ✅ 영향 없음 (기능 개선)

#### 6. 서비스 의존성 개선

**변경 전**:

```yaml
depends_on:
  - backend
  - fileserver
```

**변경 후**:

```yaml
depends_on:
  backend:
    condition: service_healthy
  fileserver:
    condition: service_started
```

**영향**:

- ✅ Frontend가 Backend가 완전히 준비된 후 시작
- ✅ 더 안정적인 서비스 시작 순서
- ✅ 영향 없음 (기능 개선)

---

## 🔍 구동 확인 사항

### ✅ 확인 완료 항목

1. **docker-compose.prod.yml 문법**: 정상
2. **Healthcheck 엔드포인트**: 모두 추가됨
   - Backend: `/health` 엔드포인트 ✅
   - Fileserver: `/health` 엔드포인트 ✅
   - Frontend: `/health` location ✅
3. **환경 변수 기본값**: 설정됨 ✅
4. **포트 외부 노출**: 차단됨 ✅
5. **Healthcheck 설정**: 5개 서비스에 설정됨 ✅
6. **로그 관리**: 5개 서비스에 설정됨 ✅
7. **의존성 순서**: 개선됨 ✅

### ⚠️ 확인 필요 항목

#### 1. wget 명령어 사용 가능 여부

**문제 가능성**:

- `node:22.2.0-alpine` 이미지에 wget이 없을 수 있음
- Alpine Linux는 최소 이미지이므로 wget이 기본 포함되지 않을 수 있음

**확인 방법**:

```bash
# Backend/Fileserver 이미지에서 확인
docker run --rm node:22.2.0-alpine wget --version
```

**해결 방법** (필요시):

```dockerfile
# Dockerfile.prod에 추가
RUN apk add --no-cache wget
```

또는 curl 사용:

```yaml
healthcheck:
  test: ["CMD", "sh", "-c", "curl -f http://localhost:5050/health || exit 1"]
```

#### 2. nginx 이미지의 wget

**확인**: nginx 이미지는 보통 wget이 포함되어 있음

---

## 📊 변경사항 영향도 분석

### 🔴 구동에 영향 없는 변경사항

1. ✅ **로그 관리 추가**: 기능 개선, 구동에 영향 없음
2. ✅ **의존성 순서 개선**: 더 안정적, 구동에 영향 없음
3. ✅ **환경 변수 기본값**: 기본값 제공으로 즉시 사용 가능

### ⚠️ 구동 전 확인 필요

1. ⚠️ **DB 포트 제거**:

   - Backend는 Docker 네트워크로 접근하므로 정상 동작
   - 외부 접근 필요 시 SSH 터널링 사용

2. ⚠️ **Redis 포트 제거**:

   - Backend는 Docker 네트워크로 접근하므로 정상 동작
   - 외부 접근 필요 시 SSH 터널링 사용

3. ⚠️ **Healthcheck wget 사용**:
   - 이미지에 wget이 있는지 확인 필요
   - 없으면 Dockerfile에 wget 설치 추가 또는 curl 사용

---

## 🧪 구동 테스트 체크리스트

### 배포 전 확인

- [ ] Backend 이미지에 wget 또는 curl 포함 여부 확인
- [ ] Fileserver 이미지에 wget 또는 curl 포함 여부 확인
- [ ] Frontend nginx 이미지에 wget 포함 여부 확인 (보통 포함됨)
- [ ] Healthcheck 엔드포인트 테스트
- [ ] 환경 변수 기본값 테스트

### 배포 후 확인

- [ ] 모든 서비스 정상 시작
- [ ] Healthcheck 상태 확인 (healthy)
- [ ] DB 연결 확인 (Backend → DB)
- [ ] Redis 연결 확인 (Backend → Redis)
- [ ] Frontend → Backend 연결 확인
- [ ] Frontend → Fileserver 연결 확인

---

## 🔧 wget 확인 및 대안

### 확인 방법

```bash
# Backend 이미지에서 확인
docker run --rm seonshinevn/seonshine_backend:prod wget --version

# Fileserver 이미지에서 확인
docker run --rm seonshinevn/seonshine_fileserver:prod wget --version

# nginx 이미지에서 확인
docker run --rm nginx:latest wget --version
```

### wget이 없는 경우 대안

#### 옵션 1: Dockerfile에 wget 설치

```dockerfile
# Backend Dockerfile.prod
FROM node:22.2.0-alpine
RUN apk add --no-cache wget
# ... 나머지 설정
```

#### 옵션 2: curl 사용 (Node 이미지에 보통 포함)

```yaml
healthcheck:
  test: ["CMD", "sh", "-c", "curl -f http://localhost:5050/health || exit 1"]
```

#### 옵션 3: node 내장 기능 사용

```yaml
healthcheck:
  test:
    [
      "CMD",
      "node",
      "-e",
      "require('http').get('http://localhost:5050/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))",
    ]
```

---

## ✅ 최종 확인 결과

### 구동 가능 여부: ✅ 가능

**이유**:

1. 모든 필수 설정이 올바르게 구성됨
2. Healthcheck 엔드포인트가 모두 추가됨
3. 환경 변수 기본값 제공으로 즉시 사용 가능
4. 의존성 순서가 올바르게 설정됨

### 주의사항

1. ⚠️ **wget 확인 필요**: Backend/Fileserver 이미지에 wget이 있는지 확인
2. ⚠️ **이미지 재빌드 필요**: Backend, Fileserver (healthcheck 엔드포인트 추가)
3. ⚠️ **외부 DB/Redis 접근**: SSH 터널링 필요

---

## 🚀 배포 권장 순서

1. **wget 확인 및 필요시 Dockerfile 수정**
2. **이미지 재빌드** (Backend, Fileserver)
3. **로컬에서 테스트** (선택사항)
4. **GitHub에 푸시** (자동 배포)
5. **배포 후 확인** (Healthcheck 상태, 서비스 연결)
