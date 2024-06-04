let editTaskPopup;
let currentTask;


function loadTaskForEdit(firebaseId) {
    console.log('Passed firebaseId:', firebaseId);
    console.log('Task array:', task);
    for (let i = 0; i < task.length; i++) {
        let editTask = task[i];
        console.log('Current task:', editTask);
        if (editTask.firebaseId === firebaseId) {
            console.log(editTask.firebaseId);
            currentTask = editTask;
            break;
        }
    }
}

function showTaskDetails() {
    document.getElementById('editTitle').value = currentTask.title;
    document.getElementById('editDescription').value = currentTask.description;
    document.getElementById('editAssigned').value = currentTask.assign;
    document.getElementById('editDate').value = currentTask.dueDate;
    document.getElementById('editCategory').value = currentTask.userCategory;
    document.getElementById('subtaskListEdit').innerHTML = '';
    

    showInitialsEditTask();
    showSubtasksEditTask();
}


function showInitialsEditTask() {
    let initialsElement = document.getElementById('editAssignedInitials');
    initialsElement.innerHTML = '';
    if (Array.isArray(currentTask.assign)) {
        for (let i = 0; i < currentTask.assign.length; i++) {
            let assignData = currentTask.assign[i];
            let spanElement = `<span class="show-initials-edit" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`;
            initialsElement.innerHTML += spanElement;
        }
    }
}


function markCheckedCheckboxes() {
    let assignContact = document.getElementById('editAssigned');
    if (!assignContact) {
        console.error("Element mit ID 'editAssigned' wurde nicht gefunden.");
        return;
    }

    // Holen Sie sich alle Checkboxen innerhalb von 'assignContact'
    let checkboxes = assignContact.querySelectorAll('input[type="checkbox"]');

    console.log('currentTask.assign:', currentTask.assign); // Debugging-Informationen

    // Iterieren Sie durch jede Checkbox
    for (let checkbox of checkboxes) {
        console.log('checkbox value:', checkbox.value); // Debugging-Informationen

        // Extrahieren Sie den Namen, die Initialen und die Hintergrundfarbe aus dem Wert der Checkbox
        let [name, initials, bgColor] = checkbox.value.split('|');

        // Generieren Sie die Initialen aus dem Namen
        let generatedInitials = filterFirstLetters(name);

        // Wenn der Kontakt in 'currentTask.assign' vorhanden ist, markieren Sie die Checkbox
        if (currentTask.assign.some(assign => assign.name.trim().toLowerCase() === name.trim().toLowerCase() && assign.initials === generatedInitials && assign.bgColor === bgColor)) {
            checkbox.checked = true;
        }
    }
}


function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}


function showSubtasksEditTask() {
    let subtaskList = document.getElementById('subtaskListEdit');
    subtaskList.innerHTML = '';
    if (Array.isArray(currentTask.subtasks)) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            let subtask = currentTask.subtasks[i];
            let liElement = `<li>${subtask.title}</li>`;
            subtaskList.innerHTML += liElement;
        }
    }
}

function setPriority(priority) {
    currentTask.priority = priority;
    console.log(priority);
}

function addSubtask() {
    let subtaskTitle = document.getElementById('editSubtasks').value;
    if (!currentTask.subtasks) {
        currentTask.subtasks = [];
    }
    currentTask.subtasks.push({ title: subtaskTitle });
    showSubtasksEditTask();
}

function openEditTask(firebaseId) {
    loadTaskForEdit(firebaseId);
    editTaskPopup = document.createElement("div");

    editTaskPopup.className = "edit-task";
    editTaskPopup.style.position = "fixed";
    editTaskPopup.style.top = "50%";
    editTaskPopup.style.left = "50%";
    editTaskPopup.style.transform = "translate(-50%, -50%)";
    editTaskPopup.style.backgroundColor = "#fff";
    editTaskPopup.style.zIndex = "99";

    document.body.appendChild(editTaskPopup);

    editTaskPopup.innerHTML = generateEditTaskHTML();
    generateEditAssign();
    showTaskDetails();
    document.getElementById('closeEditPopupButton').addEventListener('click', closeEditTaskPopup);
    document.getElementById('postEditBtn').addEventListener('click', updateCurrentTask);

    
}

function closeEditTaskPopup() {
    document.body.removeChild(editTaskPopup);
}

