let editTaskPopup;
let currentTask;

function loadTaskForEdit(firebaseId) {
    for (let i = 0; i < task.length; i++) {
        let editTask = task[i];
        if (editTask.firebaseId === firebaseId) {
            currentTask = editTask;
            break;
        }
    }
}

function showTaskDetails() {
    document.getElementById('editTitle').value = currentTask.title;
    document.getElementById('editDescription').value = currentTask.description;
    document.getElementById('editAssigned').value = currentTask.assign;
    document.getElementById('editDate').value = currentTask.date;
    document.getElementById('subtaskListEdit').innerHTML = '';
    document.getElementById('categoryTextEdit').innerText = currentTask.userCategory;
    setCurrentPriority(currentTask.priority);
    const radios = document.querySelectorAll('.dropdown-option input[type="radio"]');
    radios.forEach(radio => {
        if (radio.value === currentTask.userCategory) {
            radio.checked = true;
        }
    });

    showInitialsEditTask();
    showSubtasksEditTask();
}

function showInitialsEditTask() {
    let initialsElement = document.getElementById('editAssignedInitials');
    initialsElement.innerHTML = '';
    const maxInitialsToShow = 6;
    if (Array.isArray(currentTask.assign)) {
        let assignCount = currentTask.assign.length;
        for (let i = 0; i < Math.min(assignCount, maxInitialsToShow); i++) {
            let assignData = currentTask.assign[i];
            let spanElement = `<span class="show-initials-edit" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`;
            initialsElement.innerHTML += spanElement;
        }
        if (assignCount > maxInitialsToShow) {
            let additionalCount = assignCount - maxInitialsToShow;
            let additionalSpanElement = `<span class="show-initials-edit additional">+${additionalCount}</span>`;
            initialsElement.innerHTML += additionalSpanElement;
        }
    }
}

function markCheckedCheckboxes() {
    let assignContact = document.getElementById('editAssigned');
    if (!assignContact) {
        console.error("Element mit ID 'editAssigned' wurde nicht gefunden.");
        return;
    }

    let checkboxes = assignContact.querySelectorAll('input[type="checkbox"]');
    let assignArray = Array.isArray(currentTask.assign) ? currentTask.assign : [];

    for (let checkbox of checkboxes) {
        let [name, initials, bgColor] = checkbox.value.split('|');
        let cleanedName = cleanNameForInitials(name);
        let generatedInitials = filterFirstLetters(cleanedName);

        if (assignArray.some(assign => cleanNameForInitials(assign.name).trim().toLowerCase() === cleanedName.trim().toLowerCase() && assign.initials === generatedInitials && assign.bgNameColor === bgColor)) {
            checkbox.checked = true;
        }
    }
}

function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}

function filterFirstLetters(name) {
    let cleanedName = cleanNameForInitials(name);
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

function editInputSetFocus() {
    document.getElementById('editSubtasks').focus();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderEditImgSubtask').style.display = 'none';
}

function resetEditSubtaskFocus() {
    document.getElementById('editSubtasks').blur();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'none';
    document.getElementById('placeholderEditImgSubtask').style.display = 'flex';
}

function showSubtasksEditTask() {
    let subtaskList = document.getElementById('subtaskListEdit');
    subtaskList.innerHTML = '';
    if (Array.isArray(currentTask.subtasks)) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            let subtask = currentTask.subtasks[i];
            let liElement = `
            <div class="editSub" id="subtask${i}">
        <li class="edit-list-row">${subtask.title}</li>
        <div class="edit-delete-img-edit-task">
            <div class="btn-hover">
                <img src="assets/img/edit.png" onclick="editSubtask(${i})">
            </div>
            |
            <div class="btn-hover">
                <img src="assets/img/delete.png" onclick="deleteEditSubtask(${i})">
            </div>
        </div>
    </div>`;
            subtaskList.innerHTML += liElement;
        }
    }
}


function setCurrentPriority(priority) {
    currentTask.priority = priority;
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); 
    });

    let button;
    if (priority === 'Urgent') {
        button = document.querySelector('.urgent-button');
    } else if (priority === 'Medium') {
        button = document.querySelector('.medium-button');
    } else if (priority === 'Low') {
        button = document.querySelector('.low-button');
    } else {
        console.error('Unknown priority:', priority);
        return;
    }

    if (button) {
        button.classList.add('selected');
        selectedPriority = priority;
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-clicked-image');
    }
}

