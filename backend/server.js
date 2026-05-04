import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Notes from "./Controller/Notes.js";
import {connectdb} from "./config/db.js"
dotenv.config();

const app = express();

app.use(cors({
    origin: "*"
}));


app.use(express.json());




app.use("/api/notes",Notes)



connectdb()
  .then(() => {
    app.listen(3001, () => {
      console.log("🚀 Server is running on Port:3001");
    });
  })
  .catch((err) => {
    console.log("❌ DB Connection Failed:", err.message);
  });