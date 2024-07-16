let assign = [];
let globalSubtasks = [];
let currentAssignIndex = 0;
let selectedPriority = null;

/**
 * Resets the state of the given buttons by removing the selected class and restoring original images.
 * @param {HTMLElement[]} buttons - Array of button elements to reset.
 */
function resetButtons(buttons) {
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image');
    });
}

/**
 * Gets the button corresponding to the specified priority.
 * @param {HTMLElement} container - The container holding the buttons.
 * @param {string} priority - The priority to find the button for.
 * @returns {HTMLElement} - The corresponding button element.
 */
function getButtonByPriority(container, priority) {
    let button;
    switch (priority) {
        case 'Urgent':
            button = container.querySelector('.urgent-button');
            break;
        case 'Medium':
            button = container.querySelector('.medium-button');
            break;
        case 'Low':
            button = container.querySelector('.low-button');
            break;
        default:
            console.error('Unknown priority:', priority);
    }
    return button;
}

/**
 * Marks a button as selected and updates its image.
 * @param {HTMLElement} button - The button to select.
 * @param {string} priority - The priority associated with the button.
 */
function setButtonAsSelected(button, priority) {
    if (button) {
        button.classList.add('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-clicked-image');
        selectedPriority = priority;
    }
}

/**
 * Sets the selected priority across all relevant button containers.
 * @param {string} priority - The priority to set.
 */
function setPriority(priority) {
    const containers = document.querySelectorAll('.prio-buttons, .addtask-popup-prio-buttons');
    containers.forEach(container => {
        const buttons = container.querySelectorAll('button');
        resetButtons(buttons);
        const button = getButtonByPriority(container, priority);
        setButtonAsSelected(button, priority);
    });
}

/**
 * Sorts the assigned contacts alphabetically by name.
 */
function sortAssignAlphabetically() {
    assign.sort((a, b) => {
        let nameA = a.name.toUpperCase(); 
        let nameB = b.name.toUpperCase();
        return nameA.localeCompare(nameB);
    });
}

/**
 * Retrieves details of assigned contacts from checked checkboxes.
 * @returns {Object[]} - Array of assigned contact details.
 */
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

/**
 * Sorts the assigned contacts alphabetically by name.
 */
function filterNameAlphabet() {
    assign.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Collects subtasks from the subtask list.
 * @returns {Object[]} - Array of subtasks.
 */
function getSubtasks() {
    let subtaskItems = document.querySelectorAll('#subtaskList li');
    let subtasks = [];
    
    subtaskItems.forEach(item => {
        let subtaskTitle = item.textContent.trim();
        subtasks.push({ title: subtaskTitle, done: false });
    });
    
    globalSubtasks = subtasks;
    return subtasks;
}

/**
 * Creates a user task object with specified details.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} date - Due date.
 * @param {string} userCategory - User category.
 * @param {Object[]} assignDetails - Assigned contacts details.
 * @param {Object[]} subtasks - Subtasks.
 * @param {string} selectedPriority - Selected priority.
 * @returns {Object} - User task object.
 */
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

/**
 * Sets up the initial state and event listeners when the DOM content is loaded.
 */
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

/**
 * Adds a subtask to the list and updates the UI.
 */
function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();
    
    if (subtaskText !== '') {
        let subtaskId = globalSubtasks.length;
        globalSubtasks.push({ title: subtaskText, done: false, id: subtaskId });
        renderSubtasks();
        resetSubtaskFocus();
        subtaskInput.value = '';
        scrollToBottomAddtask();
    }
}

/**
 * Sets up event listeners when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('subtasks').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtaskToList();
        }
    });
});

/**
 * Sets focus on the subtask input and displays the confirm button.
 */
function inputSetFocus() {
    document.getElementById('subtasks').focus();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderImgSubtask').style.display = 'none';
}

/**
 * Resets focus from the subtask input and hides the confirm button.
 */
