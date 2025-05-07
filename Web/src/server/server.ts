import express from "express";
import cors from "cors";
import {HtmlService} from './service/html.service';
import os from "os";
import fs from 'node:fs';
import https from 'node:https';

const routes = {
  beautifyHtmlTable: "/api/v1/misc/beautify-html-table",
};

const port = process.env["WEB__SERVER__PORT"] ?? 3000;
const sslEnabled = process.env["SSL__ENABLED"] === "true";

const sslOptions = {
  key: fs.readFileSync(process.env["SSL__KEY"] ?? ""),
  cert: fs.readFileSync(process.env["SSL__CERTIFICATE"] ?? "")
};

const application = express();

application.use(cors(
  {
    origin: process.env["WEB__SERVER__CORS_ORIGINS"]?.split(",") || "*",
    methods: ["POST", "OPTIONS"],
    credentials: true
  }
));

application.use(express.json());
application.use(express.text({type: "text/html"}));

application.post(routes.beautifyHtmlTable, (req, res) => {
  const html = req.body;

  if (!html) {
    res.status(400).send("No html provided.");
    return;
  }

  try {
    let result = HtmlService.beautifyTable(html);

    result = result && HtmlService.insertTailwind(result);

    if (result === undefined) {
      res.status(400).send("Couldn't beautify table for html.");
      return;
    }

    res.set("Content-Type", "text/html");
    res.send(result);
  } catch (e: Error | any) {
    res.status(400).send(e?.message || e);
  }
});

const informIp = () => {
  const ip = os.networkInterfaces()?.["en0"]?.find((iface) => iface.family === "IPv4")?.address || "localhost";
  const host = `${sslEnabled ? "https" : "http"}://${ip}:${port}`;
  console.log(host);
}

if (sslEnabled) {
  https.createServer(sslOptions, application).listen(port, () => informIp());
} else {
  application.listen(port, () => informIp());
}

