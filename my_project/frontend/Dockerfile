FROM node:20-alpine
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install
ARG VITE_API_URL=backend
ENV VITE_API_URL=${VITE_API_URL}
CMD ["npm", "run", "dev"]