function resetSubtaskFocus() {
    document.getElementById('subtasks').blur();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'none';
    document.getElementById('placeholderImgSubtask').style.display = 'flex';
}

/**
 * Prepares the UI for editing a subtask.
 * @param {number} id - ID of the subtask to edit.
 */
function editSubtaskAddtask(id) {
    let subtaskToEdit = globalSubtasks[id];
    let editElement = document.getElementById(`subtaskToEdit${id}`);
    editElement.innerHTML = `<li class="edit-li"><input class="editInputSubtask" type="text" id="addSubtask-input${id}" value="${subtaskToEdit.title}"> <div class="edit-and-delete-img"><div class="btn-hover-task"><img src="assets/img/delete.png" onclick="clearSubtaskInput(${id})"></div> | <div class="btn-hover-task"><img src="assets/img/hook.png" onclick="confirmAddTaskSubtaskEdit(${id})"></div></div></li>`;
}

/**
 * Confirms and updates the edited subtask.
 * @param {number} id - ID of the subtask to update.
 */
function confirmAddTaskSubtaskEdit(id) {
    let editedSubtask = document.getElementById(`addSubtask-input${id}`).value;
    globalSubtasks[id].title = editedSubtask;
    renderSubtasks();
}

/**
 * Clears the input of a subtask.
 * @param {number} id - ID of the subtask.
 */
function clearSubtaskInput(id) {
    document.getElementById(`addSubtask-input${id}`).value = '';
}

/**
 * Clears the current input field for subtasks.
 */
function clearSubtask() {
    document.getElementById('subtasks').value = '';
}

/**
 * Resets category selections in the UI.
 */
function clearCategorySelection() {
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    
    document.getElementById('categoryText').textContent = 'Category';
}

/**
 * Deletes a subtask by its ID.
 * @param {number} id - ID of the subtask to delete.
 */
function deleteSubtask(id) {
    globalSubtasks.splice(id, 1);
    renderSubtasks();
}

/**
 * Generates HTML for the progress of subtasks.
 * @param {Object} taskItem - The task item containing subtasks.
 * @returns {string} - HTML for subtasks progress.
 */
function generateSubtasksProgressHTML(taskItem) {
    if (!taskItem.subtasks || taskItem.subtasks.length === 0) return '';

    let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    return buildSubtasksProgressHTML(taskItem, completedSubtasks);
}

/**
 * Scrolls the task list to the bottom of the add task container.
 */
function scrollToBottomAddtask() {
    const maincontainerAddtask = document.getElementById('maincontainerAddtask');
    if (maincontainerAddtask) {
        maincontainerAddtask.scrollTop = maincontainerAddtask.scrollHeight;
    }
}

/**
 * Filters and returns the first letters of a name.
 * @param {string} name - The name to filter.
 * @returns {string} - Initials from the name.
 */
function filterFirstLetters(name) {
    let cleanedName = name.replace(/\(YOU\)/ig, '');
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

/**
 * Clears all subtasks and resets UI elements.
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

/**
 * Sets the minimum date for date inputs to today.
 */
function setMinDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();

    let currentDate = `${yyyy}-${mm}-${dd}`;

    let dueDateElement = document.getElementById('dueDate');
    let editDateElement = document.getElementById('editDate');
    let taskDateElement = document.getElementById('taskDueDate');

    if (dueDateElement) dueDateElement.min = currentDate;
    if (editDateElement) editDateElement.min = currentDate;
    if (taskDateElement) taskDateElement.min = currentDate;
}

/**
 * 
Renders the subtask list.*/
function renderSubtasks() {
    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    if (Array.isArray(globalSubtasks)) {
        globalSubtasks.forEach((subtaskToEdit, index) => {
            let subtaskItem = createSubtaskItemHTML(subtaskToEdit, index);
            subtaskList.innerHTML += subtaskItem;
        });
    }
}