import express from "express";
import {createGameStatus, getGameStatus, reinforce }from "../repository/gameStatusLogic.js"

const router = express.Router()


router.post("/", async (req, res) => {
    const playerName = req.body.playerName

    const data = await createGameStatus(playerName)
    console.log(data)
    res.status(201).json(data[0])
})

router.get("/:id", async (req, res) => {
    const id = req.params.id

    const gameStatus = await getGameStatus(id)
    res.status(200).json(gameStatus)
})

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

router.post("/:id/attack", async (req, res) => {
    const id = req.params.id
    const skip = req.body.skip
    if (skip === true) {
        console.log(111)
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