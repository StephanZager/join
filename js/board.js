let task = [];
let userNameColor = [
    "#a5d9b0", "#fecac4", "#daa3a3", "#8dabfe", "#88e4d7", "#d280f3", "#93be85", "#9dd39b", 
    "#ece4b1", "#bb8e91", "#8e86db", "#f1eb92", "#9e8189", "#e3dcdd", "#e6c8a2", "#b39e83", 
    "#f69880", "#9fbde8", "#e586c1", "#99829d", "#c7cdae", "#88b4a0", "#d2f487", "#d393c3", 
    "#90d3b1", "#89eaa7", "#96c198", "#8def87", "#e9c5c2", "#97adf2", "#d1d285", "#8ca982", 
    "#cbbd98", "#d8e9c1", "#ea8ef1", "#8bf3c4", "#8bc8cd", "#82f58f", "#a4bfab", "#b8de8a", 
    "#9ca3e0", "#c0d4e5", "#9af4b9", "#e0e4f4", "#e1d1f6", "#8cab93", "#ddcacb", "#fad5a2", 
    "#9dc79d", "#e493c5", "#9ea591", "#d8dcdb", "#f9fba4", "#8dd2b5", "#fbb1f4", "#c1d2de", 
    "#fbe490", "#fefb9d", "#bff4ab", "#e8c8e0", "#c29fbd", "#9ecac3", "#9bc19e", "#a0b0b9", 
    "#91b6d5", "#d1dabc", "#bcb0e5", "#aaaee2", "#9bacda", "#c69c91", "#b2ae81", "#d99aa5", 
    "#efe9ef", "#fcada9", "#b9e09a", "#8edd8b", "#f3b3bf", "#a7c5dc", "#ebf0c7", "#e7faf5", 
    "#cdb4bc", "#95c7b2", "#f0d0a4", "#e6cea4", "#aef4b5", "#daa5ba", "#91aaf9", "#90d4b3", 
    "#81e99e", "#b6fdbd", "#a0beed", "#ebb8b8", "#b6e6a9", "#e7ab83", "#9c8489", "#bb8586", 
    "#d1b8ce", "#d3faad", "#d0c7d2", "#ace8fb"
];

async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            let tasksArray = Object.values(responseToJson);
            task.push(...tasksArray);
        }

        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}


function toAssignColorNameLogo() {
    let backgroundcolor = userNameColor[Math.floor(Math.random() * userNameColor.length)];

    return backgroundcolor;
}


function toAssignColorNameLogo(numInitials) {
    let colors = [];
    for (let i = 0; i < numInitials; i++) {
        let color = userNameColor[Math.floor(Math.random() * userNameColor.length)];
        colors.push(color);
    }
    return colors;
}

function generateTask() {
    let toDoElement = document.getElementById('toDo');
    toDoElement.innerHTML = '';

    for (let i = 0; i < task.length; i++) {
        let taskItem = task[i];

        let taskDiv = document.createElement('div');
        taskDiv.className = 'taskCard';

        let assignedInitials = taskItem.assign ? taskItem.assign.join(', ') : '';
        let assignedInitialsArray = taskItem.assign || [];

        let initialsHtml = '';
        let initialsColors = toAssignColorNameLogo(assignedInitialsArray.length);
        for (let j = 0; j < assignedInitialsArray.length; j++) {
            initialsHtml += `<span class="show-initials" style="background-color: ${initialsColors[j]}">${assignedInitialsArray[j]}</span>`;
        }

        // Erstellen des Bildpfads basierend auf der Priorität
        let priorityIcon;
        if (taskItem.priority === 'Urgent') {
            priorityIcon = './assets/img/prio-urgent-icon-unclicked.png';
        } else if (taskItem.priority === 'Medium') {
            priorityIcon = './assets/img/prio-medium-icon-unclicked.png';
        } else if (taskItem.priority === 'Low') {
            priorityIcon = './assets/img/prio-low-icon-unclicked.png';
        } else {
            priorityIcon = './assets/img/prio-urgent-icon-unclicked.png'; // Default icon
        }

        taskDiv.innerHTML = `
            <h4>${taskItem.category}</h4>
            <p class="task-title">${taskItem.title}</p>
            <p class="task-description">${taskItem.description}</p>
            <p>${taskItem.subtask}<span>1/2 Subtasks</span></p>
            <div class="show-initials-taskcard" style="border-radius: 10px;">${initialsHtml}</div>
            <img class="prio-icons" src="${priorityIcon}">
        `;

        if (taskItem.category === 'User Story') {
            taskDiv.querySelector('h4').style.backgroundColor = 'blue';
        } else if (taskItem.category === 'Technical Task') {
            taskDiv.querySelector('h4').style.backgroundColor = 'cyan';
        }

        toDoElement.appendChild(taskDiv);
    }
}



