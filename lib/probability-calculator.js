/**
 * Creates an array with all possible rolls given the number of dice and dice's face
 * @param {Number} dice - Number of dice rolled per dice roll 
 * @param {Number} faces - Number of faces the dice have
 * @returns {Array} Array with all the rolls
 */
function _generateBaseRolls(dice, faces) {
    let results = [[]];
    
    for (let i = 0; i < dice; i++) {
        let newResults = [];
        for (let roll of results) {
            for (let face = 1; face <= faces; face++) {
                newResults.push([...roll, face]);
            }
        }
        results = newResults;
    }
    
    return results;
}

/**
 * Creates recursively an array with all possible rolls given the number of dice and dice's face
 * @param {Number} dice - Number of dice rolled per dice roll
 * @param {Number} faces - Number of faces the dice have
 * @param {Boolean} guaranteedSix - Whether one die should always be a 6
 * @returns {Array} Array with all the rolls
 */
function _generateAllRolls(dice, faces, guaranteedSix = false) {
    let results = []

    if (dice === 2) {
        results = baseRollDice2
    }
    else if (dice === 3) {
        results = baseRollDice3
    }
    else if (dice === 4) {
        results = baseRollDice4
    }
    else {
        let baseRollsSmall = _generateBaseRolls(2, faces)
        let baseRollsLarge = _generateAllRolls(dice - 2, faces)

        for (let smallRoll of baseRollsSmall) {
            for (let largeRoll of baseRollsLarge) {
                results.push([...smallRoll, ...largeRoll])
            }
        }
    }

    if (guaranteedSix) {
        results = results.map(roll => [...roll, 6])
    }

    return results
}

/**
 * Sums the relevant dice results of a dice roll
 * @param {Object} rolls - Object with the dice results in that roll
 * @param {Number} diceSum - Number of dice results used in the sum
 * @param {Boolean} pickHighest - Determines if the highest (true) or lowest (false) values will be used in the sum
 * @returns {Number} The sum of dice results
 */
function _getDiceSumValue(rolls, diceSum, pickHighest) {
    const selectedX = pickHighest   
        ? rolls.sort((a, b) => b - a).slice(0, diceSum)
        : rolls.sort((a, b) => a - b).slice(0, diceSum)

    return selectedX.reduce((a, b) => a + b, 0)
}

/**
 * Calculates the probability of attack, injury and hit kill
 * @param {Number} diceRollAtk - Number of dice rolled per dice roll in the attack action
 * @param {Number} diceSumAtk - Number of dice results used in the sum of the action succes chart
 * @param {Number} diceRollInjury - Number of dice rolled per dice roll in the injury roll
 * @param {Number} diceSumInjury - Number of dice results used in the sum of the injury chart
 * @param {Number} critDiceRoll - Number of dice added to the injury roll in case the attack crits
 * @param {Number} flatModifierAtk - Number added to the sum of attack roll
 * @param {Number} flatModifierInjury - Number added to the sum of injury roll
 * @param {Boolean} [pickHighestAtk=true] - Determines if the highest (true) or lowest (false) values will be used in the sum of the action succes chart
 * @param {Boolean} [pickHighestInjury=true] - Determines if the highest (true) or lowest (false) values will be used in the sum of the injury chart
 * @param {*} critPickHighest -  Determines if the highest (true) or lowest (false) values will be used in the sum of the injury chart in case the attack crits
 * @param {Boolean} [guaranteedSix=false] - Determines if one die in the injury roll is always a 6
 * @param {Number} [faces=6] - Number of faces the dice have
 * @param {Number} [decimals=4] - Number of decimal places in the probabilities
 * @returns {Object} Object with attack and injury probabilities
 */
