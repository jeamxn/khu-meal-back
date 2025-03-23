# syntax=docker/dockerfile:1.2

###############################
# 2단계: 실행 스테이지
###############################
FROM oven/bun:latest as runner
WORKDIR /app

# 빌드 결과물과 의존성만 복사
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./package.json

EXPOSE 8000

# 런타임은 외부에서 env 주입 (docker run --env-file 또는 -e 옵션)
CMD ["bun", "run", "start"]