function addSubtask() {
    let subtaskTitle = document.getElementById('editSubtasks').value;
    if (!currentTask.subtasks) {
        currentTask.subtasks = [];
    }
    currentTask.subtasks.push({ title: subtaskTitle });
    document.getElementById('editSubtasks').value = '';
    resetEditSubtaskFocus();
    showSubtasksEditTask();
    
    scrollToBottom();
}

function scrollToBottom() {
    const editTaskMainContainer = document.getElementById('editTaskMainContainer');
    if (editTaskMainContainer) {
        editTaskMainContainer.scrollTop = editTaskMainContainer.scrollHeight;
    }
}

function deleteEditSubtask(i) {
    currentTask.subtasks.splice(i, 1);
    showSubtasksEditTask()
}

function editSubtask(i) {
    let subtask = currentTask.subtasks[i];
    document.getElementById(`subtask${i}`).innerHTML = `<div class="editSub"><input type="text" class="editInputSub" id="edit-input${i}" value="${subtask.title}"> <div class="editSubImg "><div class="btn-hover"><img src="assets/img/delete.png" onclick="clearEditSubtask(${i})"></div> | <div class="btn-hover"><img height-btn" src="assets/img/hook.png" onclick="confirmEditSubtask(${i})"></div></div>`;
}

function clearEditSubtaskInput() {
    document.getElementById('editSubtasks').value = '';
}

function clearEditSubtask(i) {
    document.getElementById(`subtask${i}`).innerHTML = `<input type="text" id="edit-input${i}"><div><img src="assets/img/delete.png" onclick="clearEditSubtask(${i})"> | <img src="assets/img/hook.png" onclick="confirmEditSubtask(${i})"></div>`;
}

function confirmEditSubtask(i) {
    let inputElement = document.getElementById(`edit-input${i}`);

    if (inputElement) {
        let inputValue = inputElement.value;
        currentTask.subtasks[i].title = inputValue;
    }
    openEditTask(currentTask.firebaseId);
    scrollToBottom();
}

function openEditTask(firebaseId) {
    loadTaskForEdit(firebaseId);
    document.getElementById('modalTaskcard').classList.add('modal-task-popup-display-none');
    document.getElementById('editTaskcard').classList.remove('edit-task-display-none');
    generateEditAssign();
    showTaskDetails();
    document.getElementById('postEditBtn').addEventListener('click', updateCurrentTask);  
}

function closeEditTaskPopup() {
    document.getElementById('editTaskcard').classList.add('edit-task-display-none');
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
}

function updateCurrentTask() {
    currentTask.title = document.getElementById('editTitle').value;
    currentTask.description = document.getElementById('editDescription').value;
    currentTask.date = document.getElementById('editDate').value;
    currentTask.userCategory = document.querySelector('input[name="category"]:checked')?.value;

    let assignContact = document.getElementById('editAssigned');
    if (assignContact) {
        let checkboxes = assignContact.querySelectorAll('input[type="checkbox"]');
        currentTask.assign = []; 

        for (let checkbox of checkboxes) {
            if (checkbox.checked) {
                let [name, initials, bgColor] = checkbox.value.split('|');
                currentTask.assign.push({
                    name: name,
                    initials: initials,
                    bgNameColor: bgColor
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

function openDropdownEditAssign() {
    let dropdown = document.querySelector('.dropdown-edit-content');
    document.getElementById('dropdownArrow').classList.toggle('rotate');
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

        closeEditTaskPopup();
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        alert(`Fehler beim Aktualisieren der Aufgabe: ${error.message}`);
    }
}

function openEditDropdownContentCategory() {
    let categoryContent = document.getElementById('categoryContentEdit');
    let dropdownArrowCategory = document.getElementById('dropdownArrowCategoryEdit');
    categoryContent.classList.toggle('show');
    dropdownArrowCategory.classList.toggle('rotate');

    function handleClickOutside(event) {
        if (!categoryContent.contains(event.target)) {
            categoryContent.classList.remove('show');
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside);
        }
    }

    document.querySelectorAll('.dropdown-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            let selectedText = this.nextElementSibling.innerText;
            document.getElementById('categoryTextEdit').innerText = selectedText;
            categoryContent.classList.remove('show');
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside);
        });
    });

    if (categoryContent.classList.contains('show')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    }
}
