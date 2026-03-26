# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source and fix execute permissions (Windows -> Linux issue)
COPY . .
RUN chmod +x node_modules/.bin/vite

# Build production bundle
RUN npm run build

# ---- Serve Stage ----
# Nginx serves the static build output
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
