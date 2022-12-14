FROM rust:1.65 AS wasm_builder
WORKDIR /wasm
RUN git clone https://github.com/sine-fdn/tandem.git
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
RUN wasm-pack build ./tandem/tandem_http_client --target web

FROM node:16.14.0-alpine3.14 AS node_modules
WORKDIR /app
COPY --from=wasm_builder /wasm/tandem/tandem_http_client/pkg ./src/pkg
COPY package-lock.json package.json ./
RUN npm install
COPY . .

FROM node_modules AS prod_builder
RUN npm run build

## Production image
FROM nginx:1.20.2-alpine AS prod
COPY docker/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /app/build /usr/share/nginx/html
COPY docker/build_system.sh .
RUN ./build_system.sh && rm ./build_system.sh
# port use by Nginx within docker network.
EXPOSE 8080

## Development image
FROM node_modules AS dev
EXPOSE 3000
CMD npm run start
