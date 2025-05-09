FROM node:22

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

CMD ["npm", "run", "build:start"]
