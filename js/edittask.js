/**
 * Opens the edit task popup.
 * @type {HTMLElement}
 */
let editTaskPopup;

/**
 * Stores the current task being edited.
 * @type {Object}
 */
let currentTask;

/**
 * Loads a task for editing based on its Firebase ID.
 * @param {string} firebaseId - The Firebase ID of the task to load.
 */
function loadTaskForEdit(firebaseId) {
    for (let i = 0; i < task.length; i++) {
        let editTask = task[i];
        if (editTask.firebaseId === firebaseId) {
            currentTask = editTask;
            break;
        }
    }
}

/**
 * Displays the details of the current task in the edit form.
 */
function showTaskDetails() {
    document.getElementById('editTitle').value = currentTask.title;
    document.getElementById('editDescription').value = currentTask.description;
    document.getElementById('editAssigned').value = currentTask.assign;
    document.getElementById('editDate').value = currentTask.date;
    document.getElementById('subtaskListEdit').innerHTML = '';
    
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

/**
 * Clears the content of an HTML element by its ID.
 * @param {string} elementId - The ID of the element to clear.
 */
function clearElementContent(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

/**
 * Creates a span element with specified styles.
 * @param {string} className - The class name for the span.
 * @param {string} textContent - The text content for the span.
 * @param {string} [backgroundColor] - The background color for the span.
 * @returns {HTMLElement} The created span element.
 */
function createEditAssignInitialSpan(className, textContent, backgroundColor) {
    let spanElement = document.createElement('span');
    spanElement.className = className;
    spanElement.textContent = textContent;
    if (backgroundColor) {
        spanElement.style.backgroundColor = backgroundColor;
    }
    return spanElement;
}

/**
 * Appends initials to an element up to a maximum number.
 * @param {string} elementId - The ID of the element to append to.
 * @param {Array} assignData - The data containing initials.
 * @param {number} maxInitialsToShow - The maximum number of initials to show.
 */
function appendInitialsToElement(elementId, assignData, maxInitialsToShow) {
    const element = document.getElementById(elementId);
    let assignCount = assignData.length;
    for (let i = 0; i < Math.min(assignCount, maxInitialsToShow); i++) {
        let data = assignData[i];
        let spanElement = createEditAssignInitialSpan("show-initials-edit", data.initials, data.bgNameColor);
        element.appendChild(spanElement);
    }
    if (assignCount > maxInitialsToShow) {
        let additionalCount = assignCount - maxInitialsToShow;
        let additionalSpanElement = createEditAssignInitialSpan("show-initials-edit additional", `+${additionalCount}`);
        element.appendChild(additionalSpanElement);
    }
}

/**
 * Displays the initials of the assigned users in the edit form.
 */
function showInitialsEditTask() {
    clearElementContent('editAssignedInitials');
    const maxInitialsToShow = 6;
    if (Array.isArray(currentTask.assign)) {
        appendInitialsToElement('editAssignedInitials', currentTask.assign, maxInitialsToShow);
    }
}

/**
 * Creates a checkbox input element for a given contact.
 * 
 * @param {Object} assignContact - The contact information.
 * @param {string} assignContact.name - The name of the contact.
 * @param {string} assignContact.bgNameColor - The background color for the contact's name.
 * @returns {HTMLInputElement} The created checkbox input element.
 */
function createCheckboxForAssign(assignContact) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = `${assignContact.name}|${filterFirstLetters(assignContact.name)}|${assignContact.bgNameColor}`;

    checkbox.addEventListener('change', function() {
        let label = this.parentElement;
        if (this.checked) {
            label.style.backgroundColor = '#2a3647';
            label.style.borderRadius = '10px';
            label.style.color = 'white';
        } else {
            label.style.backgroundColor = 'white';
            label.style.color = 'black';
        }
    });

    return checkbox;
}

/**
 * Creates and appends labels with checkboxes for a list of contacts to a specified element.
 * 
 * @param {string} elementId - The ID of the element to append the labels to.
 * @param {Object[]} assignContacts - The list of contacts to create labels for.
 * @param {string} assignContacts[].name - The name of the contact.
 * @param {string} assignContacts[].bgNameColor - The background color for the contact's name.
 */
function createLabelEditAssign(elementId, assignContacts) {
    const element = document.getElementById(elementId);
    assignContacts.forEach(contact => {
        let label = document.createElement('label');
        let checkbox = createCheckboxForAssign(contact);
        let initialsSpan = createEditAssignInitialSpan('assign-initials', filterFirstLetters(contact.name), contact.bgNameColor);
        let nameSpan = createEditAssignInitialSpan('assign-name', contact.name);

        label.appendChild(initialsSpan);
        label.appendChild(nameSpan);
        label.appendChild(checkbox);

        element.appendChild(label);
    });
}

/**
 * Generates the assign contacts section in the edit form.
 */
function generateEditAssign() {
    clearElementContent('editAssigned');
    if (assign.length > 0) {
        createLabelEditAssign('editAssigned', assign);
    }
    markCheckedCheckboxes();
}

/**
 * Marks the checkboxes for assigned contacts and styles the corresponding labels.
 */
function markCheckedCheckboxes() {
    let assignContact = document.getElementById('editAssigned');
    if (!assignContact) {
        console.error("Element with ID 'editAssigned' not found.");
        return;
    }

    let checkboxes = assignContact.querySelectorAll('input[type="checkbox"]');
    let assignArray = Array.isArray(currentTask.assign) ? currentTask.assign : [];

    checkboxes.forEach(checkbox => {
        let [name, initials, bgColor] = checkbox.value.split('|');
        if (isAssigned(assignArray, name, initials, bgColor)) {
            checkbox.checked = true;
            styleAssignedLabel(checkbox.parentElement);
        }
    });
}

/**
 * Styles a label for an assigned contact.
 * 
 * @param {HTMLElement} label - The label element to style.
 */
function styleAssignedLabel(label) {
    label.style.backgroundColor = '#2a3647';
    label.style.borderRadius = '10px';
    label.style.color = 'white';
}

/**
 * Checks if a contact is assigned based on the given parameters.
 * 
 * @param {Object[]} assignArray - The array of assigned contacts.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} bgColor - The background color for the contact's name.
 * @returns {boolean} True if the contact is assigned, false otherwise.
 */
function isAssigned(assignArray, name, initials, bgColor) {
    let cleanedName = cleanNameForInitials(name);
    let generatedInitials = filterFirstLetters(cleanedName);
    return assignArray.some(assign => 
        cleanNameForInitials(assign.name).trim().toLowerCase() === cleanedName.trim().toLowerCase() &&
        assign.initials === generatedInitials &&
        assign.bgNameColor === bgColor
    );
}

/**
 * Cleans the name for generating initials.
 * @param {string} name - The name to clean.
 * @returns {string} The cleaned name.
 */
function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}

