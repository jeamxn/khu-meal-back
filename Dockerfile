# syntax=docker/dockerfile:1.2

###############################
# 1단계: 빌드 스테이지
###############################
FROM oven/bun:latest as builder
WORKDIR /app

# 패키지 파일 복사 후 의존성 설치
COPY package.json bun.lockb ./
RUN bun install

# 앱 소스 전체 복사
COPY . .

# 환경변수 파일을 BuildKit 시크릿으로 받아서 주입 후 빌드
RUN --mount=type=secret,id=env \
  export $(cat /run/secrets/env | grep -v '^#' | xargs) && \
  bun run start

###############################
# 2단계: 실행 스테이지
###############################
FROM oven/bun:latest as runner
WORKDIR /app

# 빌드 결과물과 의존성만 복사
COPY --from=builder /app/server ./server

EXPOSE 8000

# 런타임은 외부에서 env 주입 (docker run --env-file 또는 -e 옵션)
CMD ["./server"]