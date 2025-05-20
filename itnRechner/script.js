let activeType = "S"
let amountOfFields = 2
let itns = []
let deltas = []
let names = ["Deine ITN", "Partner ITN", "Gegner ITN", "Gegner ITN 2"]

selectSingleOrDoubleMode(document.querySelector(".toggle p.active"))
function selectSingleOrDoubleMode(elem){
    elem.closest(".toggle").querySelector(".active").classList.remove("active")
    elem.classList.add("active")

    amountOfFields = 2
    activeType = "S"

    let rows = ""

    if(elem.innerHTML === "Doppel") {
        amountOfFields = 4;
        activeType = "D";
    }

    if(activeType === "S"){
        rows = `
            <div class="row">
                <p>${names[0]} (0.000)</p>
                <p></p>
            </div>
            <div class="row">
                <p>${names[2]} (0.000)</p>
                <p></p>
            </div>
        `
    } else {
        rows = `
            <div class="row">
                <p>${names[0]} (0.000)</p>
                <p></p>
            </div>
            <div class="row">
                <p>${names[1]} (0.000)</p>
                <p></p>
            </div>
            <div class="row">
                <p>${names[2]} (0.000)</p>
                <p></p>
            </div>
            <div class="row">
                <p>${names[3]} (0.000)</p>
                <p></p>
            </div>
        `
    }

    let itnFields = ""

    for (let i = 0; i < amountOfFields; i++) {
        itnFields += `<div class="itnField">
                        <input type="text" placeholder="10.000" value="${itns[i] || ''}">
                        <div class="select" id="sikSelect${i+1}">
                            <div class="selected">
                                <p>Sicher</p>
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                            <div class="options">
                                <p class="option">Sicher</p>
                                <p class="option">Nicht Sicher</p>
                            </div>
                        </div>
                 </div>`
    }
    document.querySelector(".itnFields").innerHTML = itnFields
    document.querySelector(".changedITNField.winner .rows").innerHTML = rows
    document.querySelector(".changedITNField.loser .rows").innerHTML = rows

    const customSelect = document.querySelectorAll('.select');

    customSelect.forEach((select) => {
        const selected = select.querySelector('.selected');
        const selectedP = select.querySelector('.selected p')
        const options = select.querySelector('.options');

        selected.addEventListener('click', () => {
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        });

        options.addEventListener('click', (e) => {
            if (e.target.classList.contains('option')) {
                selectedP.textContent = e.target.textContent;
                selected.dataset.value = e.target.dataset.value;
                options.style.display = 'none';
                handleChanges()
            }
        });

        document.addEventListener('click', (e) => {
            if (!select.contains(e.target)) {
                options.style.display = 'none';
            }
        });
    })

    document.querySelectorAll("input, select").forEach((elem) => {
        elem.addEventListener("keyup", function (event) {
            handleChanges()
        })

        elem.addEventListener("change", function (event) {
            handleChanges()
        })
    })

    handleChanges()
}

function handleChanges(){
    itns = []
    let siks = []
    let hasRetired;

    let areAllInputsFilled = true;
    document.querySelectorAll(`input`).forEach((elem) => {
        itns.push(elem.value)
        if(elem.value === ""){
            areAllInputsFilled = false;
        }
    })

    document.querySelectorAll(`.select`).forEach((elem) => {
        siks.push(elem.querySelector(".selected p").innerHTML);
    })

    if (areAllInputsFilled) {
        let calculatedITNs
        if (activeType === "S") {
            calculatedITNs = calcItnSingle(itns[0], itns[1], siks[0], siks[1], hasRetired)
        } else {
            calculatedITNs = calcItnDoubles(itns[0], itns[1], itns[2], itns[3], hasRetired)
        }

        let count = 0;
        let winner = ""
        let loser = ""

        let winnerCount = 0
        let loserCount = 0

        calculatedITNs.forEach(elem => {
            if(count < amountOfFields){
                winner += `<div class="row">
                        <p>${activeType === "D" ? names[winnerCount++] : names[(winnerCount++)*2]} (${deltas[count].toFixed(3)})</p>
                        <p>${elem}</p>
                    </div>`
            } else{
                loser += `<div class="row">
                        <p>${activeType === "D" ? names[loserCount++] : names[(loserCount++)*2]} (${deltas[count].toFixed(3)})</p>
                        <p>${elem}</p>
                    </div>`
            }
            count++
        })

        document.querySelector(".winner .rows").innerHTML = winner
        document.querySelector(".loser .rows").innerHTML = loser
    }

}

