# 배포 전략 가이드

## 📋 브랜치 구조

### main 브랜치 (운영 환경)

- **용도**: 프로덕션 서버 배포
- **대상**: 실제 사용자 서비스
- **파일**: `docker-compose.prod.yml`
- **이미지**: `:prod` 태그
- **배포**: GitHub Actions 자동 배포

### develop 브랜치 (개발 환경)

- **용도**: 개발 서버 배포 (개발자들이 코드 공유)
- **대상**: 개발 서버 (팀 내 공유 환경)
- **파일**: `docker-compose.dev.yml`
- **이미지**: `:dev` 태그
- **배포**: GitHub Actions 자동 배포

### 로컬 개발

- **용도**: 각자의 로컬 머신에서 개발
- **파일**: `docker-compose.dev.yml`
- **배포**: 없음 (로컬에서만 실행)

---

## 🔄 워크플로우

### 1. 로컬 개발

```bash
# 로컬에서 개발
git checkout develop
docker-compose -f docker-compose.dev.yml up -d
```

### 2. develop 브랜치에 푸시 (개발 서버 배포)

```bash
git add .
git commit -m "개발 내용"
git push origin develop
# GitHub Actions가 자동으로 개발 서버에 배포
```

### 3. main 브랜치로 머지 (운영 서버 배포)

```bash
git checkout main
git merge develop
git push origin main
# GitHub Actions가 자동으로 운영 서버에 배포
```

---

## 🎯 환경별 배포 전략

### 🚀 운영 환경 (main 브랜치)

**특징**: 안정성과 신뢰성 중시

#### 배포 전략

- ✅ **엄격한 Healthcheck 검증**
  - DB: 최대 90초 대기
  - Backend: 최대 180초 대기
  - Healthcheck 실패 시 경고 출력
- ✅ **이미지 기반 배포**
  - Docker Hub에서 이미지 pull
  - 이미지 버전 관리
  - 롤백 용이
- ✅ **단계별 검증**
  - 각 단계마다 상태 확인
  - 다음 단계 진행 전 이전 단계 완료 확인
- ✅ **의존성 순서 엄격 준수**
  ```
  1. DB, Redis 시작 → DB healthy 대기 (90초)
  2. Fileserver 재시작 (변경된 경우)
  3. Backend 재시작 (변경된 경우) → Backend healthy 대기 (180초)
  4. Frontend 재시작 (변경된 경우)
  5. 기타 서비스 확인
  ```

#### 타임아웃 설정

- `COMPOSE_HTTP_TIMEOUT=600` (10분)
- DB healthcheck: 90초
- Backend healthcheck: 180초

### 🛠️ 개발 환경 (develop 브랜치)

**특징**: 개발 서버 배포, 개발자들이 코드 공유

#### 배포 전략

- ✅ **빠른 배포**
  - DB: 최대 30초 대기
  - Backend: 10초 대기
  - 빠른 반복 개발 지원
- ✅ **이미지 기반 배포**
  - Docker Hub에서 이미지 pull (`:dev` 태그)
  - 개발 서버에 배포
- ✅ **간소화된 검증**
  - Healthcheck 대기 시간 단축
  - 실패해도 다음 단계 진행

#### 타임아웃 설정

- `COMPOSE_HTTP_TIMEOUT=240` (4분)
- DB healthcheck: 30초
- Backend 대기: 10초

---

## 📊 환경 비교

| 항목                 | 운영 환경 (prod)        | 개발 환경 (dev)        |
| -------------------- | ----------------------- | ---------------------- |
| **브랜치**           | main                    | develop                |
| **실행 위치**        | AWS EC2 서버 (운영)     | AWS EC2 서버 (개발)    |
| **배포 방식**        | GitHub Actions 자동     | GitHub Actions 자동    |
| **Healthcheck 대기** | 엄격 (90초/180초)       | 간소화 (30초/10초)     |
| **이미지 관리**      | Docker Hub pull (:prod) | Docker Hub pull (:dev) |
| **타임아웃**         | 600초 (10분)            | 240초 (4분)            |
| **환경 변수**        | 환경 변수 사용          | 하드코딩               |
| **포트**             | 80, 443, 5050, 4000     | 3000, 5050, 4000       |
| **용도**             | 프로덕션 서비스         | 개발자 코드 공유       |

---

## 📋 서비스 재시작 순서

### 의존성 순서

```
1단계: DB, Redis 시작 → DB healthy 대기
2단계: Fileserver 재시작 (변경된 경우)
3단계: Backend 재시작 (변경된 경우) → Backend healthy 대기
4단계: Frontend 재시작 (변경된 경우)
5단계: Certbot, Portainer 확인
```

### 배포 시나리오별 동작

#### 시나리오 1: docker-compose.yml만 변경

- 모든 서비스 재시작 (down 없이 up -d만)

#### 시나리오 2: Backend만 변경

```
1. DB, Redis 시작
2. Backend 재시작 (pull → up -d)
3. Backend healthy 대기
4. Frontend는 자동으로 Backend를 기다림
```

#### 시나리오 3: Frontend만 변경

```
1. DB, Redis 시작
2. Backend healthy 확인
3. Frontend 재시작
```

자세한 내용은 [배포 가이드](./DEPLOYMENT_GUIDE.md) 참고

---

## ⚠️ 주의사항

### 운영 환경

- ⚠️ Healthcheck 실패 시 경고 출력 (배포는 계속됨)
- ⚠️ 타임아웃 발생 시 다음 단계로 진행
- ⚠️ 롤백을 위해 이전 이미지 태그 유지 권장

### 개발 환경

- ⚠️ 개발 서버에 배포 (운영 서버와 분리)
- ⚠️ 개발 서버 데이터베이스 사용
- ⚠️ Healthcheck가 없을 수 있음 (빠른 진행)

---

## 🔍 배포 확인

### 운영 환경

```bash
ssh -i ~/.ssh/id_rsa ubuntu@<운영서버IP>
cd /home/ubuntu/SEONSHINE
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 개발 환경

```bash
ssh -i ~/.ssh/id_rsa ubuntu@<개발서버IP>
cd /home/ubuntu/SEONSHINE
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.dev.yml logs -f backend
```
