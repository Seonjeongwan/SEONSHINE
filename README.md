# SEONSHINE Project

## 📋 프로젝트 개요

SEONSHINE 프로젝트는 Docker 기반의 마이크로서비스 아키텍처를 사용하는 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 로컬 개발 환경 설정

```bash
# 개발 환경 시작
docker-compose -f docker-compose.dev.yml up -d
```

자세한 내용은 [로컬 개발 가이드](./docs/development/LOCAL_DEVELOPMENT.md)를 참고하세요.

### 배포

```bash
# main 브랜치에 푸시하면 자동 배포
git push origin main
```

자세한 내용은 [배포 가이드](./docs/deployment/DEPLOYMENT_GUIDE.md)를 참고하세요.

## 📚 문서

프로젝트 문서는 `docs/` 디렉토리에 카테고리별로 정리되어 있습니다.

### 📦 배포 관련

- [배포 가이드](./docs/deployment/DEPLOYMENT_GUIDE.md): 배포 방법, 체크리스트, 재시작 순서
- [배포 전략](./docs/deployment/DEPLOYMENT_STRATEGY.md): 브랜치 전략, 환경별 차이점

### 🛠️ 개발 관련

- [로컬 개발 가이드](./docs/development/LOCAL_DEVELOPMENT.md)
- [인프라 개선점](./docs/development/INFRASTRUCTURE_IMPROVEMENTS.md)

### 🗄️ 데이터베이스 관련

- [DB 실행 가이드](./docs/database/DB_RUN_GUIDE.md)
- [MySQL 문법 가이드](./docs/database/MYSQL_SYNTAX_GUIDE.md)

### 🧪 테스트 관련

- [테스트 체크리스트](./docs/testing/TESTING_CHECKLIST.md)

전체 문서 목록은 [docs/README.md](./docs/README.md)를 참고하세요.

## 🏗️ 프로젝트 구조

```
SEONSHINE_project/
├── docs/                    # 문서
│   ├── deployment/          # 배포 관련
│   ├── development/         # 개발 관련
│   ├── database/           # 데이터베이스 관련
│   └── testing/            # 테스트 관련
├── seonshine_frontend/      # Frontend 서비스
├── seonshine_backend/       # Backend 서비스
├── seonshine_fileserver/    # File Server 서비스
├── seonshine_db/            # Database 스키마
├── docker-compose.prod.yml  # 운영 환경 설정
└── docker-compose.dev.yml   # 개발 환경 설정
```

## 🔧 기술 스택

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Container**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## 📝 브랜치 전략

- **main**: 운영 서버 배포 (프로덕션)
- **develop**: 개발 서버 배포 (개발자 공유)

자세한 내용은 [배포 전략](./docs/deployment/DEPLOYMENT_STRATEGY.md)을 참고하세요.

## 🔗 관련 링크

- [문서 가이드](./docs/README.md)
- [배포 가이드](./docs/deployment/DEPLOYMENT_GUIDE.md)
- [로컬 개발 가이드](./docs/development/LOCAL_DEVELOPMENT.md)
