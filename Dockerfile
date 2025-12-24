# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runtime

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar solo las dependencias de producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Variables de entorno por defecto
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

# Ejecutar el servidor Node.js de Astro
CMD ["node", "./dist/server/entry.mjs"]