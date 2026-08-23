import express from "express"

import router from "./routes/games.js"
import { createStartTerritories } from "../database/db.js"

const PORT = 3001

const app = express()

app.use(express.json())

await createStartTerritories()

app.use("/games", router)

app.listen(PORT, console.log("Listenning..."))