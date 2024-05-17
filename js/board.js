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

        // Inhalt des Div-Elements festlegen (hier können Sie anpassen, wie die Aufgabe angezeigt wird)
        taskDiv.innerHTML = `
            <h5>${taskItem.title}</h5>
            <p>${taskItem.description}</p>
            <p>${taskItem.date}</p>
            <p>${taskItem.category}</p>
            <p>${taskItem.assigned}</p>
            <p>${taskItem.subtask}</p>
        `;

        // Das neue Div-Element zum toDoElement hinzufügen
        toDoElement.appendChild(taskDiv);
    }
}