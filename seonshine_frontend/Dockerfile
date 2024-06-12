# Build stage
FROM node:22.2.0-alpine AS builder

# Yarn 설치
RUN apk add --no-cache yarn

WORKDIR /app

# Copy only package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22.2.0-alpine

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/yarn.lock /app/

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

EXPOSE 3000

# Use the built files
CMD [ "yarn", "dev" ]
#CMD [ "yarn", "start" ]