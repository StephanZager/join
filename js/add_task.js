let assign = [];
let globalSubtasks = [];
let currentAssignIndex = 0;
let selectedPriority = null;

function resetButtons(buttons) {
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });
}


function getButtonByPriority(container, priority) {
    let button;
    if (priority === 'Urgent') {
        button = container.querySelector('.urgent-button');
    } else if (priority === 'Medium') {
        button = container.querySelector('.medium-button');
    } else if (priority === 'Low') {
        button = container.querySelector('.low-button');
    } else {
        console.error('Unknown priority:', priority);
    }
    return button;
}


function setButtonAsSelected(button, priority) {
    if (button) {
        button.classList.add('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-clicked-image'); // Change to clicked image
        selectedPriority = priority;
    }
}


function setPriority(priority) {
    const containers = document.querySelectorAll('.prio-buttons, .addtask-popup-prio-buttons');
    containers.forEach(container => {
        const buttons = container.querySelectorAll('button');
        resetButtons(buttons);
        const button = getButtonByPriority(container, priority);
        setButtonAsSelected(button, priority);
    });
}

function getAssignedDetails() {
    let assignedElement = document.getElementById('assigned');
    let assignCheckboxes = assignedElement ? assignedElement.querySelectorAll('input[type="checkbox"]:checked') : [];
    let assignDetails = [];
    assignCheckboxes.forEach(checkbox => {
        let name = checkbox.value;
        let initials = filterFirstLetters(name);
        let bgNameColor = checkbox.dataset.bgColor;
        assignDetails.push({ name: name, initials: initials, bgNameColor: bgNameColor });
    });
    showAssignInitials(assignDetails); 
    return assignDetails;
}

function showAssignInitials(assignDetails) {
    let assignedInitial = document.getElementById('assignedInitial');
    assignedInitial.innerHTML = '';
    let maxInitialsToShow = 6;
    let numberOfAssignDetails = assignDetails.length;

    for (let i = 0; i < Math.min(numberOfAssignDetails, maxInitialsToShow); i++) {
        let initials = filterFirstLetters(assignDetails[i].name); // Bereinigter Name für Initialen
        let bgNameColor = assignDetails[i].bgNameColor;
        let assignInitials = document.createElement('span');
        assignInitials.textContent = initials;
        assignInitials.style.backgroundColor = bgNameColor;
        assignInitials.classList.add('assign-initials');
        assignedInitial.appendChild(assignInitials);
    }if (numberOfAssignDetails > maxInitialsToShow) {
        let additionalCount = numberOfAssignDetails - maxInitialsToShow;
        let additionalInitials = document.createElement('span');
        additionalInitials.textContent = `+${additionalCount}`;
        additionalInitials.classList.add('additional-initials'); // Eine Klasse für das Styling des "zusätzlichen" Span
        assignedInitial.appendChild(additionalInitials);
    }
}

function filterNameAlphabet() {
    assign.sort((a, b) => a.name.localeCompare(b.name));
}

function getSubtasks() {
    let subtaskItems = document.querySelectorAll('#subtaskList li');
    let subtasks = [];
    subtaskItems.forEach(item => {
        let subtaskTitle = item.textContent.trim().substring();
        subtasks.push({ title: subtaskTitle, done: false });
    });
    globalSubtasks = subtasks;
    return subtasks;
}

function createUserTask(title, description, date, userCategory, assignDetails, subtasks, selectedPriority) {
    return {
        title: title,
        description: description,
        date: date,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        category: "toDo",
        priority: selectedPriority
    };
}


function requiredFields() {
    let isValid = true; // Gültigkeitsstatus initial auf true setzen
    let title = document.getElementById('title');
    let date = document.getElementById('dueDate');
    let userCategory = document.querySelector('input[name="category"]:checked');

    // Zurücksetzen der Styles für alle Felder, um frühere Markierungen zu entfernen
    title.style.border = '';
    date.style.border = '';

    if (title.value === '') {
        title.style.border = '1px solid red';
        isValid = false; 
    } if (date.value === '') {
        date.style.border = '1px solid red';
        isValid = false; 
    } if (!userCategory) {
        document.getElementById('category').style.border = '1px solid red';
        isValid = false;
    }

    return isValid; // Den gesamten Gültigkeitsstatus zurückgeben
}

