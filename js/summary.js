let numberOfBoard = [];
let urgentTasks = [];
/**
 * Generates the greeting depending on the time of day.
 * 
 * @returns {void}
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

/**
 * Displays the greeting with the user's name.
 * 
 * @returns {void}
 */
function displayGreetingWithName() {
    let userName = localStorage.getItem('userName');
    if (userName) {
        let summaryPersonGreeting = document.querySelector('.summary-person-greeting');
        summaryPersonGreeting.innerHTML = userName;
    }
}

/**
 * Loads categories from Firebase and populates the numberOfBoard array.
 * 
 * @param {string} [path="/userTask"] - The path to the Firebase data.
 * @returns {Promise<void>}
 */
async function loadCategory(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let task = responseToJson[key];
                console.log(task);

                if (task.priority === 'Urgent') {
                    urgentTasks.push(task.priority);
                }

                numberOfBoard.push({
                    todos: task.category
                });
            }
        }

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}

/**
 * Assigns tasks to various categories.
 * 
 * @returns {Promise<void>}
 */
async function taskAssignment() {
    let numberOfTodos = [];
    let numberOfDone = [];
    let numberOfAwaitFeedback = [];
    let numberOfInProgress = [];

    for (let i = 0; i < numberOfBoard.length; i++) {
        const task = numberOfBoard[i]['todos'];

        if (task.indexOf('toDo') !== -1) {
            numberOfTodos.push(task);
        } else if (task.indexOf('done') !== -1) {
            numberOfDone.push(task);
        } else if (task.indexOf('awaitFeedback') !== -1) {
            numberOfAwaitFeedback.push(task);
        } else if (task.indexOf('inProgress') !== -1) {
            numberOfInProgress.push(task);
        }
    }
    await renderSummary(numberOfTodos, numberOfDone, numberOfAwaitFeedback, numberOfInProgress);
}

/**
 * Renders the summary of tasks.
 * 
 * @param {Array} numberOfTodos - Array of to-do tasks.
 * @param {Array} numberOfDone - Array of done tasks.
 * @param {Array} numberOfAwaitFeedback - Array of tasks awaiting feedback.
 * @param {Array} numberOfInProgress - Array of in-progress tasks.
 * @returns {Promise<void>}
 */
async function renderSummary(numberOfTodos, numberOfDone, numberOfAwaitFeedback, numberOfInProgress) {
    document.getElementById('howMuchTodos').innerHTML = numberOfTodos.length;
    document.getElementById('howMuchDone').innerHTML = numberOfDone.length;
    document.getElementById('howMuchAwaitFeedback').innerHTML = numberOfAwaitFeedback.length;
    document.getElementById('howMuchInProgress').innerHTML = numberOfInProgress.length;
    document.getElementById('howMuchTaskinBoard').innerHTML = numberOfBoard.length;
}

function sohwUgretnTask() {

    document.getElementById('howMuchInUrgent').innerHTML = urgentTasks.length;

}

/**
 * Initializes the summary page by setting the greeting, displaying the user's name, 
 * loading categories, and assigning tasks.
 * 
 * @returns {Promise<void>}
 */
async function initSummary() {
    console.log("Initializing summary...");
    greeting();
    displayGreetingWithName();
    await loadCategory();
    taskAssignment();
    sohwUgretnTask();
}
