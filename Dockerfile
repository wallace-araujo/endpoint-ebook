# Use a imagem Node.js como base
FROM node:16-bullseye-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que a aplicação irá escutar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]