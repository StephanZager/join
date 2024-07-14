/**
 * Loads tasks from the specified path.
 * @param {string} [path="/userTask"] - Path to load tasks from.
 */
async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();
        if (responseToJson) {
            task = Object.entries(responseToJson).map(([firebaseId, taskData]) => ({ firebaseId, ...taskData }));
        }
        generateTask();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

/**
 * Deletes a task by its Firebase ID.
 * @param {string} firebaseId - Task's Firebase ID.
 */
async function deleteTask(firebaseId) {
    try {
        let response = await fetch(BASE_URL + `/userTask/${firebaseId}.json`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        task = task.filter(t => t.firebaseId !== firebaseId);
        generateTask();
        const modal = document.getElementById("taskModal");
        if (modal) modal.style.display = "none";
    } catch (error) {
        console.error("Error deleting task:", error);
        alert(`Error deleting task: ${error.message}`);
    }
}

/**
 * Posts a new task.
 * @param {Object} newTask - New task data.
 * @returns {Object} - Response JSON.
 */
async function postNewTask(newTask) {
    const response = await fetch(`${BASE_URL}/userTask.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * Updates a task in Firebase.
 * @param {string} firebaseId - Task's Firebase ID.
 * @param {Object} newData - Updated task data.
 */
async function updateTaskInFirebase(firebaseId, newData) {
    try {
        await fetch(`${BASE_URL}/userTask/${firebaseId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData)
        });
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

/**
 * Posts data to the specified path.
 * @param {string} path - Path to post data to.
 * @param {Object} data - Data to post.
 * @returns {Object} - Response JSON.
 */
async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("Error posting data:", response.statusText);
        return;
    }
    return await response.json();
}

/**
 * Loads contacts from the specified path.
 * @param {string} [path="/contact"] - Path to load contacts from.
 */
async function loadContact(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();
        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let contact = responseToJson[key];
                contacts.push({
                    id: key,
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    bgNameColor: contact.bgNameColor,
                    firstLetters: contact.firstLetters
                });
            }
        }
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}

/**
 * Updates a contact.
 * @param {string} contactId - Contact's ID.
 * @param {Object} updatedContact - Updated contact data.
 * @param {string} [path="/contact"] - Path to update contact.
 * @returns {Object} - Response.
 */
async function updateContact(contactId, updatedContact, path = "/contact") {
    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
    });
    return response;
}

/**
 * Fetches data from the specified path.
 * @param {string} path - Path to fetch data from.
 * @returns {Object} - Fetched data.
 */
async function getData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
        console.error("Error fetching data:", response.statusText);
        return;
    }
    return await response.json();
}

/**
 * Checks if an email exists.
 * @param {string} email - Email to check.
 * @returns {boolean} - True if email exists, false otherwise.
 */
async function emailExists(email) {
    try {
        let response = await fetch(BASE_URL + "/userData.json");
        if (!response.ok) throw new Error("Error fetching data: " + response.statusText);
        let data = await response.json();
        for (let key in data) {
            if (data[key].email === email) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
    }
}

/**
 * Loads assigned contacts.
 * @param {string} [path="/contact"] - Path to load assigned contacts from.
 */
async function loadAssign(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            let assignArray = Object.values(responseToJson);
            assign.push(...assignArray);
        }

        let loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            moveLoggedInUserToTop(assign, loggedInUser);
        }

        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

/**
 * Generates and displays the assigned contacts in the UI.
 */
function generateAssign() {
    let assignContact = document.getElementById('assigned');
    let loggedInUser = localStorage.getItem('loggedInUser'); 

    if (!assignContact) {
        console.error("Element with ID 'assigned' not found.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    sortAssignAlphabetically(); 
    moveLoggedInUserToTop(assign, loggedInUser); 

    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];
        let label = createLabel(assignContacts);
        assignContact.appendChild(label);
    }
}

/**
 * Sorts the assigned contacts alphabetically by name.
 */
function sortAssignAlphabetically() {
    assign.sort((a, b) => {
        let nameA = a.name.toUpperCase(); 
        let nameB = b.name.toUpperCase();
        return nameA.localeCompare(nameB);
    });
}

async function submitTask(event) {
    event.preventDefault();

    if (!requiredFields()) {
        return;
    }
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.querySelector('input[name="category"]:checked')?.value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();
    let userTask = createUserTask(title, description, date, userCategory, assignDetails, subtasks, selectedPriority);
    try {
        await postData("/userTask", userTask);
       
        const confirmMsg = document.getElementById('confirmMsg');
        confirmMsg.style.display = 'block';
        
        setTimeout(() => {
            window.location.href = "board.html";
        }, 1000);
        
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
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
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}