function getRollsPropability(diceRollAtk, diceSumAtk, diceRollInjury, diceSumInjury, critDiceRoll, flatModifierAtk, flatModifierInjury, pickHighestAtk = true, pickHighestInjury = true, critPickHighest = true, guaranteedSix = false, faces = 6, decimals = 4) {
    const allRollsAtk = _generateAllRolls(diceRollAtk, faces)
    const allRollsInjury = _generateAllRolls(diceRollInjury, faces, guaranteedSix)
    const allCritRollsInjury = _generateAllRolls(critDiceRoll, faces, guaranteedSix)

    let countRanges = {
        atk: {
            failure: 0,
            success: 0,
            criticalSuccess: 0
        },
        injury: {
            noEffect: 0,
            minorHit: 0,
            down: 0,
            outOfAction: 0
        },
        hitKillNormal: 0,
        hitKillCrit: 0
    }

    for (const rollsAtk of allRollsAtk) {
        const sumAtk = _getDiceSumValue(rollsAtk, diceSumAtk, pickHighestAtk) + flatModifierAtk

        if (sumAtk <= 6) {
            countRanges.atk.failure++
        }
        else if (sumAtk >= 7 && sumAtk <= 11) {
            countRanges.atk.success++
        }
        else if (sumAtk >= 12) {
            countRanges.atk.criticalSuccess++
        }
    }

    for (const rollsInjury of allRollsInjury) {
        const sumInjury = _getDiceSumValue(rollsInjury, diceSumInjury, pickHighestInjury) + flatModifierInjury

        if (sumInjury <= 1) {
            countRanges.injury.noEffect++
        }
        else if (sumInjury >= 2 && sumInjury <= 6) {
            countRanges.injury.minorHit++
        }
        else if (sumInjury >= 7 && sumInjury <= 8) {
            countRanges.injury.down++
        }
        else if (sumInjury >= 9) {
            countRanges.injury.outOfAction++
            countRanges.hitKillNormal++
        }
    }

    for (const rollsInjury of allCritRollsInjury) {
        const sumCritInjury = _getDiceSumValue(rollsInjury, diceSumInjury, critPickHighest, true) + flatModifierInjury
    
        if (sumCritInjury >= 9) {
            countRanges.hitKillCrit++
        }
    }
    
    let probabilities = {
        atk: {},
        injury: {},
        hitKill1: 0,
        hitKill2: 0,
        hitKill3: 0
    }

    for (let range in countRanges.atk) {
        probabilities.atk[range] = ((countRanges.atk[range] / allRollsAtk.length) * 100).toFixed(decimals) + "%"
    }
    for (let range in countRanges.injury) {
        probabilities.injury[range] = ((countRanges.injury[range] / allRollsInjury.length) * 100).toFixed(decimals) + "%"
    }

    let probHitNormal = countRanges.hitKillNormal / allRollsInjury.length
    let probAtkNormal = countRanges.atk.success / allRollsAtk.length
    let probAtkHitNormal = probHitNormal * probAtkNormal

    let probHitCrit = countRanges.hitKillCrit / allCritRollsInjury.length
    let probAtkCrit = countRanges.atk.criticalSuccess / allRollsAtk.length
    let probAtkHitCrit = probHitCrit * probAtkCrit

    probabilities.hitKill1 = probAtkHitNormal + probAtkHitCrit

    probabilities.hitKill2 = probabilities.hitKill1 + probabilities.hitKill1 - probabilities.hitKill1 * probabilities.hitKill1

    probabilities.hitKill3 = probabilities.hitKill1 + probabilities.hitKill1  + probabilities.hitKill1 - probabilities.hitKill1 * probabilities.hitKill1 - probabilities.hitKill1 * probabilities.hitKill1 - probabilities.hitKill1 * probabilities.hitKill1 + probabilities.hitKill1 * probabilities.hitKill1 * probabilities.hitKill1

    probabilities.hitKill1 = (probabilities.hitKill1 * 100).toFixed(decimals) + "%"
    probabilities.hitKill2 = (probabilities.hitKill2 * 100).toFixed(decimals) + "%"
    probabilities.hitKill3 = (probabilities.hitKill3 * 100).toFixed(decimals) + "%"

    return probabilities
}
