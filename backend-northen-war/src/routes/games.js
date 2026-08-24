import express from "express";
import { createStartGameStatus, getGameStatus, reinforce, attack, move, endTurn } from "../controllers/controllers.js";

const router = express.Router()

router.post("/", createStartGameStatus)

router.get("/:id", getGameStatus)

router.post("/:id/reinforce", reinforce)

router.post("/:id/attack", attack)

router.post("/:id/move", move)

router.post("/:id/end-turn", endTurn)

export default router