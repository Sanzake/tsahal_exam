import "dotenv/config"
import { readFile } from 'node:fs/promises'
import { resolve } from "node:path"

import {createClient} from "@supabase/supabase-js"

const supabase_url = process.env.SUPABASE_STRING
const supabase_key = process.env.SUPABASE_KEY

const mapJsonPath = "./backend-northen-war/database/map.json"

const supabase = createClient(supabase_url, supabase_key)
console.log("Connected to supabase!")



export const createStartTerritories = async () => {
    try {
        const filePath = resolve(mapJsonPath);
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
