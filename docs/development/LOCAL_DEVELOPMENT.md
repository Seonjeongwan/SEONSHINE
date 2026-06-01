# 로컬 개발 환경 가이드

## 📋 개요

개발 환경은 **로컬에서만 실행**하도록 구성되어 있습니다.

- `docker-compose.dev.yml`: 로컬 개발용 Docker Compose 설정
- GitHub Actions: **운영 환경(main 브랜치)만 배포**
- develop 브랜치: 로컬 개발용, 서버 배포 없음

---

## 🚀 로컬 개발 환경 시작

### 1. 필수 요구사항

- Docker & Docker Compose 설치
- Git 설치

### 2. 프로젝트 클론 및 설정

```bash
# 프로젝트 클론
git clone https://github.com/Seonjeongwan/SEONSHINE.git
cd SEONSHINE

# develop 브랜치로 전환 (선택사항)
git checkout develop
```

### 3. 개발 환경 시작

```bash
# 모든 서비스 시작
docker-compose -f docker-compose.dev.yml up -d

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f

# 특정 서비스 로그만 확인
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### 4. 서비스 접속 정보

| 서비스     | 포트 | 접속 URL              |
| ---------- | ---- | --------------------- |
| Frontend   | 3000 | http://localhost:3000 |
| Backend    | 5050 | http://localhost:5050 |
| Fileserver | 4000 | http://localhost:4000 |
| MySQL      | 3306 | localhost:3306        |
| Redis      | 6379 | localhost:6379        |

---

## 🔧 개발 환경 특징

### ✅ 핫 리로드 (Hot Reload)

개발 환경은 코드 변경 시 자동으로 반영됩니다:

```yaml
# docker-compose.dev.yml
volumes:
  - ./seonshine_backend:/app # 코드 마운트
  - /app/node_modules # node_modules 제외
```

- **Backend**: 코드 변경 시 자동 재시작 (nodemon)
- **Frontend**: 코드 변경 시 자동 리로드 (Vite/React)
- **Fileserver**: 코드 변경 시 자동 재시작

### ✅ 로컬 빌드

개발 환경은 이미지 pull 없이 로컬에서 빌드합니다:

```bash
# 서비스 재빌드 (코드 변경 후)
docker-compose -f docker-compose.dev.yml up -d --build backend

# 모든 서비스 재빌드
docker-compose -f docker-compose.dev.yml up -d --build
```

### ✅ 개발 모드 실행

```yaml
# Backend
command: sh -c "npm run migrate:all && npm run seed:all && npm run dev"

# Frontend
CMD ["yarn", "dev"]
```

---

## 📝 개발 워크플로우

### 1. 코드 수정

```bash
# 로컬에서 코드 수정
# 변경사항이 자동으로 컨테이너에 반영됨
```

### 2. 테스트

```bash
# 로컬에서 테스트
# http://localhost:3000 접속하여 확인
```

### 3. 커밋 및 푸시

```bash
# develop 브랜치에 커밋
git add .
git commit -m "개발 내용"
git push origin develop

# GitHub Actions는 실행되지 않음 (로컬 개발용)
```

### 4. 운영 배포 (main 브랜치로 머지)

```bash
# main 브랜치로 머지
git checkout main
git merge develop
git push origin main

# GitHub Actions가 자동으로 배포 시작
```

---

## 🛠️ 유용한 명령어

### 서비스 관리

```bash
# 서비스 시작
docker-compose -f docker-compose.dev.yml up -d

# 서비스 중지
docker-compose -f docker-compose.dev.yml down

# 서비스 재시작
docker-compose -f docker-compose.dev.yml restart backend

# 특정 서비스만 재빌드
docker-compose -f docker-compose.dev.yml up -d --build backend
```

### 데이터베이스 관리

```bash
# DB 컨테이너 접속
docker-compose -f docker-compose.dev.yml exec db mysql -u seonshine_mgr -pseonshine@2

# DB 초기화 (주의: 데이터 삭제)
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d db
```

### 로그 확인

```bash
# 모든 서비스 로그
docker-compose -f docker-compose.dev.yml logs -f

# 특정 서비스 로그
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend

# 최근 100줄만 확인
docker-compose -f docker-compose.dev.yml logs --tail=100 backend
```

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose -f docker-compose.dev.yml ps

# 컨테이너 리소스 사용량 확인
docker stats
```

---

## 🔍 문제 해결

### 포트 충돌

```bash
# 포트가 이미 사용 중인 경우
# docker-compose.dev.yml에서 포트 변경
ports:
  - "3001:3000"  # 3000 대신 3001 사용
```

### 볼륨 마운트 문제

```bash
# 권한 문제 해결
sudo chown -R $USER:$USER ./seonshine_backend
sudo chown -R $USER:$USER ./seonshine_frontend
```

### 컨테이너 재시작 문제

```bash
# 컨테이너 강제 재시작
docker-compose -f docker-compose.dev.yml restart

# 컨테이너 완전히 제거 후 재시작
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### DB 연결 문제

```bash
# DB 상태 확인
docker-compose -f docker-compose.dev.yml ps db

# DB 로그 확인
docker-compose -f docker-compose.dev.yml logs db

# DB 재시작
docker-compose -f docker-compose.dev.yml restart db
```

---

## 📊 개발 환경 vs 운영 환경

| 항목               | 개발 환경 (로컬)         | 운영 환경 (서버)          |
| ------------------ | ------------------------ | ------------------------- |
| **실행 위치**      | 로컬 머신                | AWS EC2 서버              |
| **Docker Compose** | `docker-compose.dev.yml` | `docker-compose.prod.yml` |
| **이미지**         | 로컬 빌드                | Docker Hub pull           |
| **핫 리로드**      | ✅ 지원                  | ❌ 없음                   |
| **포트**           | 3000, 5050, 4000         | 80, 443, 5050, 4000       |
| **환경 변수**      | `NODE_ENV=development`   | `NODE_ENV=production`     |
| **배포**           | 수동 (로컬)              | 자동 (GitHub Actions)     |

---

## ⚠️ 주의사항

1. **develop 브랜치 푸시 시 배포되지 않음**

   - GitHub Actions는 main 브랜치만 배포
   - develop 브랜치는 로컬 개발용

2. **로컬 데이터베이스**

   - 개발 환경의 DB는 로컬에만 존재
   - 운영 DB와 분리되어 있음

3. **포트 충돌**

   - 로컬에서 이미 사용 중인 포트 확인 필요
   - 필요시 docker-compose.dev.yml에서 포트 변경

4. **환경 변수**
   - 개발 환경은 하드코딩된 값 사용
   - 운영 환경은 환경 변수 사용

---

## 🎯 다음 단계

1. 로컬에서 개발 완료
2. develop 브랜치에 커밋 및 푸시
3. main 브랜치로 머지
4. GitHub Actions가 자동으로 운영 환경 배포
