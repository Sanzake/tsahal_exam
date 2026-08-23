import "dotenv/config"

import {createClient} from "@supabase/supabase-js"

const supabase_url = process.env.SUPABASE_STRING
const supabase_key = process.env.SUPABASE_KEY

const supabase = createClient(supabase_url, supabase_key)
console.log("Connected to supabase!")

const BASIC_SOLDIERS_AMOUNT = 4
const HEADQURTERS_SOLDIERS_AMoUNT = 8
const REINFORCE_AMOUNT = 3

export const createGameStatus = async (playerName) => {
    try {
        const startTerritories = (await supabase.from("startTerritories").select()).data
        for (const t of startTerritories) {
            t.owner = t.startOwner
            t.soldiers = BASIC_SOLDIERS_AMOUNT
            if (t.headquarters) {
                t.soldiers = HEADQURTERS_SOLDIERS_AMoUNT
            }
        }

        const {data, error} = await supabase
        .from("gameStatus")
        .insert({
            playerName: playerName,
            round: 1,
            phase: "reinforce",
            status: "playing",
            winner: null,
            territories: startTerritories,
            computerEvents: []
        })
        .select()
        return data
    } catch (error){
        console.error(error)
    }
}

export const getGameStatus = async(gameID) => {
    try {
        const {data, error} = await supabase
            .from("gameStatus")
            .select()
            .eq("id", gameID)
        return data[0]
    } catch (error) {
        console.error(error)
    }
}

export const reinforce = async(gameStatus, territoryId) => {
    if (gameStatus.status === "playing" && gameStatus.phase === "reinforce") {
        const territories = gameStatus.territories
        for (const t of territories) {
            if (t.id == territoryId && t.owner == "player") {
                t.soldiers += REINFORCE_AMOUNT
                
                gameStatus.phase = "attack"
                const {data, error} = await supabase
                    .from("gameStatus")
                    .update(gameStatus)
                    .eq("id", gameStatus.id)
                return gameStatus
            }
        }
    }
}