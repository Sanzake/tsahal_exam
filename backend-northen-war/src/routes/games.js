import express from "express";
import {skipAttack }from "../repository/repository.js"
import { createStartGameStatus, getGameStatus, reinforce } from "../controllers/controllers.js";

const router = express.Router()

router.post("/", createStartGameStatus)

router.get("/:id", getGameStatus)

/*
router.post("/:id/reinforce", async (req, res) => {
    const id = req.params.id
    const territoryId = req.body.territoryId

    const gameStatus = await getGameStatus(id)
    try {
        const updatedGameStatus = await reinforce(gameStatus, territoryId)
        res.status(200).json(updatedGameStatus)
    } catch (error) {

    }
})
*/

router.post("/:id/reinforce", reinforce)

router.post("/:id/attack", async (req, res) => {
    const id = req.params.id
    const skip = req.body.skip
    if (skip === true) {
        await skipAttack(id)
        return
    }
    const fromId = req.body.fromId
    const toId = req.body.toId
    const soldiers = req.body.soldiers
    res.status(200).json(skip)


    
})

router.post("/:id/move", () => {
    const id = req.params.id
    
})
router.post("/:id/end-turn", () => {
    const id = req.params.id

})

export default router