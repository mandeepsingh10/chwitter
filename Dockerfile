FROM node:14.21

WORKDIR /usr/src/app

ENV DATABASE_URL "mongodb://root:prisma@mongodb-primary:27017/test?authSource=admin&retryWrites=false"

ENV NEXTAUTH_SECRET "secret"

ENV NEXTAUTH_JWT_SECRET "secret"

COPY package*.json ./

RUN npm install \
    npm install prisma
COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]