/**
 * @param p1 Player 1
 * @param p2 Player 2
 * @param sik1 Sik of player 1
 * @param sik2 Sik of player 2
 * @param hasRetired if the player has retired
 * @returns {string[]} itn of each player after the game
 */
function calcItnSingle(p1, p2, sik1, sik2, hasRetired){
    p1 = p1.replaceAll(",", ".")
    p2 = p2.replaceAll(",", ".")

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
        if(sik1 < sik2) {
            deltas = [-(delta1*2), +(delta1/2), +(delta2*2), -(delta2/2)]
        } else if(sik1 > sik2) {
            deltas = [-(delta1/2), +(delta1*2), +(delta2/2), -(delta2*2)]
        } else {
            deltas = [-delta1, +delta1, +delta2, -delta2]
        }

        calculatedITNs = [
            (p1-delta1*[sik1 < sik2 ? 2 : (sik1 > sik2 ? 0.5 : 1)]).toFixed(3),
            (p2+delta1*[sik2 < sik1 ? 2 : (sik2 > sik1 ? 0.5 : 1)]).toFixed(3),
            (p1+delta2*[sik2 > sik1 ? 2 : (sik2 < sik1 ? 0.5 : 1)]).toFixed(3),
            (p2-delta2*[sik1 > sik2 ? 2 : (sik1 < sik2 ? 0.5 : 1)]).toFixed(3)
        ]
    }

    return checkedLimits(calculatedITNs);
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
    p1 = p1.replaceAll(",", ".")
    p2 = p2.replaceAll(",", ".")
    p3 = p3.replaceAll(",", ".")
    p4 = p4.replaceAll(",", ".")

    let calculatedITNs = []

    if(hasRetired){ // Check if game has finished because of retirement
        calculatedITNs = [p1, p2, p3+0.1, p4+0.1, p1+0.1, p2+0.1, p3, p4];
    } else{
        p1-=0;p2-=0;p3-=0;p4-=0;

        let x1 = (p1+p3) - (p2+p4); // Team 2 is winner
        let x2 = (p2+p4) - (p1+p3); // Team 1 is winner

        // Calculate delta
        let delta1 = (0.250 / (1.000 + 2.595 * Math.exp(3.500*x1))) * 0.25
        let delta2 = (0.250 / (1.000 + 2.595 * Math.exp(3.500*x2))) * 0.25

        deltas = [-delta1, -delta1, +delta1, +delta1, +delta2, +delta2, -delta2, -delta2]

        // Add Delta
        calculatedITNs = [
            (p1-delta1).toFixed(3), (p3-delta1).toFixed(3),
            (p2+delta1).toFixed(3), (p4+delta1).toFixed(3),
            (p1+delta1).toFixed(3), (p3+delta2).toFixed(3),
            (p2-delta1).toFixed(3), (p4-delta2).toFixed(3)
        ]
        /**calculatedITNs = [
            (p1-delta1).toFixed(3), (p1+delta2).toFixed(3),
            (p2-delta1).toFixed(3), (p2+delta2).toFixed(3),
            (p3+delta1).toFixed(3), (p3-delta2).toFixed(3),
            (p4+delta1).toFixed(3), (p4-delta2).toFixed(3)
        ]**/
    }

    calculatedITNs = checkedLimits(calculatedITNs)
    return calculatedITNs;
}

function checkedLimits(itnList){
    for(let i = 0; i < itnList.length; i++){
        if(itnList[i] < 1.5){
            itnList[i] = 1.500.toFixed(3)
        }
    }
    return itnList
}

function newGame(){
    itns=[]
    selectSingleOrDoubleMode(document.querySelector(".toggle p.active"))
}

function continueWithWinOrLose(elem){
    itns=[]

    let count = 1
    elem.closest(".changedITNField").querySelectorAll(".row p:last-child").forEach(elem => {
        if(count++ % 2 !== 0){
            itns.push(elem.innerHTML)
        } else{
            itns.push(null)
        }
    })

    selectSingleOrDoubleMode(document.querySelector(".toggle p.active"))
}



function handleScreenChange(e) {
    if (e.matches) {
        // Screen width is less than 1200px
        document.querySelector('nav.mobile').classList.add('active')
        document.querySelector('nav.desktop').classList.remove('active')
    } else {
        // Screen width is 1200px or greater
        document.querySelector('nav.mobile').classList.remove('active')
        document.querySelector('nav.desktop').classList.add('active')
    }
}

const mediaQuery = window.matchMedia("(max-width: 1199px)");
mediaQuery.addEventListener("change", handleScreenChange);

handleScreenChange(mediaQuery);