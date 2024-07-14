let assign = [];
let globalSubtasks = [];
let currentAssignIndex = 0;
let selectedPriority = null;

function resetButtons(buttons) {
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image');
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
        img.src = button.getAttribute('data-clicked-image'); 
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

document.addEventListener('DOMContentLoaded', function() {
    setPriority('Medium');
    let titleInput = document.getElementById('title');
    let dateInput = document.getElementById('dueDate');
    titleInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = '';
        }
    });
    dateInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = '';
        }
    });
});


function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        let subtaskId = globalSubtasks.length; 
        globalSubtasks.push({ title: subtaskText, done: false, id: subtaskId });
        renderSubtasks();
        resetSubtaskFocus()
        subtaskInput.value = ''; 
        scrollToBottomAddtask(); 
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('subtasks').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtaskToList();
        }
    });
});

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
    editElement.innerHTML = `<li class="edit-li"><input class="editInputSubtask" type="text" id="addSubtask-input${id}" value="${subtaskToEdit.title}"> <div class="edit-and-delete-img"><div class="btn-hover-task"><img src="assets/img/delete.png" onclick="clearSubtaskInput(${id})"></div> | <div class="btn-hover-task"><img src="assets/img/hook.png" onclick="confirmAddTaskSubtaskEdit(${id})"></div></div></li>`; 
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
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    
    document.getElementById('categoryText').textContent = 'Category';
}

function deleteSubtask(id) {
    globalSubtasks.splice(id, 1);
    renderSubtasks();
}

function generateSubtasksProgressHTML(taskItem) {
    if (!taskItem.subtasks || taskItem.subtasks.length === 0) return '';

    let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    return buildSubtasksProgressHTML(taskItem, completedSubtasks);
}

function scrollToBottomAddtask() {
    const maincontainerAddtask = document.getElementById('maincontainerAddtask');
    if (maincontainerAddtask) {
        maincontainerAddtask.scrollTop = maincontainerAddtask.scrollHeight;
    }
}


function filterFirstLetters(name) {
    let cleanedName = name.replace(/\(YOU\)/ig, '');
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}


/**
 * Clears all subtask-related selections and resets the task form to its initial state.
 * This function performs several actions to reset the state of the task form, specifically targeting subtasks and related selections:
 * - Removes the 'selected' class from all priority buttons, effectively deselecting them, and resets their images to the original ones specified in their 'data-original-image' attribute.
 * - Clears the global `globalSubtasks` array, removing all stored subtask data.
 * - Empties the inner HTML of the 'subtaskList' element, removing all listed subtasks from the UI.
 * - Resets the `assignDetails` array, clearing all stored assignment details.
 * - Clears the inner HTML of the 'assignedInitial' element, removing all visual indications of assigned contacts.
 * - Calls `clearCategorySelection` to reset any category selections made, assuming this function is defined elsewhere and handles the logic for clearing category-related selections.
 * 
 * @remarks
 * - Assumes the presence of elements with the class '.prio-buttons button' for priority buttons, 'subtaskList' for the subtask list container, and 'assignedInitial' for displaying assigned contacts' initials.
 * - The function directly modifies global variables `globalSubtasks` and `assignDetails`, which should be defined in the broader scope.
 */
function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image');
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
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
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
