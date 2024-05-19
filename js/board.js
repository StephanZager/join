let task = [];

async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        // Überprüfen, ob responseToJson nicht null ist und dann die Daten in das task-Array pushen
        if (responseToJson) {
            // Falls die Daten ein Objekt sind, in ein Array umwandeln
            let tasksArray = Object.values(responseToJson);

            // Daten in das task-Array pushen
            task.push(...tasksArray);
        }

        // Aufgaben generieren und anzeigen
        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

// Funktion aufrufen, um die Daten zu laden und in das task-Array zu pushen



function generateTask() {
    let toDoElement = document.getElementById('toDo');
    toDoElement.innerHTML = '';  // Vorherigen Inhalt löschen

    // Durch das task-Array iterieren und die Aufgaben anzeigen
    for (let i = 0; i < task.length; i++) {
        let taskItem = task[i];

        // Erstellen eines neuen Div-Elements für jede Aufgabe
        let taskDiv = document.createElement('div');
        taskDiv.className = 'taskCard';

        // Initialen der zugewiesenen Benutzer abrufen und anzeigen
        let assignedInitials = taskItem.assign ? taskItem.assign.join(', ') : ''; // Überprüfen, ob assign definiert ist

        // Inhalt des Div-Elements festlegen (hier können Sie anpassen, wie die Aufgabe angezeigt wird)
        taskDiv.innerHTML = `
            <h4>${taskItem.category}</h4>
            <p class="task-title">${taskItem.title}</p>
            <p class="task-description">${taskItem.description}</p>
            <p>${taskItem.subtask}<span>1/2 Subtasks</span></p>
            <span>${assignedInitials}</span> // Anzeige der Initialen der zugewiesenen Benutzer
        `;

        // Setzen der Hintergrundfarbe des h5-Tags basierend auf der Kategorie
        if (taskItem.category === 'User Story') {
            taskDiv.querySelector('h4').style.backgroundColor = 'blue';
        } else if (taskItem.category === 'Technical Task') {
            taskDiv.querySelector('h4').style.backgroundColor = 'cyan';
        }

        // Das neue Div-Element zum toDoElement hinzufügen
        toDoElement.appendChild(taskDiv);
    }
}



