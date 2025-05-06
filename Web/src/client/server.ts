import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import fs from "node:fs";
import os from "os";
import * as https from "node:https";

const directory = path.dirname(fileURLToPath(import.meta.url));
const ui = path.join(directory, "../../dist/client/browser");
const sslEnabled = process.env["SSL__ENABLED"] === "true";
const port = process.env["CLIENT__PORT"] ?? 4200;

const sslOptions = {
  key: fs.readFileSync(process.env["SSL__KEY"] ?? ""),
  cert: fs.readFileSync(process.env["SSL__CERTIFICATE"] ?? "")
};

const app = express();

app.use(express.static(ui));
app.get("*", (_, res) => res.sendFile(path.join(ui, "index.html")));

const informIp = () => {
  const ip = os.networkInterfaces()?.["en0"]?.find((iface) => iface.family === "IPv4")?.address || "localhost";
  console.log(`Server is running on http://${ip}:${port}`);
}

if (sslEnabled) {
  https.createServer(sslOptions, app).listen(port, () => informIp());
} else {
  app.listen(port, () => informIp());
}
