function updateTables() {
    updateShortTable()
    updateLongTable()
}

function updateShortTable() {
    let dicePlayedAtk = document.getElementById("dicePlayedAtk").value
    let diceSumAtk = document.getElementById("diceSumAtk").value
    let dicePlayedInjury = document.getElementById("dicePlayedInjury").value
    let diceSumInjury = document.getElementById("diceSumInjury").value

    let guaranteedSix = document.getElementById("guaranteedSix").value
    guaranteedSix = guaranteedSix === "on" ? true : false

    let pickHighestAtk
    let pickHighestInjury

    if(dicePlayedAtk >= 0) {
        pickHighestAtk = true
    }
    else {
        pickHighestAtk = false
    }
    dicePlayedAtk = 2 + Math.abs(dicePlayedAtk)

    if(dicePlayedInjury >= 0) {
        pickHighestInjury = true
    }
    else {
        pickHighestInjury = false
    }
    dicePlayedInjury = 2 + Math.abs(dicePlayedInjury)

    let probabilities = getRollsPropability(dicePlayedAtk, diceSumAtk, dicePlayedInjury, diceSumInjury, 1, pickHighestAtk, pickHighestInjury, guaranteedSix, 6, 2)
    document.getElementById("short-atk-fail").innerText = probabilities.atk.failure
    document.getElementById("short-atk-success").innerText = probabilities.atk.success
    document.getElementById("short-atk-critical").innerText = probabilities.atk.criticalSuccess

    document.getElementById("short-injury-no-effect").innerText = probabilities.injury.noEffect
    document.getElementById("short-injury-minor-hit").innerText = probabilities.injury.minorHit
    document.getElementById("short-injury-down").innerText = probabilities.injury.down
    document.getElementById("short-injury-kill").innerText = probabilities.injury.outOfAction

    document.getElementById("short-hit-kill").innerText = probabilities.hitKill
    return
}

function updateLongTable() {
    let dicePlayedAtk = document.getElementById("dicePlayedAtk").value
    let diceSumAtk = document.getElementById("diceSumAtk").value
    let dicePlayedInjury = document.getElementById("dicePlayedInjury").value
    let diceSumInjury = document.getElementById("diceSumInjury").value

    let guaranteedSix = document.getElementById("guaranteedSix").value
    guaranteedSix = guaranteedSix === "on" ? true : false

    let pickHighestAtk
    let pickHighestInjury

    if(dicePlayedAtk >= 0) {
        pickHighestAtk = true
    }
    else {
        pickHighestAtk = false
    }
    dicePlayedAtk = 2 + Math.abs(dicePlayedAtk)

    if(dicePlayedInjury >= 0) {
        pickHighestInjury = true
    }
    else {
        pickHighestInjury = false
    }
    dicePlayedInjury = 2 + Math.abs(dicePlayedInjury)

    let longProbabilities = getRollsPropability(dicePlayedAtk, diceSumAtk, dicePlayedInjury, diceSumInjury, 1, pickHighestAtk, pickHighestInjury, guaranteedSix, 6, 2)
    document.getElementById("long-atk-fail").innerText = longProbabilities.atk.failure
    document.getElementById("long-atk-success").innerText = longProbabilities.atk.success
    document.getElementById("long-atk-critical").innerText = longProbabilities.atk.criticalSuccess

    document.getElementById("long-injury-no-effect").innerText = longProbabilities.injury.noEffect
    document.getElementById("long-injury-minor-hit").innerText = longProbabilities.injury.minorHit
    document.getElementById("long-injury-down").innerText = longProbabilities.injury.down
    document.getElementById("long-injury-kill").innerText = longProbabilities.injury.outOfAction

    document.getElementById("long-hit-kill").innerText = longProbabilities.hitKill
    return
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateTables)
})

updateTables()
