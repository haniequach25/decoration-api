import mongoose from "mongoose";

const urlMongodb =
  process.env.MONGODB_URL || "mongodb://localhost/decoration_api";
mongoose.connect(urlMongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("connection successfully");
});

export default db;