document.addEventListener('DOMContentLoaded', function() {
    setPriority('Medium');
    let titleInput = document.getElementById('title');
    let dateInput = document.getElementById('dueDate');

    titleInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = ''; // Entfernt die rote Umrandung, wenn das Feld nicht leer ist
        }
    });

    dateInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = ''; // Entfernt die rote Umrandung, wenn das Feld nicht leer ist
        }
    });
});



async function submitTask(event) {
    event.preventDefault();

    if (!requiredFields()) {
        console.log('Erforderliche Felder fehlen. Formular wird nicht abgesendet.');
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
        window.location.href = "board.html";
        
    } catch (error) {
        
        console.error("Fehler beim Posten der Daten:", error);
    }
}

function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        // Hinzufügen des neuen Subtasks zu globalSubtasks
        let subtaskId = globalSubtasks.length; // Eindeutiger ID für das neue Subtask
        globalSubtasks.push({ title: subtaskText, done: false, id: subtaskId });
        // Liste neu rendern
        renderSubtasks();
        resetSubtaskFocus()
        subtaskInput.value = ''; // Eingabefeld leeren
        scrollToBottomAddtask(); // Zum Ende der Liste scrollen
    }
}

function inputSetFocus() {
    document.getElementById('subtasks').focus();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderImgSubtask').style.display = 'none';
}

function resetSubtaskFocus() {
    document.getElementById('subtasks').blur();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'none';
    document.getElementById('placeholderImgSubtask').style.display = 'flex';
}

function editSubtaskAddtask(id) {
    let subtaskToEdit = globalSubtasks[id];
    let editElement = document.getElementById(`subtaskToEdit${id}`);
    editElement.innerHTML = `<input type="text" id="addSubtask-input${id}" value="${subtaskToEdit.title}"> <div><img src="assets/img/delete.png" onclick="clearSubtaskInput(${id})"> | <img src="assets/img/hook.png" onclick="confirmAddTaskSubtaskEdit(${id})"></div>`; 
}

function confirmAddTaskSubtaskEdit(id) {
    let editedSubtask = document.getElementById(`addSubtask-input${id}`).value;
    globalSubtasks[id].title = editedSubtask;
    renderSubtasks();
}

function clearSubtaskInput(id) {
    document.getElementById(`addSubtask-input${id}`).value = '';
}

function clearSubtask() {
    document.getElementById('subtasks').value = ''; 
}

function clearCategorySelection() {
    // Auswahl aller Radio-Buttons innerhalb des Dropdown-Menüs für Kategorien
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    
    // Durchlaufen aller Radio-Buttons und Setzen ihrer `checked`-Eigenschaft auf `false`
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    
    // Optional: Zurücksetzen des Textes des Dropdown-Buttons auf den Standardwert
    document.getElementById('categoryText').textContent = 'Category';
}

function deleteSubtask(id) {
    globalSubtasks.splice(id, 1);
    renderSubtasks();
}

function renderSubtasks() {
    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    if (Array.isArray(globalSubtasks)) {
        globalSubtasks.forEach((subtaskToEdit, index) => {
            let subtaskItem = `
            <div id="subtaskToEdit${index}" class="subtask-item">
                <li class="addtask-subtask-li">${subtaskToEdit.title}</li>
                 <div class="edit-delete-img">
                    <img src="assets/img/edit.png" alt="Edit" onclick="editSubtaskAddtask(${index})"> | 
                    <img src="assets/img/delete.png" alt="Delete" onclick="deleteSubtask(${index})">
                </div>
            </div>`;
            subtaskList.innerHTML += subtaskItem;
        });
    }
}

function scrollToBottomAddtask() {
    const maincontainerAddtask = document.getElementById('maincontainerAddtask');
    if (maincontainerAddtask) {
        maincontainerAddtask.scrollTop = maincontainerAddtask.scrollHeight;
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

        let loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            moveLoggedInUserToTop(assign, loggedInUser); // Pass [`assign`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22f%3A%5C%5Cjoin_gruppenarbeit%5C%5Cjs%5C%5Cadd_task.js%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Ff%253A%2Fjoin_gruppenarbeit%2Fjs%2Fadd_task.js%22%2C%22path%22%3A%22%2Ff%3A%2Fjoin_gruppenarbeit%2Fjs%2Fadd_task.js%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A4%2C%22character%22%3A0%7D%5D "js/add_task.js") as an argument
        }

        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}


