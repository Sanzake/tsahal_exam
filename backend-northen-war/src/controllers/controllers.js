import { insertStartGameStatus, selectGameStatus, reinforceGameStatus, skipAttack } from "../repository/repository.js"


export const createStartGameStatus = async (req, res) => {
    try {
        const playerName = req.body.playerName
        const gameStatus = await insertStartGameStatus(playerName)
        res.status(201).json(gameStatus[0])
    } catch (error) {
        console.error(error)
    }
}

export const getGameStatus = async (req, res) => {
    try {
        const gameId = req.params.id
        const gameStatus = await selectGameStatus(gameId)
        res.status(200).json(gameStatus)
    } catch(error) {
        console.error(error)
    }
}

export const reinforce = async (req, res) => {
    try {
        const id = req.params.id
        const territoryId = req.body.territoryId
        const reinforcedGameStatus = await reinforceGameStatus(id, territoryId)

        res.status(200).json(reinforcedGameStatus)
    } catch(error) {
        console.error(error)
    }
}

export const attack = async (req, res) => {
    try {
        const id = req.params.id
        const skip = req.body.skip

        if (skip === true) {
            const gameStatus = await skipAttack(id)
            res.status(200).json(gameStatus)
            return
        }
        const {fromId, toId, soldiers} = req.body

        res.status(200).json()
    } catch(error) {

    }
}