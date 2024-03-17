import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import jenosizeRoute from "./routes/jenosize";

const serviceAccount = require("./config/jenosize-test-9d706-firebase-adminsdk-3ruze-42ea0205a3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", jenosizeRoute);

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAuth().verifyIdToken(req.headers["goog-token"]);
    next();
  } catch (error) {
    res.statusCode = 401;
    res.send("NOT VERIFIED");
  }
};

app.get("/checkToken", authMiddleware, (_, res, next) => {
  try {
    return res.send("VERIFIED");
  } catch (error) {
    return next();
  }
});

const port = process.env.PORT || 3001;
app.listen(port);
console.log(`🚀🚀🚀 running on ${port} 🚀🚀🚀`);

export default app;
