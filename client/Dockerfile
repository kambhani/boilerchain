FROM node:21-alpine
WORKDIR /app
EXPOSE 5173
COPY package.json ./
RUN npm install --silent
COPY . ./
RUN npm run build
CMD ["npm", "run", "preview"]