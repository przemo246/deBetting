import express from "express";
import cors from "cors";
import betRouter from "./api/bet/betRouter";
import authRouter from "./api/auth/authRouter";
import fixtureRouter from "./api/fixture/fixtureRouter";
import { syncEndingFixtures, syncFixtures } from "./api/fixture/fixtureService";
import cron from 'node-cron';

const app = express();
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${req.method} -> ${req.originalUrl}`);
  next();
});

app.use("/bet", betRouter);
app.use("/auth", authRouter);
app.use("/fixture", fixtureRouter);

// every night at midnight
cron.schedule("* 0 * * *", syncFixtures);
// every 5 minutes
cron.schedule("*/5 * * * *", syncEndingFixtures);

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