function createLabel(assignContacts) {
    let label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = assignContacts.name;
    checkbox.dataset.bgColor = assignContacts.bgNameColor;
    
    checkbox.addEventListener('change', () => {
        getAssignedDetails();
    });

    let initials = filterFirstLetters(assignContacts.name.replace(" (YOU)", ""));
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

    return label;
}

function generateAssign() {
    let assignContact = document.getElementById('assigned');
    let loggedInUser = localStorage.getItem('loggedInUser'); // Dies sollte durch den tatsächlichen Namen des eingeloggten Benutzers ersetzt werden

    if (!assignContact) {
        console.error("Element mit ID 'assigned' wurde nicht gefunden.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    filterNameAlphabet();
    moveLoggedInUserToTop(assign, loggedInUser); // Korrigiert, um `assign` und `loggedInUser` zu übergeben
    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];
        let label = createLabel(assignContacts);
        assignContact.appendChild(label);
    }
}


function moveLoggedInUserToTop(assign, loggedInUser) {
    let userIndex = assign.findIndex(contact => contact.name.replace(/\s\(YOU\)$/i, '') === loggedInUser);
    
    if (userIndex !== -1) {
        let user = assign.splice(userIndex, 1)[0];
        
        if (!user.name.endsWith(" (YOU)")) {
            user.name += " (YOU)";
        }
        assign.unshift(user);
    }
}

function filterFirstLetters(name) {
    let cleanedName = name.replace(/\(YOU\)/ig, '');
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

function openDropdownContentCategory() {
    let categoryContent = document.getElementById('categoryContent');
    let dropdownArrowCategory = document.getElementById('dropdownArrowCategory');
    categoryContent.classList.toggle('show');
    dropdownArrowCategory.classList.toggle('rotate');

    function handleClickOutside(event) {
        if (!categoryContent.contains(event.target)) {
            categoryContent.classList.remove('show'); // Verbergen des Dropdown-Inhalts
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside); // Entfernen des Event Listeners
        }
    }

    document.querySelectorAll('.dropdown-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            let selectedText = this.nextElementSibling.innerText; 
    
            document.getElementById('categoryText').innerText = selectedText;
            document.getElementById('category').style.border = '';
            document.getElementById('categoryContent').classList.remove('show');
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside);
        });
    });
    if (categoryContent.classList.contains('show')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    }
}

function openDropdown() {
    console.log('openDropdown');
    let dropdownContent = document.getElementById('assigned');
    let dropdownArrowAssign = document.getElementById('dropdownArrowAssign');
    dropdownContent.classList.toggle('show-assign'); // Toggle die Klasse, um den Dropdown-Inhalt anzuzeigen oder zu verbergen
    dropdownArrowAssign.classList.toggle('rotate'); // Drehe den Dropdown-Pfeil
    
    function handleClickOutside(event) {
        if (!dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show-assign'); // Verbergen des Dropdown-Inhalts
            dropdownArrowAssign.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside); // Entfernen des Event Listeners
        }
    }

    if (dropdownContent.classList.contains('show-assign')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }
}

function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });
    
    globalSubtasks = [];
    document.getElementById('subtaskList').innerHTML = '';
    assignDetails = [];
    document.getElementById('assignedInitial').innerHTML = '';
    clearCategorySelection();
}

function setMinDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let currentDate = yyyy + '-' + mm + '-' + dd;

    let dueDateElement = document.getElementById('dueDate');
    let editDateElement = document.getElementById('editDate');
    let taskDateElement = document.getElementById('taskDueDate');

    if (dueDateElement) {
        dueDateElement.min = currentDate;
    } 
    if (editDateElement) {
        editDateElement.min = currentDate;
    } 
    if (taskDateElement) {
        taskDateElement.min = currentDate;
    }
}
