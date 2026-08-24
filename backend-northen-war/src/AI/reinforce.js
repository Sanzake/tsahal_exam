const REINFORCE_AMOUNT = 3

const findCloserToComputerHqPlayerTerritory = (playerTerritories) => {
    let closerToComputerHqPlayerTerritories = [playerTerritories[0]]
    let rangeFromComputerHQ = closerToComputerHqPlayerTerritories.distanceFromComputerHQ

    for (const t of playerTerritories.slice(1)) {

        if (t.distanceFromComputerHQ === rangeFromComputerHQ) {
            closerToComputerHqPlayerTerritories.push(t)
        } else if (t.distanceFromComputerHQ < rangeFromComputerHQ) {
            closerToComputerHqPlayerTerritories = [t]
            rangeFromComputerHQ = t.distanceFromComputerHQ
        }
    }
    return closerToComputerHqPlayerTerritories
}

const findCloserToPlayerHqComputerTerritory = (computerTerritories) => {
    let closerToPlayerHqComputerTerritories = [computerTerritories[0]]
    let rangeFromPlayerHQ = closerToPlayerHqComputerTerritories[0].distanceFromPlayerHQ
    console.log(closerToPlayerHqComputerTerritories[0].distanceFromPlayerHQ)
    console.log(rangeFromPlayerHQ)

    for (const t of computerTerritories.slice(1)) {
        console.log(t.distanceFromPlayerHQ, rangeFromPlayerHQ)

        if (t.distanceFromPlayerHQ === rangeFromPlayerHQ) {
            closerToPlayerHqComputerTerritories.push(t)
        } else if (t.distanceFromPlayerHQ < rangeFromPlayerHQ) {
            closerToPlayerHqComputerTerritories = [t]
            rangeFromPlayerHQ = t.distanceFromPlayerHQ
        }
    }
    return closerToPlayerHqComputerTerritories
}

const findTerritoryWithMinSoldiersValue = (territories) => {
    let territoriesWithMinSoldiersValue = [territories[0]]
    let minSoldiersValue = territoriesWithMinSoldiersValue[0].soldiers

    for (const t of territories.slice(1)) {
        if (t.soldiers === minSoldiersValue) {
            territoriesWithMinSoldiersValue.push(t)
        } else if (t.soldiers < minSoldiersValue) {
            territoriesWithMinSoldiersValue = [t]
        }
    }
    return territoriesWithMinSoldiersValue
}

const findTerritoryWithMaxSoldiersValue = (territories) => {
    let territoriesWithMaxSoldiersValue = [territories[0]]
    let maxSoldiersValue = territoriesWithMaxSoldiersValue[0].soldiers

    for (const t of territories.slice(1)) {
        if (t.soldiers === maxSoldiersValue) {
            territoriesWithMaxSoldiersValue.push(t)
        } else if (t.soldiers > maxSoldiersValue) {
            territoriesWithMaxSoldiersValue = [t]
        }
    }
    return territoriesWithMaxSoldiersValue
}

const findMinIdTerritory = (territories) => {
    let territoryWithMinId = territories[0]
    let minId = territories[0].id

    for (const t of territories.slice(1)) {
        if (t.id < minId) {
            territoryWithMinId = t
        }
    }
}


const chooseTerritoryToReinforce = (closerToComputerHqPlayerTerritories, closerToPlayerHqComputerTerritories) =>{
    const rangeFromComputerHQ = closerToComputerHqPlayerTerritories[0].distanceFromComputerHQ
    const territoriesWithMinSoldiersValue = findTerritoryWithMinSoldiersValue(closerToComputerHqPlayerTerritories)

    let territoryToReinforce;

    if (rangeFromComputerHQ <= 2) {
        console.log("defence")
        if (closerToComputerHqPlayerTerritories.length === 1) {
            territoryToReinforce = closerToComputerHqPlayerTerritories[0]
        } else if (territoriesWithMinSoldiersValue.length === 1) {
            territoryToReinforce = territoriesWithMinSoldiersValue[0]
        } else {
            territoryToReinforce = findMinIdTerritory(territoriesWithMinSoldiersValue)
        }
    } else {
        console.log("attack")
        const territoriesWithMaxSoldiersValue = findTerritoryWithMaxSoldiersValue(closerToPlayerHqComputerTerritories)
        if (closerToPlayerHqComputerTerritories.length === 1) {
            console.log(1)
            territoryToReinforce = closerToPlayerHqComputerTerritories[0]
        } else if (territoriesWithMaxSoldiersValue.length === 1) {
            console.log(2)
            territoryToReinforce = territoriesWithMaxSoldiersValue[0]
        } else {
            console.log(3)
            territoryToReinforce = findMinIdTerritory(territoriesWithMaxSoldiersValue)
        }
        
    }
    console.log(territoryToReinforce)

    return territoryToReinforce
}


export const computerReinforce = (territories) => {
    const playerTerritories = []
    const computerTerritories = []
    
    
    for (const t of territories) {
        if (t.owner === "player") {
            playerTerritories.push(t)
        } else {
            computerTerritories.push(t)
        }
    }

    const closerToComputerHqPlayerTerritories = findCloserToComputerHqPlayerTerritory(playerTerritories)
    const closerToPlayerHqComputerTerritories = findCloserToPlayerHqComputerTerritory(computerTerritories)
    
    const territoryToReinforce = chooseTerritoryToReinforce(closerToComputerHqPlayerTerritories, closerToPlayerHqComputerTerritories)
    territoryToReinforce.soldiers += REINFORCE_AMOUNT
    return territories
}
