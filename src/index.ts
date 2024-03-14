import express from "express";

const app = express();

app.get("/", (_, res) => {
  return res.send("Hello World");
});

const run = () => {
  app.listen(3000);
  // eslint-disable-next-line no-console
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
};

run();
