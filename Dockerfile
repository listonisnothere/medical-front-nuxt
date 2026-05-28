# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
ARG NUXT_PUBLIC_API_BASE
ARG NUXT_BACKEND_ORIGIN
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_BACKEND_ORIGIN=$NUXT_BACKEND_ORIGIN
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
