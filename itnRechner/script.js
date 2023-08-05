/***** General *****/
//region general
let currMode = "NORMAL"

function selectNavigation(elem){
    document.querySelector("nav .buttons .active").classList.remove("active")
    elem.classList.add("active")
    currMode = elem.innerHTML

    document.querySelector("main > section.active").classList.remove("active")
    document.querySelector(`section.${currMode.toLowerCase()}`).classList.add("active")
}
//endregion

/***** Normal ITN Rechner *****/
//region normal itn rechner
let activeType = "s" // s or d for single or double

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
                let calculatedITNS
                if(types[i] === "single"){
                    calculatedITNs = calcItnSingle(itns[0], itns[1], siks[0], siks[1], hasRetired)
                } else {
                    calculatedITNs = calcItnDoubles(itns[0], itns[1], itns[2], itns[3], hasRetired)
                }

                let count = 0;
                document.querySelectorAll(`.${types[i]} .rightSide p`).forEach((elem) => {
                    elem.innerHTML = calculatedITNs[count++]
                })
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

        // Add delta
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
    let calculatedITNs = []

    if(hasRetired){ // Check if game has finished because of retirement
        calculatedITNs = [p1, p2, p3+0.1, p4+0.1, p1+0.1, p2+0.1, p3, p4];
    } else{
        p1-=0;p2-=0;p3-=0;p4-=0;

        let x1 = (p1+p2) - (p3+p4); // Team 2 is winner
        let x2 = (p3+p4) - (p1+p2); // Team 1 is winner

        // Calculate delta
        let delta1 = (0.250 / (1.000 + 2.595 * Math.exp(3.500*x1))) * 0.25
        let delta2 = (0.250 / (1.000 + 2.595 * Math.exp(3.500*x2))) * 0.25

        // Add Delta
        calculatedITNs = [
            (p1-delta1).toFixed(3), (p1+delta2).toFixed(3),
            (p2-delta1).toFixed(3), (p2+delta2).toFixed(3),
            (p3+delta1).toFixed(3), (p3-delta2).toFixed(3),
            (p4+delta1).toFixed(3), (p4-delta2).toFixed(3),
            delta1.toFixed(3), delta2.toFixed(3)
        ]
    }
    return calculatedITNs;
}

function toggleActiveSD(elem){
    console.log(elem)
    let itn1 = elem.closest(".leftSide").querySelectorAll("input")[0].value
    let itn2 = elem.closest(".leftSide").querySelectorAll("input")[activeType === "s" ? 1 : 2].value

    console.log(itn1, itn2)
    if(elem.innerHTML === "EINZEL"){
        activeType = "s"
        document.querySelector(".single").classList.add("active")
        document.querySelector(".single").querySelectorAll("input")[0].value = itn1;
        document.querySelector(".single").querySelectorAll("input")[1].value = itn2;
        document.querySelector(".double").classList.remove("active")
    } else{
        activeType = "d"
        document.querySelector(".single").classList.remove("active")
        document.querySelector(".double").classList.add("active")
        document.querySelector(".double").querySelectorAll("input")[0].value = itn1;
        document.querySelector(".double").querySelectorAll("input")[2].value = itn2;
    }
}

function newGame(){
    document.querySelectorAll("input").forEach((elem) => {
        elem.value = ""
    })
}

function continueWithWinOrLose(wOl){
    let newITN = document.querySelector(`.${activeType}${wOl}`).innerHTML
    newGame();
    document.querySelector(`.${activeType}ITN`).value = newITN
}
//endregion

/***** Tournament ITN Rechner *****/
//region tournament itn rechner
updateTournamentDraw()
function updateTournamentDraw(){
    let tournamentBox = document.querySelector(".tournamentDraw")
    tournamentBox.innerHTML = ""

    let currMatches = document.querySelector("#tournamentMode").value
    while(currMatches/2 >= 1){
        currMatches = currMatches / 2
        let temp = "<div>"
        for (let i = 0; i < currMatches; i++) {
            temp += "<div>"
            for (let j = 0; j < 2; j++) {
                temp += "<div class=\"itnField\">" +
                    "<input type=\"number\" class=\"sITN\" placeholder=\"Deine ITN\">" +
                    "<select name=\"sik1\" id=\"sikS1\" onchange=\"handleChanges()\">" +
                    "    <option value=\"true\">Sicher</option>" +
                    "    <option value=\"false\">Nicht Sicher</option>" +
                    "</select>" +
                    "</div>"
            }
            temp += "</div>"
        }
        temp += "</div>"
        tournamentBox.innerHTML += temp
    }

}
//endregion

/***** Championship ITN Rechner *****/
//region championship itn rechner
updateGamesChampionship(null)
function updateGamesChampionship(type){ // type: 0 == SINGLE | 1 == DOUBLE
    if(type === 0 || type === null){
        let singleBox = document.querySelector(".singleM")
        singleBox.innerHTML = ""
        for (let i = 0; i < document.querySelector("#einzelAnz").value; i++) {
            let temp = "<div>"
            for (let j = 0; j < 2; j++) {
                temp += "<div class=\"itnField\">" +
                    "<input type=\"number\" class=\"sITN\" placeholder=\"Deine ITN\">" +
                    "<select name=\"sik1\" id=\"sikS1\" onchange=\"handleChanges()\">" +
                    "    <option value=\"true\">Sicher</option>" +
                    "    <option value=\"false\">Nicht Sicher</option>" +
                    "</select>" +
                    "</div>"
            }
            temp += "</div>"
            singleBox.innerHTML += temp
        }
    }

    if(type === 1 || type === null){
        let doubleBox = document.querySelector(".doubleM")
        doubleBox.innerHTML = ""
        for (let i = 0; i < document.querySelector("#doppelAnz").value; i++) {
            let temp = "<div>"
            for (let j = 0; j < 2; j++) {
                temp += "<div class='doublePair'>"
                for (let k = 0; k < 2; k++) {
                    temp += "<div class=\"itnField\">" +
                            "<input type=\"number\" class=\"sITN\" placeholder=\"Deine ITN\">" +
                        "</div>"
                }
                temp += "</div>"
            }
            temp += "</div>"
            doubleBox.innerHTML += temp
        }
    }
}
//endregion