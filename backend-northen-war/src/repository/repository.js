import "dotenv/config"
import { readFile } from 'node:fs/promises'
import { resolve } from "node:path"

import {createClient} from "@supabase/supabase-js"

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
        const {data, error} = await supabase.from("startTerritories")
        .insert(jsonData)
        if (error) {
            console.error(error)
        }
    } catch (err) {
        console.error(err.message);
    }
}

/*
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
*/


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
                territories: startTerritories,
                computerEvents: []
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





export const reinforceGameStatus = async(gameId, territoryId) => {
    const gameStatus = await selectGameStatus(gameId)
    console.log(gameId, territoryId)
    console.log(gameStatus.status, gameStatus.phase)


    if (gameStatus.status === "playing" && gameStatus.phase === "reinforce") {
        console.log(1)
        const territories = gameStatus.territories
        for (const t of territories) {

            console.log(t.id, t.ow)
            if (t.id == territoryId && t.owner == "player") {
                t.soldiers += REINFORCE_AMOUNT
                
                gameStatus.phase = "attack"
                const {data, error} = await supabase
                    .from("gameStatus")
                    .update(gameStatus)
                    .eq("id", gameStatus.id)
                    .select()
                console.log(data[0])
                console.log(gameStatus)
                return data[0]
            }
        }
    }
}

export const skipAttack = async(gameID) => {
    try {
        const {data, error} = await supabase
            .from("gameStatus")
            .select()
            .eq("id", gameID)
        const gameStatus = data[0]
        console.log(gameStatus)
    } catch (error) {
        console.error(error)
    }
}