FROM node:alpine AS frontend-builder

ENV VITE_PUBLIC_BACKEND_URL=""
ENV VITE_PUBLIC_HOST="http://<HOSTNAME>"
WORKDIR /frontend
COPY ./frontend .
RUN npm install
RUN npm run build

FROM golang:1.24 AS backend-builder

WORKDIR /backend
COPY ./backend .
COPY --from=frontend-builder /frontend/dist ./public/dist
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/stack-on

FROM alpine:latest

WORKDIR /root/
COPY --from=frontend-builder /frontend/dist ./public/dist
COPY --from=backend-builder /backend/main .
ENV PORT=8080

EXPOSE 8080
CMD ["./main"]
