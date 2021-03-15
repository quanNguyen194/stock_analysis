FROM node:13-alpine

WORKDIR /app

COPY yarn.lock ./yarn.lock

RUN yarn install

COPY . .

RUN yarn build

# Development
CMD ["yarn", "start"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
