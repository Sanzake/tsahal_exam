import "dotenv/config"
import { readFile } from 'node:fs/promises'
import { resolve } from "node:path"
import {createClient} from "@supabase/supabase-js"
import { computerReinforce } from "../AI/reinforce.js"


const supabase_url = process.env.SUPABASE_STRING
const supabase_key = process.env.SUPABASE_KEY

const supabase = createClient(supabase_url, supabase_key)
console.log("Connected to supabase!")

const BASIC_SOLDIERS_AMOUNT = 4
const HEADQURTERS_SOLDIERS_AMoUNT = 8
const REINFORCE_AMOUNT = 3
const MAP_JSON_PATH = "./map.json"


export const createStartTerritories = async () => {
    try {
        const filePath = resolve(MAP_JSON_PATH);
        const contents = await readFile(filePath, { encoding: 'utf8' });
        const jsonData = JSON.parse(contents)

        const {data, error} = await supabase
            .from("startTerritories")
            .insert(jsonData)

        if (error) {
            console.error(error)
        }
    } catch (err) {
        console.error(err.message);
    }
}

const getStartGameTerritories = async () => {
    try {
        const startTerritories = (await supabase.from("startTerritories").select()).data

        for (const t of startTerritories) {
            t.owner = t.startOwner
            t.soldiers = BASIC_SOLDIERS_AMOUNT
            if (t.headquarters) {
                t.soldiers = HEADQURTERS_SOLDIERS_AMoUNT
            }}
        return startTerritories
        } catch(error) {
            console.log(error)
        }
}

export const insertStartGameStatus = async (playerName) => {
    const startTerritories = await getStartGameTerritories()

    try {
        const {data, error} = await supabase
            .from("gameStatus")
            .insert({
                playerName: playerName,
                round: 1,
                phase: "reinforce",
                status: "playing",
                winner: null,
                territories: startTerritories
            })
            .select()
            return data
    } catch (error){
        console.error(error)
    }
}

export const selectGameStatus = async(gameId) => {
    try {
        const {data, error} = await supabase
            .from("gameStatus")
            .select()
            .eq("id", gameId)
        return data[0]
    } catch (error) {
        console.error(error)
    }
}

const isPlayersTerritory = (territories) => {
    const amountTerritories = territories.length
    let counter = 0
    for (const t of territories) {
        if (t.owner == "player") {
                counter += 1
            }
    }
    return counter === amountTerritories
}

const getTerritoryById = (territories, territoryId) => {
    for (const t of territories) {
        if (t.id === territoryId) {
            return t
        }
    }
}

export const reinforceGameStatus = async(gameId, territoryId) => {
    const gameStatus = await selectGameStatus(gameId)

    if (gameStatus.status === "playing" && gameStatus.phase === "reinforce") {
        const territories = gameStatus.territories
        const currentTerritory = getTerritoryById(territories, territoryId)

        if (isPlayersTerritory([currentTerritory])) {
            currentTerritory.soldiers += REINFORCE_AMOUNT
            
            gameStatus.phase = "attack"
            const {data, error} = await supabase
                .from("gameStatus")
                .update(gameStatus)
                .eq("id", gameStatus.id)
                .select()

            const response = {game: data[0], playerEvent: {type: "reinforce", territoryId: territoryId, soldiersAdded: REINFORCE_AMOUNT}}
            return response
        }
        
    }
}

export const skipAttack = async(gameId) => {
    try {
        const {data, error} = await supabase
            .from("gameStatus")
            .update({phase: "move"})
            .eq("id", gameId)
            .select()
        return data[0]
    } catch (error) {
        console.error(error)
    }
}

const isNeighbors = (territories, firstId, secondId) => {
    for (const t of territories) {
        if (t.id === firstId && t.neighbors.includes(secondId)) {
            return true
        }
    }
    return false
}

const combatAlgorithm = (sentSoldiers, defendingSoldiers) => {
    const attackLuck = 0.6 + Math.random() * 0.4;
    const defenseLuck = 0.6 + Math.random() * 0.4;

    const attackPower = sentSoldiers * attackLuck;
    const defensePower = defendingSoldiers * defenseLuck;

    let isAttackerWin = false

    if (attackPower > defensePower) {
        isAttackerWin = true
    }

    if (isAttackerWin) {
        const survivors = Math.max(1, Math.ceil(sentSoldiers * (attackPower - defensePower) / attackPower));
        return {isAttackerWin: isAttackerWin, survivors: survivors}
    } 

    const survivors = Math.max(1, Math.ceil(defendingSoldiers * (defensePower - attackPower) / defensePower));
    return {isAttackerWin: isAttackerWin, survivors: survivors}

    
}

export const makeAttack = async (gameId, fromId, toId, soldiers) => {
    const gameStatus = await selectGameStatus(gameId)

    if (gameStatus.status === "playing" && gameStatus.phase === "attack") {
        const territories = gameStatus.territories

        if (isNeighbors(territories, fromId, toId)) {
            const fromTerritory = getTerritoryById(territories, fromId)
            fromTerritory.soldiers -= soldiers
            const toTerritory = getTerritoryById(territories, toId)

            if (isPlayersTerritory([fromTerritory]) && !isPlayersTerritory([toTerritory])) {
                const combatResult = combatAlgorithm(soldiers, toTerritory.soldiers)
                if (combatResult.isAttackerWin) {
                    toTerritory.owner = "player"
                    toTerritory.soldiers = combatResult.survivors
                } else {
                    toTerritory.soldiers = combatResult.survivors
                }
                gameStatus.phase = "move"
                

                const {data, error} = await supabase
                    .from("gameStatus")
                    .update(gameStatus)
                    .eq("id", gameStatus.id)
                    .select()
                if (error) {
                    console.error(error)
                }
                let winner;
                if (combatResult.isAttackerWin) {
                    winner = "player"
                } else {
                    winner = "computer"
                }
                const playerEvent = {type: "attack", fromId: fromId, toId: toId, soldiers: soldiers, winner: winner}
                const response = {game: data[0], playerEvent: playerEvent}
                return response
            }
        }
    }

}

export const computerTurn = async (gameId) => {
    const gameStatus = await selectGameStatus(gameId)
    const territories = gameStatus.territories

    gameStatus.territories = computerReinforce(territories)
    // continue...

}

export const makeMove = async (gameId, fromId, toId, soldiers) => {
    const gameStatus = await selectGameStatus(gameId)

    if (gameStatus.status === "playing" && gameStatus.phase === "move") {
        const territories = gameStatus.territories

        if (isNeighbors(territories, fromId, toId)) {
            let fromTerritory = getTerritoryById(territories, fromId)
            let toTerritory = getTerritoryById(territories, toId)

            if (isPlayersTerritory([fromTerritory, toTerritory])) {
                fromTerritory -= soldiers
                toTerritory += soldiers

                const playerEvent = {game: gameStatus, fromId: fromId, toId: toId, soldiers: soldiers}
                const {data, error} = await supabase
                    .from("gameStatus")
                    .update(gameStatus)
                    .eq("id", gameStatus.id)
                    .select()
                
                // here computer make turn but its logic not finished
                const response = await computerTurn(gameId)
                response.playerEvent = playerEvent
                return response
            }
        }
    }
}

