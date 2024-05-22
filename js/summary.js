let numberOfBoard =[];


/**
 * Generates the greeting depending on the time of day.
 * 
 */
function greeting() {
    let grettingSummary = document.getElementById('greetingSummary');
    let realTime = new Date();
    let hours = realTime.getHours();

    if (hours >= 18) {
        grettingSummary.innerHTML = 'Good evening,';
    } else if (hours <= 10) {
        grettingSummary.innerHTML = 'Good morning,';
    } else if (hours >= 6 && hours <= 18) {
        grettingSummary.innerHTML = 'Good Day,';
    }
}

async function loadNumberOfBoard(path = "/userTask"){
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let number = responseToJson[key];

                numberOfBoard.push({
                    todos : number.category
                   
                });
            }
        }

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}
    

    


function initSummary() {
    greeting();
    loadNumberOfBoard();
}