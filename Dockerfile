FROM node:latest
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

CMD ["bash", "startup.sh"]