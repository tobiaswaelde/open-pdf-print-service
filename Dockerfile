# ### ####################
# ### BUILDER
# ### ####################
# FROM node:lts-alpine AS builder

# # set working directory
# WORKDIR /app

# # install dependencies
# RUN apk update && apk add --no-cache yarn

# # install app dependencies
# COPY package.json /app/package.json
# RUN ["yarn", "install"]

# # copy source code & DB schema
# COPY . /app

# # generate Prisma client types
# RUN ["yarn", "prisma", "generate"]

# # build app
# RUN ["yarn", "build"]



# ### ####################
# ### RUNNER
# ### ####################
# FROM node:lts-alpine AS runner

# # install dependencies for healthcheck
# RUN apk update && apk add --no-cache curl

# # We don't need the standalone Chromium
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # Install Chromium
# RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

# # set working directory
# WORKDIR /app

# # copy compiled app from builder stage
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules

# # export application port
# ENV PORT=3001
# EXPOSE $PORT

# # enable health check
# HEALTHCHECK CMD sh -c "curl -f http://localhost:$PORT/api/health || exit 1"

# # start app
# CMD ["yarn", "start:prod"]


FROM node:lts-alpine
RUN apk add yarn curl

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Chromium
RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

WORKDIR /app

# install production dependencies only
COPY package.json /app/package.json
RUN ["yarn", "install"]

# build app
COPY . /app
ENV NODE_ENV=production
RUN ["yarn", "build"]

ENV PORT=3001
EXPOSE 3001

# enable health check
HEALTHCHECK CMD sh -c "curl -f http://localhost:$PORT/api/health || exit 1"

# start app
CMD ["sh", "-c", "yarn start:prod"]