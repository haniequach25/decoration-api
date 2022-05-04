import express from "express";
import db from "./server/db.js";
import route from "./server/routes/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import passport from './services/passport/index.js'

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);
app.use(passport.initialize())
app.use(morgan("dev"));
dotenv.config();

route(app);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listen port " + port);
});
