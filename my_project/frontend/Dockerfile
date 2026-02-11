FROM node:20-bookworm AS build

WORKDIR /repo
# Copy entire repository so relative imports from frontend to game/ resolve
COPY . .

# Build the frontend inside the repo structure
WORKDIR /repo/frontend
RUN npm install --no-audit --no-fund && npm run build

FROM nginx:alpine

# Copy built site
COPY --from=build /repo/frontend/dist /usr/share/nginx/html

# Copy nginx config and certs from the repo (nginx.conf expects certs under /etc/nginx/certs)
COPY frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/certs /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
