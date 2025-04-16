import express from "express";
import cors from "cors";
import {HtmlService} from './service/html.service';

const apiPort = process.env["PORT"] || 4000;
const apiPrefix = "/api/v1";
const application = express();

application.use(cors());
application.use(express.json());
application.use(express.text({type: "text/html"}));

application.post(`${apiPrefix}/misc/beautify-html-table`, (req, res) => {
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

application.listen(apiPort, () => console.log(`Server running at port http://localhost:${apiPort}`));
