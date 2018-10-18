import { readdirSync } from "fs";
import * as path from "path";
import api from "./api";
import * as mongoose from "mongoose";

const port: string = process.env.PORT || '8000';

mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true }
);

api.listen(port, (err: Error) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  const db = mongoose.connection;
  db.once("open", () => {
    const modelFilenames: string[] = readdirSync(
      path.join(__dirname, "models")
    );
    modelFilenames.map(
      (file: string): void => {
        require(`./models/${file}`);
      }
    );
    const routesFilenames: string[] = readdirSync(
      path.join(__dirname, "routes")
    );
    routesFilenames.map(
      (file: string): void => {
        require(`./routes/${file}`).default(api);
      }
    );
    console.log(`server is listening on ${port}`);
  });
  db.on("error", e => {
    console.log(e);
  });
});
