import { insertStartGameStatus, selectGameStatus, reinforceGameStatus, skipAttack, makeAttack, makeMove, computerTurn } from "../repository/repository.js"


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
        const gameId = req.params.id
        const territoryId = req.body.territoryId
        const reinforcedGameStatus = await reinforceGameStatus(gameId, territoryId)

        res.status(200).json(reinforcedGameStatus)
    } catch(error) {
        console.error(error)
    }
}

export const attack = async (req, res) => {
    try {
        const gameId = req.params.id
        const skip = req.body.skip

        if (skip === true) {
            const gameStatus = await skipAttack(gameId)
            res.status(200).json(gameStatus)
            return
        }
        const {fromId, toId, soldiers} = req.body
        const gameStatus = await makeAttack(gameId, fromId, toId, soldiers)

        res.status(200).json(gameStatus)
    } catch(error) {
        console.error(error)
    }
}

export const move = async (req, res) => {
    try {
        const gameId = req.params.id
        const {fromId, toId, soldiers} = req.body
        const gameStatus = await makeMove(gameId, fromId, toId, soldiers)
        res.status(200).json(gameStatus)
    } catch(error) {
        console.error(error)
    }
}

export const endTurn = async (req, res) => {
    try {
        const gameId = req.params.id
        const gameStatus = await computerTurn(gameId)
        res.status(200).json(gameStatus)
    } catch(error) {
        console.error(error)
    }
}