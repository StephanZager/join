let assign = [];
let currentAssignIndex = 0;
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
        let subtaskTitle = item.textContent.trim().substring(2);
        subtasks.push({ title: subtaskTitle, done: false });
    });

    let userTask = { 
        title: title,
        description: description,
        date: date,
        userCategory: userCategory,
        assign: assignInitials,
        subtasks: subtasks,
        category: "toDo",
        priority: selectedPriority
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
    currentAssignIndex = 0;  // Reset the index when generating the list

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
        initialsSpan.style.backgroundColor = assignContacts.bgNameColor;  // Set background color

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
