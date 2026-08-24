import express from "express"
import router from "./routes/games.js"
import { createStartTerritories } from "./repository/repository.js"


export const app = express()

app.use(express.json())

await createStartTerritories()

app.use("/games", router)