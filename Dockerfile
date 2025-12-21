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
FROM nginx:alpine

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# IMPORTANTE: Eliminar configuración default y copiar la creada
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Ejecutar nginx en foreground
CMD ["nginx", "-g", "daemon off;"]