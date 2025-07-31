# Usa imagen oficial de Node
FROM node:18

# Crea directorio de trabajo
WORKDIR /app

# Copia archivos
COPY package*.json ./
RUN npm install
COPY . .

# Expone el puerto definido en .env
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
