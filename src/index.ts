import express from "express";
import cors from "cors";
import { postRouter } from "./routes/postRouter";

const app = express();

app.use(cors());

app.use(express.json());

app.listen(3003, () => console.log("Server rodando na porta 3003"));

app.use("/posts", postRouter)
