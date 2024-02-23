ARG F_REGISTRY

FROM ${F_REGISTRY}fxtrt-base-node:18.17.0  AS builder
ARG F_GITHUB_TOKEN
WORKDIR /usr/app
COPY . .

RUN apk update && apk add protobuf protobuf-dev grpc

RUN mkdir -p ./src/shared/schemas

RUN echo -e "@foxtrotplatform:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=$F_GITHUB_TOKEN" > .npmrc \
    && yarn install \
    && yarn build

FROM ${F_REGISTRY}fxtrt-base-node:18.17.0
WORKDIR /usr/opt/app
COPY --from=builder /usr/app ./
RUN yarn install --production && yarn cache clean
EXPOSE 3000
CMD sh -c "yarn start:prod"
