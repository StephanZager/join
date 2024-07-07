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
        return grettingSummary.innerHTML = 'Good evening,';
    } else if (hours <= 10) {
        return grettingSummary.innerHTML = 'Good morning,';
    } else if (hours >= 6 && hours <= 18) {
        return grettingSummary.innerHTML = 'Good Day,';
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
        return summaryPersonGreeting.innerHTML = userName;
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
                    urgentTasks.push({
                        urgent: task.priority,
                        date: task.date,
                    });
                }

                numberOfBoard.push({
                    todos: task.category
                });
            }
        }
        console.log('urgentTasks:', urgentTasks);
    } catch (error) {
        console.error("Error loading data:", error);
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

/**
 * Displays the urgent tasks.
 * 
 * @returns {void}
 */
function sohwUgretnTask() {
    if (urgentTasks && urgentTasks.length > 0) {
        urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        document.getElementById('howMuchInUrgent').innerHTML = urgentTasks.length;
        let date = new Date(urgentTasks[0].date);
        let month = date.toLocaleString('default', { month: 'long' });
        document.getElementById('summaryUrgendDate').innerHTML = month + ' ' + date.getDate() + ',' + ' ' + date.getFullYear();
    } else {
        // Handle the case when there are no urgent tasks
        document.getElementById('howMuchInUrgent').innerHTML = 0;
    }
}

/**
 * Displays the greeting summary in mobile view.
 * 
 * @returns {void}
 */
function greetingSummaryMobile() {
    if (window.matchMedia("(max-width: 1200px)").matches) {
        if (localStorage.getItem('showGreetings') !== 'true') {
            return;
        }
        localStorage.setItem('showGreetings', 'false');

        let grettingMobile = document.getElementById('greetingSummaryMobile');
        let grettingTime = greeting();
        let greetingName = displayGreetingWithName();

        grettingMobile.innerHTML = grettingMobileHTML(grettingTime, greetingName);

        setTimeout(() => {
            grettingMobile.classList.add('hide');
            setTimeout(() => {
                grettingMobile.style.display = 'none';
            }, 900);
        }, 2000);
    }
}

/**
 * Redirects to the next page.
 * 
 * @returns {void}
 */
function nextPage() {
    window.location.href = 'board.html';
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
    greetingSummaryMobile();
    await loadCategory();
    taskAssignment();
    sohwUgretnTask();
}

/**
 * Generates the HTML for the mobile greeting.
 * 
 * @param {string} grettingTime - The greeting message.
 * @param {string} greetingName - The name of the user.
 * @returns {string} - The HTML string for the mobile greeting.
 */
function grettingMobileHTML(grettingTime, greetingName) {
    return `
    <div class="summary-greeting-mobile">
        <h3 class="summary-day-greeting">${grettingTime}</h3>
        <span class="summary-person-greeting">${greetingName}</span>
    </div>
    `;
}