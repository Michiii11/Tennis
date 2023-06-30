let winner;
let loser;

/**
 * todo Cleanes Design
 * todo Einzel Doppel (toggle)
 * todo Gewonnen Verloren (toggle)
 * todo mit enter calculaten
 * todo button für nächstes spiel oder neues spiel
 *
 * todo turnier calculaten
 * todo alle spieler reinhauen von nennliste
 * todo dann alle von turnierbaum
 * todo dann wird automatisch berechnet
 * todo beste turnierergebnis enditn
 */

/**
 *
 * @param p1 Player 1
 * @param p2 Player 2
 * @param sik1 Sik of player 1
 * @param sik2 Sik of player 2
 * @param hasRetired if the player has retired
 * @returns {string[]} itn of each player after the game
 */
function calcItn(p1, p2, sik1, sik2, hasRetired){
    if(hasRetired){ // Check if game has finished because of retirement
        if(winner === 1){
            p2 += 0.1;
        } else{
            p1 += 0.1;
        }
    } else{
        p1 -= 0; p2 -= 0;

        if(winner === 1){
            winner = [p1, sik1];
            loser = [p2, sik2];
        } else{
            winner = [p2, sik2];
            loser = [p1, sik1];
        }

        let x = loser[0] - winner[0];

        // Calculate Delta
        let delta = 0.250 / (1.000 + 2.595 * Math.exp(3.500*x))

        console.log(delta)
        console.log(winner[1] < loser[1] ? 2 : (winner[1] > loser[1] ? 0.5 : 1))

        winner[0] -= delta*[winner[1] < loser[1] ? 2 : (winner[1] > loser[1] ? 0.5 : 1)];
        loser[0] += delta*[winner[1] < loser[1] ? 0.5 : (winner[1] > loser[1] ? 2 : 1)];

        if(winner === 1){
            p1 = winner[0];
            p2 = loser[0];
        } else{
            p2 = winner[0];
            p1 = loser[0];
        }
    }

    console.log(p1, p2)
    return [p1.toFixed(3), p2.toFixed(3)];
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

function getITN(isSingle){
    if(isSingle){ // Single
        let s1 = parseFloat(document.getElementById("s1").value.replace(",", "."))
        let s2 = parseFloat(document.getElementById("s2").value.replace(",", "."))

        console.log(s1, s2)

        let itn = calcItn(s1, s2, 1, 1, false)
        document.querySelector(".output").innerHTML = itn[0] + " " + itn[1]
        console.log(itn[0], itn[1])
    } else{ // Double
        let d1 = document.getElementById("d1").value;
        let d2 = document.getElementById("d2").value;
        let d3 = document.getElementById("d3").value;
        let d4 = document.getElementById("d4").value;

        let itn = calcItnDoubles(d1, d2, d3, d4, false)
        console.log(itn[0], itn[1], itn[2], itn[3])
    }
}

function toggleActiveSD(elem){
    document.querySelector('.buttons .active').classList.remove("active")
    if(!elem.classList.contains("active")){
        elem.classList.add("active")
    }

    document.querySelector('.single').classList.toggle("active")
    document.querySelector('.double').classList.toggle("active")
}