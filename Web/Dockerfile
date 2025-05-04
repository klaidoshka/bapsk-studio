FROM node:22 AS base

WORKDIR /web
COPY package*.json ./

RUN npm install @tailwindcss/oxide-linux-x64-gnu
RUN npm install lightningcss-linux-x64-gnu
RUN npm install -g @angular/cli
RUN npm install -g tailwindcss
RUN npm install -g @tailwindcss/cli
RUN npm install -g @tailwindcss/language-server
RUN npm install

COPY . .

FROM base AS client
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000"]

FROM base AS server
EXPOSE 3000
CMD ["npm", "run", "build:start:server"]