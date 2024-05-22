FROM public.ecr.aws/v2t1l8t3/node:14-alpine
RUN mkdir /app
WORKDIR /app
ADD package.json /app
ADD . /app
RUN npm install
EXPOSE 5000 4000
CMD ["npm", "run", "dev"]