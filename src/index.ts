import express from "express"
import cors from "cors"
import { postRouter } from "./routers/postRouter"
import dotenv from 'dotenv'
import { userRouter } from "./routers/userRouter"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
console.log(`Servidor rodando na porta ${process.env.PORT}`)
})

app.use("/posts", postRouter)
app.use("/user", userRouter)