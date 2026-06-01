# 배포 가이드

## 🚀 배포 방법

### 자동 배포 (권장)

GitHub Actions를 통한 자동 배포:

```bash
# main 브랜치에 푸시하면 자동 배포
git checkout main
git merge develop
git push origin main

# 또는 develop 브랜치에 푸시하면 개발 서버에 자동 배포
git push origin develop
```

자세한 내용은 [배포 전략](./DEPLOYMENT_STRATEGY.md) 참고

### 수동 배포

필요시 수동으로 배포:

```bash
# 1. 이미지 빌드 및 푸시
docker build -t seonshinevn/seonshine_backend:prod ./seonshine_backend
docker build -t seonshinevn/seonshine_frontend:prod ./seonshine_frontend
docker build -t seonshinevn/seonshine_fileserver:prod ./seonshine_fileserver
docker push seonshinevn/seonshine_backend:prod
docker push seonshinevn/seonshine_frontend:prod
docker push seonshinevn/seonshine_fileserver:prod

# 2. 서버에서 배포
ssh -i ~/.ssh/id_rsa ubuntu@54.254.0.100
cd /home/ubuntu/SEONSHINE
git pull origin main
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📋 배포 전 체크리스트

### 1. 코드 변경사항 확인
- [ ] 변경된 서비스 확인
- [ ] 이미지 재빌드 필요 여부 확인
- [ ] 환경 변수 변경 여부 확인

### 2. 배포 전 검증
- [ ] 로컬에서 테스트 완료
- [ ] 코드 리뷰 완료
- [ ] 브랜치 전략 확인 (main/develop)

### 3. 배포 실행
- [ ] GitHub Actions 워크플로우 확인
- [ ] 서버 접근 가능 여부 확인
- [ ] 배포 실행

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
- 다운타임 최소화

#### 시나리오 2: Backend만 변경
```
1. DB, Redis 시작 (이미 실행 중이면 스킵)
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

자세한 내용은 [배포 전략](./DEPLOYMENT_STRATEGY.md) 참고

---

## 🔍 배포 후 확인 사항

### 1. 서비스 상태 확인
```bash
# 서버에서 실행
cd /home/ubuntu/SEONSHINE

# 서비스 상태 확인
docker-compose -f docker-compose.prod.yml ps

# Healthcheck 상태 확인
docker-compose -f docker-compose.prod.yml ps | grep -E "healthy|unhealthy"
```

### 2. 로그 확인
```bash
# 모든 서비스 로그
docker-compose -f docker-compose.prod.yml logs --tail=50

# 특정 서비스 로그
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
docker-compose -f docker-compose.prod.yml logs --tail=50 frontend
docker-compose -f docker-compose.prod.yml logs --tail=50 fileserver
```

### 3. Healthcheck 엔드포인트 테스트
```bash
# Backend
curl http://localhost:5050/health

# Fileserver
curl http://localhost:4000/health

# Frontend (nginx)
curl http://localhost/health
```

### 4. 서비스 연결 확인
```bash
# DB 연결 확인 (내부 네트워크)
docker-compose -f docker-compose.prod.yml exec backend ping -c 1 db

# Redis 연결 확인 (내부 네트워크)
docker-compose -f docker-compose.prod.yml exec backend ping -c 1 redis
```

---

## ⚠️ 주의사항

### DB 포트 변경 영향
- **변경 전**: 외부에서 `mysql -h 54.254.0.100 -P 3306` 접근 가능
- **변경 후**: 외부 접근 불가능, Docker 네트워크 내부에서만 접근 가능
- **해결책**: 필요시 SSH 터널링 사용
  ```bash
  ssh -i ~/.ssh/id_rsa -L 3306:localhost:3306 ubuntu@54.254.0.100
  ```

### Redis 포트 변경 영향
- **변경 전**: 외부에서 `redis-cli -h 54.254.0.100 -p 6379` 접근 가능
- **변경 후**: 외부 접근 불가능, Docker 네트워크 내부에서만 접근 가능
- **해결책**: 필요시 SSH 터널링 사용
  ```bash
  ssh -i ~/.ssh/id_rsa -L 6379:localhost:6379 ubuntu@54.254.0.100
  ```

---

## 🆘 문제 해결

### 서비스가 시작되지 않는 경우
```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart backend

# 컨테이너 완전히 재시작
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### 롤백 방법
```bash
# 서버에서
cd /home/ubuntu/SEONSHINE
git log --oneline  # 이전 커밋 확인
git checkout <이전_커밋_해시>
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 관련 문서

- [배포 전략](./DEPLOYMENT_STRATEGY.md): 브랜치 전략 및 환경별 배포 전략
- [로컬 개발 가이드](../development/LOCAL_DEVELOPMENT.md): 로컬 개발 환경 설정
- [인프라 개선점](../development/INFRASTRUCTURE_IMPROVEMENTS.md): 인프라 개선 사항
