FROM node:alpine AS builder

WORKDIR /landing
COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest

WORKDIR /root/
COPY --from=builder /landing/dist /usr/share/nginx/html

EXPOSE 80