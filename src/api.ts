import * as express from "express";
import * as cors from "cors";
import * as compression from "compression";
import * as jwt from "express-jwt";
import * as bodyParser from "body-parser";

const api = express();

api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.use(
  jwt({
    secret: "wack"
  }).unless({
    path: ["/auth", /users\/?.*/, /beers\/?.*/, /breweries\/?.*/]
  })
);

api.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
        error: "Invalid Auth"
      });
    }
  }
);

export default api;
