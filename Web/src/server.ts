import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from "@angular/ssr/node";
import express from "express";

const port = process.env["PORT"] || 4000;
const url = `http://localhost:${port}`;
const application = express();
const angularEngine = new AngularNodeAppEngine();

/**
 * Handle all other requests by rendering the Angular application.
 */
application.use("/**", (req, res, next) => {
  angularEngine
  .handle(req)
  .then((response) =>
    response ? writeResponseToNodeResponse(response, res) : next()
  )
  .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  application.listen(port, () => {
    console.log(`Server running at ${url}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(application);