/**
 * Filters the first letters of each word in a name.
 * @param {string} name - The name to filter.
 * @returns {string} The first letters of the name.
 */
function filterFirstLetters(name) {
    let cleanedName = cleanNameForInitials(name);
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

/**
 * Sets focus on the edit input and shows relevant buttons.
 */
function editInputSetFocus() {
    document.getElementById('editSubtasks').focus();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderEditImgSubtask').style.display = 'none';
}

/**
 * Resets the focus on the edit input and hides relevant buttons.
 */
function resetEditSubtaskFocus() {
    document.getElementById('editSubtasks').blur();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'none';
    document.getElementById('placeholderEditImgSubtask').style.display = 'flex';
}

/**
 * Displays the subtasks of the current task in the edit form.
 */
function showSubtasksEditTask() {
    let subtaskList = document.getElementById('subtaskListEdit');
    subtaskList.innerHTML = '';
    if (Array.isArray(currentTask.subtasks)) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            let subtask = currentTask.subtasks[i];
            let liElement = createSubtaskHTML(subtask, i);
            subtaskList.innerHTML += liElement;
        }
    }
}

/**
 * Sets the current task priority and updates the UI.
 * @param {string} priority - The priority level to set.
 */
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

/**
 * Opens the edit task modal and populates it with task data.
 * @param {string} firebaseId - The Firebase ID of the task to edit.
 */
function openEditTask(firebaseId) {
    loadTaskForEdit(firebaseId);
    document.getElementById('modalTaskcard').classList.add('modal-task-popup-display-none');
    document.getElementById('editTaskcard').classList.remove('edit-task-display-none');
    generateEditAssign();
    showTaskDetails();
    document.getElementById('postEditBtn').addEventListener('click', updateCurrentTask);
}

/**
 * Closes the edit task popup and reverts to the task modal.
 */
function closeEditTaskPopup() {
    document.getElementById('editTaskcard').classList.add('edit-task-display-none');
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
}

/**
 * Updates the current task with data from the edit form.
 */
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