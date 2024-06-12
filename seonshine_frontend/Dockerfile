# Build stage
FROM node:22.2.0-alpine AS builder

# Yarn 설치
RUN apk add --no-cache yarn

WORKDIR /app

# 패키지 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install

# 애플리케이션 코드 복사
COPY . ./

# 애플리케이션 빌드
RUN yarn build

# Production stage
FROM node:22.2.0-alpine

# Yarn 설치
RUN apk add --no-cache yarn

WORKDIR /app

# 빌드된 파일 복사
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/yarn.lock ./

# 프로덕션 의존성 설치
RUN yarn install --production --frozen-lockfile

EXPOSE 3000

# 빌드된 애플리케이션 실행
CMD ["yarn", "preview"]