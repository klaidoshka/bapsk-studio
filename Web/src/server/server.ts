import express from "express";
import cors from "cors";
import {HtmlService} from './service/html.service';
import os from "os";

const apiPort = process.env["WEB__SERVER__PORT"] || 3000;
const application = express();

const routes = {
  beautifyHtmlTable: "/api/v1/misc/beautify-html-table",
};

application.use(cors(
  {
    origin: process.env["WEB__SERVER__CORS_ORIGINS"]?.split(",") || "*",
    methods: ["POST", "OPTIONS"],
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

application.listen(apiPort, () => {
  const ip = os.networkInterfaces()?.["en0"]?.find((iface) => iface.family === "IPv4")?.address || "localhost";
  console.log(`Server is running on http://${ip}:${apiPort}`);
});
