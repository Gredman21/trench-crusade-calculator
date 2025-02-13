/**
 * Creates an array with all possible rolls given the number of dice and dice's face
 * @param {Number} dice - Number of dice rolled per dice roll
 * @param {Number} faces - Number of faces the dice have
 * @returns {Object} Object with all the rolls
 */
function _generateAllRolls(dice, faces) {
    let results = []

    function helper(current) {
        if (current.length === dice) {
            results.push([...current])
            return
        }
        for (let i = 1; i <= faces; i++) {
            current.push(i)
            helper(current)
            current.pop()
        }
    }

    helper([])
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
 * Calculates the probability of the attack and injury results and probability of hit kill
 * @param {Number} diceRollAtk - Number of dice rolled per dice roll in the attack action
 * @param {Number} diceSumAtk - Number of dice results used in the sum of the action succes chart
 * @param {Number} diceRollInjury - Number of dice rolled per dice roll in the injury roll
 * @param {Number} diceSumInjury - Number of dice results used in the sum of the injury chart
 * @param {Number} critRollAdd - Number of dice added to the roll in the event of a critical success in the attack
 * @param {Boolean} [pickHighestAtk=true] - Determines if the highest (true) or lowest (false) values will be used in the sum of the action succes chart
 * @param {Boolean} [pickHighestInjury=true] - Determines if the highest (true) or lowest (false) values will be used in the sum of the injury chart
 * @param {Number} [faces=6] - Number of faces the dice have
 * @param {Number} [decimals=4] - Number of decimal places in the probabilities
 * @returns {Object} Object with attack and injury probabilities
 */
function getRollsPropability(diceRollAtk, diceSumAtk, diceRollInjury, diceSumInjury, critRollAdd, pickHighestAtk = true, pickHighestInjury = true, faces = 6, decimals = 4) {
    const allRollsAtk = _generateAllRolls(diceRollAtk, faces)
    const allRollsInjury = _generateAllRolls(diceRollInjury, faces)
    const rollInjuryLength = allRollsAtk.length * allRollsInjury.length

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
        hitKill: 0
    }

    for (const rollsAtk of allRollsAtk) {
        const sumAtk = _getDiceSumValue(rollsAtk, diceSumAtk, pickHighestAtk)

        if (sumAtk <= 6) {
            countRanges.atk.failure++

            for (const rollsInjury of allRollsInjury) {
                const sumInjury = _getDiceSumValue(rollsInjury, diceSumInjury, pickHighestInjury)

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
                }
            }
        }
        else if (sumAtk >= 7 && sumAtk <= 11) {
            countRanges.atk.success++

            for (const rollsInjury of allRollsInjury) {
                const sumInjury = _getDiceSumValue(rollsInjury, diceSumInjury, pickHighestInjury)

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
                    countRanges.hitKill++
                }
            }
        }
        else if (sumAtk >= 12) {
            countRanges.atk.criticalSuccess++

            for (const rollsInjury of allRollsInjury) {
                let adjustedDiceRoll = diceRollInjury
                adjustedDiceRoll += pickHighestInjury ? critRollAdd : -1*critRollAdd
                const sumInjury = _getDiceSumValue(rollsInjury, adjustedDiceRoll, pickHighestInjury)

                if (sumInjury <= 1) {
                    console.log("critico" + sumInjury)
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
                    countRanges.hitKill++
                }
            }
        }
    }

    let probabilities = {
        atk: {},
        injury: {},
        hitKill: 0
    }

    for (let range in countRanges.atk) {
        probabilities.atk[range] = ((countRanges.atk[range] / allRollsAtk.length) * 100).toFixed(decimals) + "%"
    }
    for (let range in countRanges.injury) {
        probabilities.injury[range] = ((countRanges.injury[range] / rollInjuryLength) * 100).toFixed(decimals) + "%"
    }
    probabilities.hitKill = ((countRanges.hitKill/ rollInjuryLength) * 100).toFixed(decimals) + "%"

    return probabilities
}

const dicePlayedAtk = 4
const diceSumAtk = 2
const dicePlayedInjury = 2
const diceSumInjury = 2

var stats = {}

stats = getRollsPropability(dicePlayedAtk, diceSumAtk, dicePlayedInjury, diceSumInjury, 1, true, true)

console.log(stats)