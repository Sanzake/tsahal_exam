const REINFORCE_AMOUNT = 3

const findCloserToComputerHqTerritory = (territories) => {
    let closerToComputerHqTerritories = [territories[0]]
    let rangeFromComputerHQ = closerToComputerHqTerritories.distanceFromComputerHQ

    for (const t of territories.slice(1)) {

        if (t.distanceFromComputerHQ === rangeFromComputerHQ) {
            closerToComputerHqTerritories.push(t)
        } else if (t.distanceFromComputerHQ < rangeFromComputerHQ) {
            closerToComputerHqTerritories = [t]
            rangeFromComputerHQ = t.distanceFromComputerHQ
        }
    }
    return closerToComputerHqTerritories
}

const findCloserToPlayerHqTerritory = (territories) => {
    let closerToPlayerHqTerritories = [territories[0]]
    let rangeFromPlayerHQ = closerToPlayerHqTerritories[0].distanceFromPlayerHQ

    for (const t of territories.slice(1)) {
        if (t.distanceFromPlayerHQ === rangeFromPlayerHQ) {
            closerToPlayerHqTerritories.push(t)
        } else if (t.distanceFromPlayerHQ < rangeFromPlayerHQ) {
            closerToPlayerHqTerritories = [t]
            rangeFromPlayerHQ = t.distanceFromPlayerHQ
        }
    }
    return closerToPlayerHqTerritories
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
    return territoryWithMinId
}


const chooseTerritoryToReinforce = (closerToComputerHqPlayerTerritories, closerToPlayerHqComputerTerritories, closerToComputerHqComputerTerritories) =>{
    const rangeFromComputerHQ = closerToComputerHqPlayerTerritories[0].distanceFromComputerHQ
    const territoriesWithMinSoldiersValue = findTerritoryWithMinSoldiersValue(closerToComputerHqComputerTerritories)

    let territoryToReinforce;

    if (rangeFromComputerHQ <= 2) {
        console.log("defence")
        if (closerToComputerHqComputerTerritories.length === 1) {
            territoryToReinforce = closerToComputerHqComputerTerritories[0]
        } else if (territoriesWithMinSoldiersValue.length === 1) {
            territoryToReinforce = territoriesWithMinSoldiersValue[0]
        } else {
            territoryToReinforce = findMinIdTerritory(territoriesWithMinSoldiersValue)
        }
    } else {
        console.log("attack")
        const territoriesWithMaxSoldiersValue = findTerritoryWithMaxSoldiersValue(closerToPlayerHqComputerTerritories)
        if (closerToPlayerHqComputerTerritories.length === 1) {
            territoryToReinforce = closerToPlayerHqComputerTerritories[0]
        } else if (territoriesWithMaxSoldiersValue.length === 1) {
            territoryToReinforce = territoriesWithMaxSoldiersValue[0]
        } else {
            territoryToReinforce = findMinIdTerritory(territoriesWithMaxSoldiersValue)
        }
        
    }

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

    const closerToComputerHqPlayerTerritories = findCloserToComputerHqTerritory(playerTerritories)
    const closerToPlayerHqComputerTerritories = findCloserToPlayerHqTerritory(computerTerritories)
    const closerToComputerHqComputerTerritories = findCloserToComputerHqTerritory(computerTerritories)
    
    const territoryToReinforce = chooseTerritoryToReinforce(closerToComputerHqPlayerTerritories, closerToPlayerHqComputerTerritories, closerToComputerHqComputerTerritories)
    territoryToReinforce.soldiers += REINFORCE_AMOUNT
    return territories
}
