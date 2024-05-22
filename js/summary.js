let numberOfBoard = [];


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

async function loadCategory(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let number = responseToJson[key];

                numberOfBoard.push({
                    todos: number.category
                });
            }
        }

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}

async function taskAssignment() {
    let numberOfTodos = [];
    let numberOfDone = [];  
    let numberOfAwaitFeedback = [];
    let numberOfInProgress = [];

    for (let i = 0; i < numberOfBoard.length; i++) {
        const task = numberOfBoard[i]['todos'];

        if (task.indexOf('toDo') !== -1) {
            numberOfTodos.push(task);
        }else if(task.indexOf('done') !== -1){
            numberOfDone.push(task);            
        }else if(task.indexOf('awaitFeedback') !== -1){
            numberOfAwaitFeedback.push(task); 
        }else if(task.indexOf('inProgress') !== -1){
            numberOfInProgress.push(task); 
        }                 
    } 
    await renderSummary(numberOfTodos, numberOfDone, numberOfAwaitFeedback, numberOfInProgress); 
    }

async function renderSummary(numberOfTodos, numberOfDone, numberOfAwaitFeedback, numberOfInProgress) {
    document.getElementById('howMuchTodos').innerHTML = numberOfTodos.length;
    document.getElementById('howMuchDone').innerHTML = numberOfDone.length;
    document.getElementById('howMuchAwaitFeedback').innerHTML = numberOfAwaitFeedback.length;
    document.getElementById('howMuchInProgress').innerHTML = numberOfInProgress.length; 
}  




    async function initSummary() {
        greeting();
        await loadCategory();
        taskAssignment()
    }