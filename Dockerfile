FROM node:alpine as build
WORKDIR '/src'

COPY ./package.json ./

RUN npm install 
COPY . .

RUN npm run build


FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]