import dotenv from "dotenv";
import { app } from "./app";
import { getPgVersion } from "./db";

dotenv.config();

const port = process.env.PORT || 5000;
getPgVersion()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err: any) => {
    console.log("failed to run server", err)
  })
