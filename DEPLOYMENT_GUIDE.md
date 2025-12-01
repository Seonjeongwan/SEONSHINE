# Docker 배포 가이드

## 🚀 배포 전 필수 작업

### ✅ DB 마이그레이션 불필요

**중요**: 이번 업데이트는 기존 DB의 `is_deleted` 컬럼을 사용하므로 **마이그레이션이 필요 없습니다**.

- `is_deleted` 컬럼이 이미 `menu_items` 테이블에 존재함 (기본값: 0)
- 기존 데이터는 자동으로 `is_deleted = 0` (정상 상태)
- 코드만 배포하면 즉시 사용 가능

### 1. Docker 이미지 빌드 및 푸시

```bash
# Frontend 빌드 및 푸시
cd seonshine_frontend
docker build -f Dockerfile.prod -t seonshinevn/seonshine_frontend:prod .
docker push seonshinevn/seonshine_frontend:prod

# Backend 빌드 및 푸시
cd ../seonshine_backend
docker build -f Dockerfile.prod -t seonshinevn/seonshine_backend:prod .
docker push seonshinevn/seonshine_backend:prod

# Fileserver 빌드 및 푸시
cd ../seonshine_fileserver
docker build -f Dockerfile.prod -t seonshinevn/seonshine_fileserver:prod .
docker push seonshinevn/seonshine_fileserver:prod
```

### 2. 서버에서 서비스 시작/재시작

```bash
# 서버 접속
ssh -i ~/.ssh/id_rsa ubuntu@54.254.0.100

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/SEONSHINE

# 기존 서비스 중지
docker-compose -f docker-compose.prod.yml down

# 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 📋 배포 체크리스트

- [x] ~~DB 마이그레이션 실행~~ (불필요 - `is_deleted` 컬럼이 이미 존재)
- [ ] Docker 이미지 빌드 및 푸시 완료
- [ ] 서버에서 최신 코드 pull
- [ ] docker-compose로 서비스 재시작
- [ ] 서비스 정상 동작 확인
- [ ] 메뉴 삭제 기능 테스트 (soft delete 확인)

## 🔍 배포 후 확인 사항

### 1. DB 컬럼 확인

```sql
-- restaurant_db에 접속
USE restaurant_db;

-- is_deleted 컬럼이 존재하는지 확인
DESCRIBE menu_items;

-- 기존 데이터의 is_deleted 값 확인 (기본값 0이어야 함)
SELECT item_id, name, is_deleted FROM menu_items LIMIT 10;
```

### 2. 서비스 상태 확인

```bash
# 모든 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 특정 서비스 로그 확인
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### 3. 기능 테스트

1. 관리자로 로그인
2. 메뉴 목록 확인 (삭제된 메뉴는 보이지 않아야 함 - `is_deleted = false`만 표시)
3. 메뉴 삭제 테스트 (`is_deleted = true`로 변경)
4. 삭제 후 메뉴 목록에서 사라졌는지 확인 (관리자/사용자 모두)
5. 사용자 주문 화면에서도 삭제된 메뉴가 보이지 않는지 확인
6. 삭제된 메뉴로 주문 시도 → 에러 반환 확인

## ⚠️ 주의사항

1. **DB 마이그레이션 불필요**: `is_deleted` 컬럼이 이미 존재하므로 추가 작업 없음
2. 기존 데이터는 자동으로 `is_deleted = 0` (정상 상태)
3. 코드 배포 후 즉시 사용 가능

## 🆘 문제 해결

### is_deleted 컬럼이 없는 경우 (드물게 발생할 수 있음)

```bash
# DB 컨테이너에 접속하여 확인
docker exec -it seonshine-db-1 mysql -u seonshine_mgr -pseonshine@2 -e "DESCRIBE restaurant_db.menu_items;"

# is_deleted 컬럼이 없다면 추가
docker exec -it seonshine-db-1 mysql -u seonshine_mgr -pseonshine@2 restaurant_db -e "ALTER TABLE menu_items ADD COLUMN is_deleted TINYINT(1) DEFAULT 0 NOT NULL COMMENT '메뉴 삭제 여부 0:정상 1:삭제됨' AFTER price;"
```

### 서비스가 시작되지 않는 경우

```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart backend
```
