import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'node:fs';
import * as https from 'node:https';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '../../dist/client/browser');

const sslOptions = {
  key: fs.readFileSync('/certs/Server.key'),
  cert: fs.readFileSync('/certs/Server.crt'),
};

app.use(express.static(dist));
app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')));

https.createServer(sslOptions, app).listen(4200);
