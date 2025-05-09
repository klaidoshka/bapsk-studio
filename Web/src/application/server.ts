import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import fs from "node:fs";
import cors from "cors";
import * as https from "node:https";
import {HtmlService} from './service/html.service';
import {HelperUtil} from "./util/helper.util";

const routes = {
  beautifyHtmlTable: '/api/v1/misc/beautify-html-table',
  root: '*'
};

const sslEnabled = process.env["SSL__ENABLED"] === "true";
const port = process.env["SERVER__PORT"] ?? 4200;
const directory = path.dirname(fileURLToPath(import.meta.url));
const UI = path.join(directory, "../../dist/application/browser");

const sslOptions = {
  key: fs.readFileSync(process.env["SSL__KEY"] ?? ""),
  cert: fs.readFileSync(process.env["SSL__CERTIFICATE"] ?? "")
};

const corsSettings = cors(
  {
    origin: process.env["SERVER__CORS_ORIGINS"]?.split(",") || "*",
    credentials: true
  }
);

const application = express();

application.use('/api', corsSettings);
application.use(express.json());
application.use(express.text({ type: "text/html" }));
application.use(express.static(UI));

application.get(routes.root, (_, res) => res.sendFile(path.join(UI, "index.html")));

application.post(routes.beautifyHtmlTable, (request, response) => {
  const html = request.body;

  if (!html) {
    response.status(400).send("No html provided.");
    return;
  }

  try {
    let result = HtmlService.beautifyTable(html);

    result = result && HtmlService.insertTailwind(result);

    if (result === undefined) {
      response.status(400).send("Couldn't beautify table for html.");
      return;
    }

    response.set("Content-Type", "text/html");
    response.send(result);
  } catch (e: Error | any) {
    response.status(400).send(e?.message || e);
  }
});

if (sslEnabled) {
  https
    .createServer(sslOptions, application)
    .listen(port, () => console.log(HelperUtil.getIp(true, port)));
} else {
  application.listen(port, () => console.log(HelperUtil.getIp(false, port)));
}
