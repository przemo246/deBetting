FROM node:16-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:prod

FROM node:16-alpine as prod
COPY --from=build /app/package*.json /
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]