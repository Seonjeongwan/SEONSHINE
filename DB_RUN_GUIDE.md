# DB 실행 가이드

## 🚀 DB 실행 방법

### 방법 1: Docker Compose로 전체 서비스 실행 (권장)

```bash
# 프로젝트 루트 디렉토리에서
cd /Users/seon/Desktop/SEONSHINE_project

# 개발 환경으로 전체 서비스 실행 (DB 포함)
docker-compose -f docker-compose.dev.yml up -d

# DB만 실행하고 싶은 경우
docker-compose -f docker-compose.dev.yml up -d db redis
```

**특징**:

- DB 자동 초기화: `./seonshine_db/schema` 폴더의 SQL 파일이 자동 실행됨
- Backend가 자동으로 마이그레이션 및 시드 실행 (`npm run migrate:all && npm run seed:all`)
- 포트: `localhost:3306`

### 방법 2: DB만 Docker로 실행

```bash
# DB 컨테이너만 실행
docker-compose -f docker-compose.dev.yml up -d db

# DB 상태 확인
docker-compose -f docker-compose.dev.yml ps db

# DB 로그 확인
docker-compose -f docker-compose.dev.yml logs -f db
```

### 방법 3: 수동으로 DB 초기화 실행

```bash
# Backend 디렉토리에서
cd seonshine_backend

# DB 초기화 스크립트 실행
node db/initialize.js
```

## 📋 DB 접속 정보

### 개발 환경 (Docker)

- **호스트**: `localhost` 또는 `db` (Docker 네트워크 내)
- **포트**: `3306`
- **사용자**: `seonshine_mgr`
- **비밀번호**: `seonshine@2`
- **Root 비밀번호**: `seonshine@2`

### 프로덕션 환경

- **호스트**: `54.254.0.100`
- **포트**: `3360`
- **사용자**: `seonshine_mgr`
- **비밀번호**: `seonshine@2`

## 🔌 DB 접속 방법

### 1. MySQL 클라이언트로 접속

```bash
# 로컬 Docker DB 접속
mysql -h localhost -P 3306 -u seonshine_mgr -pseonshine@2

# 프로덕션 DB 접속
mysql -h 54.254.0.100 -P 3360 -u seonshine_mgr -pseonshine@2
```

### 2. Docker 컨테이너 내부에서 접속

```bash
# DB 컨테이너에 접속
docker exec -it seonshine-db-1 bash

# MySQL 접속
mysql -u seonshine_mgr -pseonshine@2
```

### 3. DBeaver, MySQL Workbench 등 GUI 도구 사용

**로컬 개발 환경**:

- Host: `localhost`
- Port: `3306`
- User: `seonshine_mgr`
- Password: `seonshine@2`

**프로덕션 환경**:

- Host: `54.254.0.100`
- Port: `3360`
- User: `seonshine_mgr`
- Password: `seonshine@2`

## 📊 데이터베이스 목록

프로젝트는 4개의 데이터베이스를 사용합니다:

1. **common_db**: 공통 데이터 (부서 정보 등)
2. **user_db**: 사용자 정보
3. **restaurant_db**: 식당 및 메뉴 정보
4. **order_db**: 주문 정보

## 🛠️ DB 초기화 및 마이그레이션

### 자동 초기화 (Docker)

Docker Compose로 DB를 처음 실행하면:

- `./seonshine_db/schema/initialize.sql` 파일이 자동 실행됨
- 모든 데이터베이스와 테이블이 자동 생성됨

### 수동 초기화

```bash
# Backend 디렉토리에서
cd seonshine_backend

# DB 초기화
node db/initialize.js

# 마이그레이션 실행
npm run migrate:all

# 시드 데이터 추가
npm run seed:all
```

## 🔍 DB 상태 확인

### Docker 컨테이너 상태 확인

```bash
# 모든 컨테이너 상태
docker-compose -f docker-compose.dev.yml ps

# DB 컨테이너만 확인
docker-compose -f docker-compose.dev.yml ps db

# DB 로그 확인
docker-compose -f docker-compose.dev.yml logs db
```

### DB 연결 테스트

```bash
# MySQL 연결 테스트
mysql -h localhost -P 3306 -u seonshine_mgr -pseonshine@2 -e "SELECT 1"

# 데이터베이스 목록 확인
mysql -h localhost -P 3306 -u seonshine_mgr -pseonshine@2 -e "SHOW DATABASES;"
```

## 🗑️ DB 초기화 (데이터 삭제)

### 주의: 모든 데이터가 삭제됩니다!

```bash
# Docker 볼륨 삭제 (모든 데이터 삭제)
docker-compose -f docker-compose.dev.yml down -v

# 다시 시작 (빈 DB로 시작)
docker-compose -f docker-compose.dev.yml up -d db
```

## 📝 주요 명령어 요약

```bash
# 전체 서비스 시작 (DB 포함)
docker-compose -f docker-compose.dev.yml up -d

# DB만 시작
docker-compose -f docker-compose.dev.yml up -d db

# DB 중지
docker-compose -f docker-compose.dev.yml stop db

# DB 재시작
docker-compose -f docker-compose.dev.yml restart db

# DB 로그 확인
docker-compose -f docker-compose.dev.yml logs -f db

# DB 컨테이너 접속
docker exec -it seonshine-db-1 bash

# DB 접속 (컨테이너 내부)
docker exec -it seonshine-db-1 mysql -u seonshine_mgr -pseonshine@2
```

## ⚠️ 문제 해결

### DB가 시작되지 않는 경우

```bash
# 로그 확인
docker-compose -f docker-compose.dev.yml logs db

# 컨테이너 재시작
docker-compose -f docker-compose.dev.yml restart db

# 포트 충돌 확인
lsof -i :3306
```

### 연결 오류가 발생하는 경우

```bash
# DB가 실행 중인지s 확인
docker-compose -f docker-compose.dev.yml ps db

# 네트워크 확인
docker network ls

# DB 컨테이너 IP 확인
docker inspect seonshine-db-1 | grep IPAddress
```


