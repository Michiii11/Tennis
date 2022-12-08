let sieger;
let verlierer;

function calcItn(s1, s2, sik1, sik2, r){ // Spieler1, Spieler2, Sik1, Sik2, Winner, Retired?
    if(!r){ // Abfragen ob Spiel Aufgegeben wurde.
        s1 -= 0; s2 -= 0;

        // Sieger bestimmen
        let winner;
        let loser;
        if(sieger == 1){
            winner = [s1, sik1];
            loser = [s2, sik2];
        } else{
            winner = [s2, sik2];
            loser = [s1, sik1];
        }

        let x = loser[0] - winner[0];

        // Delta berechnen
        let delta;
    
        delta = 0.2501/(1+1.9251 * Math.exp(2.3716*x))


        if(winner[1] < loser[1]){
            winner[0] -= delta*2;
            loser[0] += delta/2;
        } else if(winner[1] > loser[1]){
            winner[0] -= delta/2;
            loser[0] += delta*2;
        } else{
            winner[0] -= delta*1;
            loser[0] += delta;
        }



        if(sieger == 1){
            s1 = winner[0];
            s2 = loser[0];
        } else{
            s2 = winner[0];
            s1 = loser[0];
        }
    } else{
        if(sieger == 1){
            s2 += 0.1;
        } else{
            s1 += 0.1;
        }
    }

    console.log(s1, s2)
    return [s1.toFixed(3), s2.toFixed(3)];
}
function calcItnDoubles(s1, s2, s3, s4, r){
    if(!r){ // Abfragen ob Spiel Aufgegeben wurde.
        s1-=0;s2-=0;s3-=0;s4-=0;
        
        // Sieger bestimmen
        let winner;
        let loser;
        if(sieger == 1){
            winner = s1+s2
            loser = s3+s4
        } else{
            winner = s3+s4
            loser = s1+s2
        }

        let x = loser - winner;

        // Delta berechnen
        let delta;
    
        delta = 0.2501/(1+1.9251 * Math.exp(2.3716*x))
        delta *= 0.25;
        // Delta hinzufügen
        if(sieger == 1){
            s1 -= delta;
            s2 -= delta;
            s3 += delta;
            s4 += delta;
        } else{
            s1 += delta;
            s2 += delta;
            s3 -= delta;
            s4 -= delta;
        }
    } else{
        if(sieger == 1){
            s3 += 0.1;
            s4 += 0.1;
        } else{
            s1 += 0.1;
            s2 += 0.1;
        }
    }
    return [s1.toFixed(3), s2.toFixed(3), s3.toFixed(3), s4.toFixed(3)];
}

function getITN(sod){ // Single or Double
    if(sod == 1){ // Single
        let s1 = document.getElementById("s1").value;
        let s2 = document.getElementById("s2").value;

        let itn = calcItn(s1, s2, 0, 1, false)
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





const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});