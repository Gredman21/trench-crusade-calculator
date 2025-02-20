updateTables()

function updateTables() {
    document.getElementById("overlay").style.display = "flex"
    setTimeout(() => {
        updateShortTable()
        updateLongTable()
        document.getElementById("overlay").style.display = "none"
    }, 0)
}

function updateShortTable() {
    let inputs = getInputValues()

    let shortProbabilities = getRollsPropability(inputs.diceRolllAtk, inputs.diceSumAtk, inputs.diceRollInjury, inputs.diceSumInjury, inputs.critDiceRoll, inputs.flatModifierAtk, inputs.flatModifierInjury, inputs.pickHighestAtk, inputs.pickHighestInjury, inputs.critPickHighest, inputs.guaranteedSix, 6, 2)
    document.getElementById("short-atk-fail").innerText = shortProbabilities.atk.failure
    document.getElementById("short-atk-success").innerText = shortProbabilities.atk.success
    document.getElementById("short-atk-critical").innerText = shortProbabilities.atk.criticalSuccess

    document.getElementById("short-injury-no-effect").innerText = shortProbabilities.injury.noEffect
    document.getElementById("short-injury-minor-hit").innerText = shortProbabilities.injury.minorHit
    document.getElementById("short-injury-down").innerText = shortProbabilities.injury.down
    document.getElementById("short-injury-kill").innerText = shortProbabilities.injury.outOfAction

    document.getElementById("short-1atk-hit-kill").innerText = shortProbabilities.hitKill1
    document.getElementById("short-2atk-hit-kill").innerText = shortProbabilities.hitKill2
    document.getElementById("short-3atk-hit-kill").innerText = shortProbabilities.hitKill3

    return
}

function updateLongTable() {
    let inputs = getInputValues()

    let longProbabilities = getRollsPropability(inputs.longDiceRollAtk, inputs.diceSumAtk, inputs.longDiceRollInjury, inputs.diceSumInjury, inputs.critDiceRoll, inputs.flatModifierAtk, inputs.flatModifierInjury, inputs.longPickHighestAtk, inputs.longPickHighestInjury, inputs.critPickHighest, inputs.guaranteedSix, 6, 2)
    document.getElementById("long-atk-fail").innerText = longProbabilities.atk.failure
    document.getElementById("long-atk-success").innerText = longProbabilities.atk.success
    document.getElementById("long-atk-critical").innerText = longProbabilities.atk.criticalSuccess

    document.getElementById("long-injury-no-effect").innerText = longProbabilities.injury.noEffect
    document.getElementById("long-injury-minor-hit").innerText = longProbabilities.injury.minorHit
    document.getElementById("long-injury-down").innerText = longProbabilities.injury.down
    document.getElementById("long-injury-kill").innerText = longProbabilities.injury.outOfAction

    document.getElementById("long-1atk-hit-kill").innerText = longProbabilities.hitKill1
    document.getElementById("long-2atk-hit-kill").innerText = longProbabilities.hitKill2
    document.getElementById("long-3atk-hit-kill").innerText = longProbabilities.hitKill3

    return
}

function getInputValues() {
    let diceModifierAtk = Number(document.getElementById("diceModifierAtk").value)
    let diceAddSumAtk = Number(document.getElementById("diceAddSumAtk").value)
    let diceModifierInjury = Number(document.getElementById("diceModifierInjury").value)
    let diceAddSumInjury = Number(document.getElementById("diceAddSumInjury").value)
    let longRangePenaltyAtk = Number(document.getElementById("longRangePenaltyAtk").value)
    let longRangePenaltyInjury = Number(document.getElementById("longRangePenaltyInjury").value)
    let flatModifierAtk = Number(document.getElementById("flatModifierAtk").value)
    let flatModifierInjury = Number(document.getElementById("flatModifierInjury").value)
    let critAddDiceModifier = Number(document.getElementById("critAddDiceModifier").value)

    let guaranteedSix = document.getElementById("guaranteedSix").checked
    let bloodbath = document.getElementById("bloodbath").checked

    let pickHighestAtk
    let longPickHighestAtk
    let pickHighestInjury
    let longPickHighestInjury
    let critPickHighest
    let longCritPickHighest

    let baseDiceAtk = 2
    let baseDiceInjury = 2

    if(bloodbath) {
        baseDiceInjury++
    }

    // short range atk
    if(diceModifierAtk >= 0) {
        pickHighestAtk = true
    }
    else {
        pickHighestAtk = false
    }
    let diceRolllAtk = baseDiceAtk + Math.abs(diceModifierAtk)
    let diceSumAtk = baseDiceAtk + diceAddSumAtk

    //long range atk
    let longDiceModifierAtk = diceModifierAtk + longRangePenaltyAtk
    if(longDiceModifierAtk >= 0) {
        longPickHighestAtk = true
    }
    else {
        longPickHighestAtk = false
    }
    let longDiceRollAtk = baseDiceAtk + Math.abs(longDiceModifierAtk)

    //short range injury
    if(diceModifierInjury >= 0) {
        pickHighestInjury = true
    }
    else {
        pickHighestInjury = false
    }
    let diceRollInjury = baseDiceInjury + Math.abs(diceModifierInjury)
    let diceSumInjury = baseDiceInjury + diceAddSumInjury

    //long range injury
    let longDiceModifierInjury = diceModifierInjury + longRangePenaltyInjury
    if(longDiceModifierInjury >= 0) {
        longPickHighestInjury = true
    }
    else {
        longPickHighestInjury = false
    }
    let longDiceRollInjury = baseDiceInjury + Math.abs(longDiceModifierInjury)

    //short crit injury
    let critDiceModifier = diceModifierInjury + critAddDiceModifier
    if(critDiceModifier >= 0) {
        critPickHighest = true
    }
    else {
        critPickHighest = false
    }
    let critDiceRoll = baseDiceInjury + Math.abs(critDiceModifier)

    //long crit injury
    let longCritDiceModifier = longDiceModifierInjury + critAddDiceModifier
    if(longCritDiceModifier >= 0) {
        longCritPickHighest = true
    }
    else {
        longCritPickHighest = false
    }
    let longCritDiceRoll = baseDiceInjury + Math.abs(longCritDiceModifier)

    return {
        diceRolllAtk: diceRolllAtk,
        diceSumAtk: diceSumAtk,
        diceRollInjury: diceRollInjury,
        diceSumInjury: diceSumInjury,
        longDiceRollAtk: longDiceRollAtk,
        longDiceRollInjury: longDiceRollInjury,
        critDiceRoll: critDiceRoll,
        longCritDiceRoll: longCritDiceRoll,
        flatModifierAtk: flatModifierAtk,
        flatModifierInjury: flatModifierInjury,
        guaranteedSix: guaranteedSix,
        pickHighestAtk: pickHighestAtk,
        longPickHighestAtk: longPickHighestAtk,
        pickHighestInjury: pickHighestInjury,
        longPickHighestInjury: longPickHighestInjury,
        critPickHighest: critPickHighest,
        longCritPickHighest: longCritPickHighest
    }
}

