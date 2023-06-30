document.querySelectorAll("input").forEach((elem) => {
    elem.addEventListener("keyup", function (event) {
        handleChanges()
    })
})

function handleChanges(){
    let types = ["single", "double"]
    let itns = []
    let siks = []
    let hasRetired;
    for (let i = 0; i < types.length; i++) {
        if(document.querySelector(`.${types[i]}`).classList.contains("active")){

            let areAllInputsFilled = true;
            document.querySelectorAll(`.${types[i]} input`).forEach((elem) => {
                itns.push(elem.value)
                if(elem.value === ""){
                    areAllInputsFilled = false;
                }
            })

            document.querySelectorAll(`.${types[i]} select`).forEach((elem) => {
                siks.push(elem.selectedOptions[0].label);
            })

            if(areAllInputsFilled){
                if(types[i] === "single"){
                    let count = 0;
                    let calculatedITNs = calcItnSingle(itns[0], itns[1], siks[0], siks[1], hasRetired)
                    document.querySelectorAll(`.${types[i]} .rightSide p`).forEach((elem) => {
                        elem.innerHTML = calculatedITNs[count++]
                    })
                } else {
                    console.log(calcItnDoubles(itns[0], itns[1], itns[2], itns[3], hasRetired))
                }
            }
        }
    }
}

/**
 *
 * @param p1 Player 1
 * @param p2 Player 2
 * @param sik1 Sik of player 1
 * @param sik2 Sik of player 2
 * @param hasRetired if the player has retired
 * @returns {string[]} itn of each player after the game
 */
function calcItnSingle(p1, p2, sik1, sik2, hasRetired){
    let calculatedITNs = []
    sik1 = sik1 === "Sicher" ? 1 : 0;
    sik2 = sik2 === "Sicher" ? 1 : 0;

    if(hasRetired){ // Check if game has finished because of retirement
        calculatedITNs = [p1, p2+0.1, p1+0.1, p2];
    } else{
        p1 -= 0; p2 -= 0;

        let x1 = p2 - p1; // p1 is winner
        let x2 = p1 - p2; // p2 is winner

        // Calculate Delta
        let delta1 = 0.250 / (1.000 + 2.595 * Math.exp(3.500*x1))
        let delta2 = 0.250 / (1.000 + 2.595 * Math.exp(3.500*x2))

        calculatedITNs.push((p1-delta1*[sik1 < sik2 ? 2 : (sik1 > sik2 ? 0.5 : 1)]).toFixed(3));
        calculatedITNs.push((p1+delta2*[sik2 > sik1 ? 2 : (sik2 < sik1 ? 0.5 : 1)]).toFixed(3));
        calculatedITNs.push((p2+delta1*[sik1 > sik2 ? 2 : (sik1 < sik2 ? 0.5 : 1)]).toFixed(3));
        calculatedITNs.push((p2-delta2*[sik2 < sik1 ? 2 : (sik2 > sik1 ? 0.5 : 1)]).toFixed(3));

        if(sik1 !== sik2){
            calculatedITNs.push((delta1*[sik1 < sik2 ? 2 : (sik1 > sik2 ? 0.5 : 1)]).toFixed(3) + "/" + (delta1*[sik1 > sik2 ? 2 : (sik1 < sik2 ? 0.5 : 1)]).toFixed(3))
            calculatedITNs.push((delta1*[sik1 > sik2 ? 2 : (sik1 < sik2 ? 0.5 : 1)]).toFixed(3) + "/" + (delta1*[sik1 < sik2 ? 2 : (sik1 > sik2 ? 0.5 : 1)]).toFixed(3))
        } else{
            calculatedITNs.push(delta1.toFixed(3))
            calculatedITNs.push(delta2.toFixed(3))
        }
    }

    return calculatedITNs;
}

/**
 * Calculates the ITN of a double match
 * @param p1 Player 1
 * @param p2 Player 2
 * @param p3 Player 3
 * @param p4 Player 4
 * @param hasRetired checks if the match ends because of a retirement
 * @returns {string[]} itn of each player after the game
 */
function calcItnDoubles(p1, p2, p3, p4, hasRetired){
    if(hasRetired){  // Check if game has finished because of retirement
        if(winner === 1){
            p3 += 0.1;
            p4 += 0.1;
        } else{
            p1 += 0.1;
            p2 += 0.1;
        }
    } else{
        p1-=0;p2-=0;p3-=0;p4-=0;

        if(winner === 1){
            winner = p1+p2
            loser = p3+p4
        } else{
            winner = p3+p4
            loser = p1+p2
        }

        let x = loser - winner;

        // Calculate delta
        let delta = 0.250 / (1.000 + 2.595 * Math.exp(3.500*x))
        delta *= 0.25;

        // Add Delta
        if(winner === 1){
            p1 -= delta;
            p2 -= delta;
            p3 += delta;
            p4 += delta;
        } else{
            p1 += delta;
            p2 += delta;
            p3 -= delta;
            p4 -= delta;
        }
    }

    console.log(p1, p2, p3, p4)
    return [p1.toFixed(3), p2.toFixed(3), p3.toFixed(3), p4.toFixed(3)];
}

function toggleActiveSD(elem){
    if(elem.innerHTML === "EINZEL"){
        document.querySelector(".single").classList.add("active")
        document.querySelector(".double").classList.remove("active")
    } else{
        document.querySelector(".single").classList.remove("active")
        document.querySelector(".double").classList.add("active")
    }
}

function newGame(){
    document.querySelectorAll("input").forEach((elem) => {
        elem.value = ""
    })
}