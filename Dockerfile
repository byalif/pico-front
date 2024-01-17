FROM node:13.12.0-alpine as build
WORKDIR /src
ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./

RUN npm install --silent
COPY . ./

RUN npm run build
FROM nginx:alpine
COPY --from=build /src/build /usr/share/nginx/html
EXPOSE 80