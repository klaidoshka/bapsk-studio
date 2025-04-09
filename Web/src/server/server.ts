import express from "express";
import cors from "cors";
import {HtmlService} from './service/html.service';

const apiPort = process.env["PORT"] || 4000;
const apiPrefix = "/api/v1";
const application = express();

application.use(cors());
application.use(express.json());
application.use(express.text({type: "text/html"}));

application.post(`${apiPrefix}/misc/beautify-html`, (req, res) => {
  const html = req.body;

  if (!html) {
    res.status(400).send("No HTML provided.");
    return;
  }

  let result = HtmlService.beautifyHtml(html);

  result = result && HtmlService.insertTailwind(result);

  if (result === undefined) {
    res.status(500).send("Couldn't beautify HTML.");
    return;
  }

  res.set("Content-Type", "text/html");
  res.send(result);
});

application.listen(apiPort, () => console.log(`Server running at port http://localhost:${apiPort}`));
