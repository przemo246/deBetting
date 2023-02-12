FROM node:18.12-alpine as build
WORKDIR /app
COPY prisma ./prisma/ 
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:18.12-alpine as prod
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/prisma ./prisma/ 
COPY --from=build /app/dist ./dist
RUN npx prisma generate
EXPOSE 3030
CMD ["npm", "run", "start:prod:setup"]