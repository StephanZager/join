
async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            task = Object.entries(responseToJson).map(([firebaseId, taskData]) => ({ firebaseId, ...taskData }));
        }

        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}



async function deleteTask(firebaseId) {
    try {
        let response = await fetch(BASE_URL + `/userTask/${firebaseId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        task = task.filter(t => t.firebaseId !== firebaseId);
        generateTask();

        const modal = document.getElementById("taskModal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (error) {
        console.error('Fehler beim Löschen der Aufgabe:', error);
        alert(`Fehler beim Löschen der Aufgabe: ${error.message}`);
    }
}


async function postNewTask(newTask) {
    const response = await fetch(`${BASE_URL}/userTask.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


async function updateTaskInFirebase(firebaseId, newData) {
    try {
        await fetch(`${BASE_URL}/userTask/${firebaseId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        });
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aufgabe in Firebase:", error);
        throw error;
    }
}

/**
 * Asynchronously posts data to a specified path and returns the JSON response.
 * It sends a POST request with the given data as JSON to the constructed URL using the BASE_URL and path parameters.
 * If the response indicates a failure (response.ok is false), it logs an error with the response status text.
 * Otherwise, it converts the response to JSON and returns it.
 * 
 * @param {string} path - The path to which the data should be posted, appended to BASE_URL.
 * @param {Object} data - The data to be posted, which will be stringified to JSON.
 * @returns {Promise<Object>} The JSON response from the server if the request is successful; otherwise, undefined.
 */
async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("Fehler beim Posten der Daten:", response.statusText);
        return;
    }

    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Posts the data to the specified path in the database.
 * 
 * @param {string} path - The path where the data should be saved in the database.
 * @param {Object} data - The data to be saved.
 * @returns {Object} - The response from the database.
 */
async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    addNewContactConfirmation();
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Loads contacts from the database.
 * 
 * @param {string} [path="/contact"] - The path where the contacts are stored in the database.
 * @returns {Promise<void>} 
 */
async function loadContact(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let contact = responseToJson[key];

                contacts.push({
                    'id': key,
                    'name': contact.name,
                    'email': contact.email,
                    'phone': contact.phone,
                    'bgNameColor': contact.bgNameColor,
                    'firstLetters': contact.firstLetters
                });
            }
        }
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}

/**
 * Updates a contact in the database.
 * 
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContact - The updated contact object.
 * @param {string} [path="/contact"] - The path where the contact is stored in the database.
 * @returns {Promise<Response>} The response from the database.
 */
async function updateContact(contactId, updatedContact, path = "/contact") {    
    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    });
    return response;
}


/**
 * Fetches data from the specified path.
 * @param {string} path - The path to fetch data from.
 * @returns {Promise<Object>} - The fetched data.
 */
async function getData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return;
    }
    let responseData = await response.json();
    return responseData;
  }

  /**
 * Checks if the given email already exists in the database.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
async function emailExists(email) {
    try {
        let response = await fetch(BASE_URL + "/userData.json");
        if (!response.ok) {
            throw new Error("Error fetching data: " + response.statusText);
        }
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