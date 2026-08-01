FROM node:22-alpine AS base
WORKDIR /app

ARG NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_OPTIONS=${NODE_OPTIONS}

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM deps AS development
# pg_restore/psql for `npm run geo:db:restore` inside the app container
RUN apk add --no-cache postgresql-client
COPY . .
EXPOSE 3000
CMD ["yarn", "start:dev"]

FROM deps AS build
ARG NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_OPTIONS=${NODE_OPTIONS}
COPY . .
RUN yarn prisma:generate
RUN yarn build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ARG NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_OPTIONS=${NODE_OPTIONS}

RUN apk add --no-cache openssl libc6-compat

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true \
  && yarn add prisma@7.8.0 --exact \
  && yarn cache clean

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 8567
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