function generateEditTaskHTML() {
    return `
    <div class="close-edit-section">
        <span id="closeEditPopupButton" class="close-edit">&times;</span>
    </div>
    <main class="edit-task-menü" id="editTaskMainContainer">
        <div class="left-field-section">
            <div class="addtaks-desktop">
                <span>Title<span style="color: red;">*</span></span>
                <input id="editTitle" class="title-select-or-input" placeholder="Enter a title" type="text"> 
            </div>
            <div class="addtaks-desktop">
                <span>Description</span>
                <textarea id="editDescription" class="title-select-or-input" placeholder="Enter a Description" type="text"></textarea>
            </div>
            <div class="addtaks-desktop dropdown">
                <button type="button" class="dropdown-edit-button" onclick="openDropdown()">Dropdown <img src="assets/img/arrow_drop_down.png"></button>
                <div class="dropdown-edit-content d-none" id="editAssigned"></div>
                <div class="show-initials-section" id="editAssignedInitials"></div> 
            </div>
        </div>
        <div class="right-field-section">
            <div class="addtaks-desktop">
                <span>Due Date <span style="color: red;">*</span></span>
                <input id="editDate" class="title-select-or-input" type="date" placeholder="dd/mm/yyyy">
            </div>
            <div class="prio-section addtaks-desktop">
                <span class="subheadline"><b>Prio</b></span>
                <div class="prio-buttons">
                    <button class="urgent-button" type="button" onclick="setPriority('Urgent')">Urgent<img class="prio-icons" src="./assets/img/prio-urgent-icon-unclicked.png"></button>
                    <button class="medium-button" type="button" onclick="setPriority('Medium')">Medium<img class="prio-icons" src="./assets/img/prio-medium-icon-unclicked.png"></button>
                    <button class="low-button" type="button" onclick="setPriority('Low')">Low<img class="prio-icons" src="./assets/img/prio-low-icon-unclicked.png"></button>
                </div>
            </div>
            <div class="addtaks-desktop">
                <span>Category<span style="color: red;">*</span></span>
                <select id="editCategory" class="title-select-or-input">
                    <option disabled selected hidden> Select task category</option>
                    <option>Technical Task</option>
                    <option>User Story</option>
                </select>               
            </div>
            <div class="addtaks-desktop">
                <span>Subtasks</span>
                <div class="input-with-button">
                    <input id="editSubtasks" class="title-select-or-input" placeholder="Add new Subtasks">
                    <button type="button" onclick="addSubtask()"><img class="input-button-img" src="assets/img/add.png" alt=""></button>
                </div>
                <ul id="subtaskListEdit"></ul>
            </div>
        </div>
    </main>
    <div class="last-section" id="postEditBtnSection">
        <div class="edit-btn">
            <button type="button" id="postEditBtn" class="create-task-button">Ok <img src="./assets/img/check-button-add-task.png" alt=""></button>
        </div>
    </div>
    `;
}


function updateCurrentTask() {
    currentTask.title = document.getElementById('editTitle').value;
    currentTask.description = document.getElementById('editDescription').value;
    currentTask.dueDate = document.getElementById('editDate').value;
    currentTask.userCategory = document.getElementById('editCategory').value;

    let assignContact = document.getElementById('editAssigned');
    if (assignContact) {
        let checkboxes = assignContact.querySelectorAll('input[type="checkbox"]');
        currentTask.assign = []; // Leeren Sie die aktuelle Zuweisungsliste

        // Fügen Sie die ausgewählten Kontakte zur Zuweisungsliste hinzu
        for (let checkbox of checkboxes) {
            if (checkbox.checked) {
                console.log('Checkbox value:', checkbox.value); // Debugging-Informationen
                let [name, initials, bgColor] = checkbox.value.split('|');
                currentTask.assign.push({
                    name: name,
                    initials: initials,
                    bgColor: bgColor
                });
            }
        }
    }

    updateTask(currentTask.firebaseId, currentTask);
}


function generateEditAssign() {
    let assignContact = document.getElementById('editAssigned');

    if (!assignContact) {
        console.error("Element mit ID 'editAssigned' wurde nicht gefunden.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];

        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Fügen Sie die Initialen und die Hintergrundfarbe zum Wert hinzu
        let initials = filterFirstLetters(assignContacts.name);
        checkbox.value = assignContacts.name + '|' + initials + '|' + assignContacts.bgNameColor;

        let initialsSpan = document.createElement('span');
        initialsSpan.textContent = initials;
        initialsSpan.classList.add('assign-initials');
        initialsSpan.style.backgroundColor = assignContacts.bgNameColor;

        let nameSpan = document.createElement('span');
        nameSpan.textContent = assignContacts.name;
        nameSpan.classList.add('assign-name');

        label.appendChild(initialsSpan);
        label.appendChild(nameSpan);
        label.appendChild(checkbox);

        assignContact.appendChild(label);
        
    }
    markCheckedCheckboxes();
}

function openDropdown() {
    let dropdown = document.querySelector('.dropdown-edit-content');
    dropdown.classList.toggle('show');
}


async function updateTask(firebaseId, updatedUserTask) {
    try {
        let response = await fetch(BASE_URL + `/userTask/${firebaseId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserTask),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.href = "board.html";
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        alert(`Fehler beim Aktualisieren der Aufgabe: ${error.message}`);
    }
    console.log('Updated user task:', updatedUserTask); // Debugging-Informationen
    updateTask(firebaseId, updatedUserTask);
}



