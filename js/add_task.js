let assign = [];
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

let taskIdCounter = 1;
let selectedPriority = null;

function setPriority(priority) {
    selectedPriority = priority;
    console.log(`Priority set to ${priority}`);
}

async function submitTask(event) {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.getElementById('category').value;
    
    let assignedElement = document.getElementById('assigned');
    let assignCheckboxes = assignedElement ? assignedElement.querySelectorAll('input[type="checkbox"]:checked') : [];
    let assignInitials = [];
    assignCheckboxes.forEach(checkbox => {
        assignInitials.push(filterFirstLetters(checkbox.value));
    });

    let subtaskItems = document.querySelectorAll('#subtaskList li');
    let subtasks = [];
    subtaskItems.forEach(item => {
        subtasks.push(item.textContent.trim().substring(2));
    });

    let userTask = {
        title: title,
        description: description,
        date: date,
        userCategory: userCategory,
        assign: assignInitials,
        subtasks: subtasks,
        category: "toDo"
    };

    try {
        await postData("/userTask", userTask);
        window.location.href = "board.html";
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}

function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        let subtaskList = document.getElementById('subtaskList');
        let newSubtaskItem = document.createElement('li');
        newSubtaskItem.textContent = '\u2022 ' + subtaskText;
        subtaskList.appendChild(newSubtaskItem);
        subtaskInput.value = '';
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

        if (responseToJson) {
            let assignArray = Object.values(responseToJson);
            assign.push(...assignArray);
        }

        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function generateAssign() {
    let assignContact = document.getElementById('assigned');

    if (!assignContact) {
        console.error("Element mit ID 'assigned' wurde nicht gefunden.");
        return;
    }

    assignContact.innerHTML = '';

    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];

        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = assignContacts.name;

        let initials = filterFirstLetters(assignContacts.name);
        let initialsSpan = document.createElement('span');
        initialsSpan.textContent = initials;
        initialsSpan.classList.add('assign-initials');
        initialsSpan.style.backgroundColor = toAssignColorNameLogo();

        let nameSpan = document.createElement('span');
        nameSpan.textContent = assignContacts.name;
        nameSpan.classList.add('assign-name');

        label.appendChild(initialsSpan);
        label.appendChild(nameSpan);
        label.appendChild(checkbox);

        assignContact.appendChild(label);
    }
}

function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

function toAssignColorNameLogo() {
    let backgroundcolor = userNameColor[Math.floor(Math.random() * userNameColor.length)];
    return backgroundcolor;
}

document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});
