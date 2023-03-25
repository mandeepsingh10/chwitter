FROM node:14.21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install prisma
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev"]