function loadRifle() {
    document.getElementById("diceModifierAtk").value = 0
    document.getElementById("diceAddSumAtk").value = 0
    document.getElementById("diceModifierInjury").value = 0
    document.getElementById("diceAddSumInjury").value = 0
    document.getElementById("longRangePenaltyAtk").value = -1
    document.getElementById("longRangePenaltyInjury").value = 0
    document.getElementById("flatModifierAtk").value = 0
    document.getElementById("flatModifierInjury").value = 0
    document.getElementById("critAddDiceModifier").value = 1
    document.getElementById("guaranteedSix").checked = false
    document.getElementById("bloodbath").checked = false

    updateTables()
}

function loadShotgun() {
    document.getElementById("diceModifierAtk").value = 1
    document.getElementById("diceAddSumAtk").value = 0
    document.getElementById("diceModifierInjury").value = 0
    document.getElementById("diceAddSumInjury").value = 0
    document.getElementById("longRangePenaltyAtk").value = 0
    document.getElementById("longRangePenaltyInjury").value = -1
    document.getElementById("flatModifierAtk").value = 0
    document.getElementById("flatModifierInjury").value = 0
    document.getElementById("critAddDiceModifier").value = 1
    document.getElementById("guaranteedSix").checked = false
    document.getElementById("bloodbath").checked = false

    updateTables()
}

function loadHeavyShotgun() {
    document.getElementById("diceModifierAtk").value = 1
    document.getElementById("diceAddSumAtk").value = 0
    document.getElementById("diceModifierInjury").value = 2
    document.getElementById("diceAddSumInjury").value = 0
    document.getElementById("longRangePenaltyAtk").value = 0
    document.getElementById("longRangePenaltyInjury").value = -2
    document.getElementById("flatModifierAtk").value = 0
    document.getElementById("flatModifierInjury").value = 0
    document.getElementById("critAddDiceModifier").value = 1
    document.getElementById("guaranteedSix").checked = false
    document.getElementById("bloodbath").checked = false

    updateTables()
}

function loadSacrificialKnife() {
    document.getElementById("diceModifierAtk").value = 0
    document.getElementById("diceAddSumAtk").value = 0
    document.getElementById("diceModifierInjury").value = 0
    document.getElementById("diceAddSumInjury").value = 0
    document.getElementById("longRangePenaltyAtk").value = 0
    document.getElementById("longRangePenaltyInjury").value = 0
    document.getElementById("flatModifierAtk").value = 0
    document.getElementById("flatModifierInjury").value = 2
    document.getElementById("critAddDiceModifier").value = 1
    document.getElementById("guaranteedSix").checked = false
    document.getElementById("bloodbath").checked = false

    updateTables()
}

function loadHellblade() {
    document.getElementById("diceModifierAtk").value = 0
    document.getElementById("diceAddSumAtk").value = 0
    document.getElementById("diceModifierInjury").value = 1
    document.getElementById("diceAddSumInjury").value = 0
    document.getElementById("longRangePenaltyAtk").value = 0
    document.getElementById("longRangePenaltyInjury").value = 0
    document.getElementById("flatModifierAtk").value = 0
    document.getElementById("flatModifierInjury").value = 0
    document.getElementById("critAddDiceModifier").value = 1
    document.getElementById("guaranteedSix").checked = false
    document.getElementById("bloodbath").checked = false

    updateTables()
}
