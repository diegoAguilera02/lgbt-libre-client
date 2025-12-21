# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

# Install system dependencies required for Sharp
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependencies archives
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@latest

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy code
COPY . .

# Build project
RUN pnpm run build

# ============================================
# Stage 2: Production (Nginx)
# ============================================
FROM nginx:alpine

# Metadata
LABEL maintainer="LGBT Libre"
LABEL description="Landing LGBT Libre"

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
