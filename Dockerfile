FROM node:20-alpine
RUN mkdir /app
WORKDIR /app
ADD package.json /app
ADD . /app
RUN npm install -g pnpm
RUN npx pnpm install
EXPOSE 3000
CMD ["npm", "run", "start:dev"]