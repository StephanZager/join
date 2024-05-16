const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

let assign = [];

async function submitTask(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assigned = document.getElementById('assigned').value;
    let date = document.getElementById('dueDate').value;
    let category = document.getElementById('category').value;
    let subtask = document.getElementById('subtasks').value;
    
    let userTask = {
        title: title,
        description: description,
        assigned: assigned,
        date: date,
        category: category,
        subtask: subtask
    };
    
    try {
        // Daten an Firebase senden
        await postData("/userTask", userTask); // Pfad für die DB, wo der Datensatz gespeichert werden soll
        
        // Nach dem erfolgreichen Senden des Formulars zur neuen Seite weiterleiten
        window.location.href = "board.html"; // Ändere dies zur gewünschten URL
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}

async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        // Fehlerbehandlung hinzufügen
        console.error("Fehler beim Posten der Daten:", response.statusText);
        return;
    }

    let responseToJson = await response.json();
    return responseToJson;
}

async function loadAssign(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        // Überprüfen, ob responseToJson nicht null ist und dann die Daten in das assign-Array pushen
        if (responseToJson) {
            // Falls die Daten ein Objekt sind, in ein Array umwandeln
            let assignArray = Object.values(responseToJson);

            // Daten in das assign-Array pushen
            assign.push(...assignArray);
        }

        // Aufgaben generieren und anzeigen
        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function generateAssign() {
    let assignContact = document.getElementById('assigned');
    assignContact.innerHTML = '<option disabled selected hidden>Select contact to assign</option>';

    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];

        let assignOption = document.createElement('option');
        assignOption.value = assignContacts.name; // oder eine eindeutige ID, wenn verfügbar
        assignOption.textContent = assignContacts.name;

        assignContact.appendChild(assignOption);
    }
}

