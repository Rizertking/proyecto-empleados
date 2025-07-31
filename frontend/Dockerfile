# Etapa de build
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Configuración de Nginx (opcional)
EXPOSE 80
