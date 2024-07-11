let editTaskPopup;
let currentTask;
/**
 * Loads a task into the current editing context based on a given Firebase ID.
 * This function iterates over an array of tasks, searching for a task with a matching Firebase ID. When found, it sets this task as the current task to be edited.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to be loaded for editing.
 * 
 * @remarks
 * - Assumes the existence of a global `task` array containing task objects.
 * - Each task object in the array is expected to have a `firebaseId` property.
 * - Assumes a global variable `currentTask` is used to hold the task object currently being edited.
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
 * Populates the task editing form with details from the current task.
 * This function updates various elements of the task editing form with the details of the current task. It performs the following actions:
 * 1. Sets the value of the 'editTitle' input to the current task's title.
 * 2. Sets the value of the 'editDescription' textarea to the current task's description.
 * 3. Sets the value of the 'editAssigned' input to the current task's assigned contacts. (Note: This might require additional processing to display properly.)
 * 4. Sets the value of the 'editDate' input to the current task's date.
 * 5. Clears the innerHTML of the 'subtaskListEdit' element, preparing it for updated content.
 * 6. Sets the innerText of the 'categoryTextEdit' element to the current task's user category.
 * 7. Calls `setCurrentPriority` with the current task's priority, a function assumed to update the priority selection in the UI.
 * 8. Iterates over all radio buttons within elements with the class 'dropdown-option', checking the one that matches the current task's user category.
 * 9. Calls `showInitialsEditTask` and `showSubtasksEditTask`, functions assumed to update the UI with the initials of assigned contacts and the list of subtasks, respectively.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object containing the task details.
 * - Assumes `setCurrentPriority`, `showInitialsEditTask`, and `showSubtasksEditTask` are defined and handle their respective UI updates.
 */
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
/**
 * Displays the initials of assigned contacts for a task, with a limit on the number shown.
 * This function updates the 'editAssignedInitials' element to show the initials of contacts assigned to the current task. It adheres to a maximum number of initials to display, showing an additional indicator if there are more contacts than this maximum. The steps are as follows:
 * 1. Retrieves the 'editAssignedInitials' element and clears its current content.
 * 2. Sets a maximum number of initials to display.
 * 3. Checks if the currentTask.assign is an array to proceed with displaying initials.
 * 4. Iterates over each assigned contact up to the maximum limit, creating and appending a span element for each, styled with the contact's background color and displaying their initials.
 * 5. If the number of assigned contacts exceeds the maximum limit, calculates the excess count and displays this as an additional span element indicating the number of additional contacts not shown.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object with an `assign` property that is an array of assigned contact objects.
 * - Each contact object in the `assign` array is expected to have `initials` and `bgNameColor` properties.
 */
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
/**
 * Marks checkboxes as checked based on the current task's assigned contacts.
 * This function iterates over checkboxes within a specific element and checks them if their associated contact is assigned to the current task. The process involves:
 * 1. Attempting to retrieve the element with the ID 'editAssigned'. If not found, logs an error and exits the function.
 * 2. Selecting all input elements of type checkbox within the 'editAssigned' element.
 * 3. Creating an array of assigned contacts from the currentTask object, ensuring it's an array even if not initially set as one.
 * 4. Iterating over each checkbox, extracting the contact's name, initials, and background color from its value.
 * 5. Cleaning the extracted name and generating initials from it.
 * 6. Checking the checkbox if there's a match in the assignArray based on the cleaned name, generated initials, and background color.
 * 
 * @remarks
 * - Assumes the existence of `currentTask.assign`, an array of objects detailing assigned contacts.
 * - Relies on `cleanNameForInitials` and `filterFirstLetters` functions to process contact names.
 */
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
/**
 * Removes a specific substring "(YOU)" from a given name string.
 * This function is designed to clean up a name string by removing the substring " (YOU)" if present. This is typically used in contexts where a name might be annotated to indicate the current user, and such annotations need to be removed for display or processing purposes.
 * 
 * @param {string} name - The original name string that may contain the substring " (YOU)".
 * @returns {string} The cleaned name string with the " (YOU)" substring removed, if it was present.
 */
function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}
/**
 * Extracts and returns the first letters of each word in a given name, after cleaning.
 * This function is designed to process a name string and return a string of initials. It performs the following steps:
 * 1. Cleans the input name using the cleanNameForInitials function. This step is assumed to remove any unwanted characters or spaces, preparing the name for processing.
 * 2. Splits the cleaned name into an array of words based on spaces.
 * 3. Maps over each word, extracting the first character, converting it to uppercase, and then joins these characters together without any spaces.
 * 
 * @param {string} name - The original name string to be processed.
 * @returns {string} A string of uppercase initials representing the first letter of each word in the name.
 * 
 * Note: This function assumes the existence of a cleanNameForInitials function that is used to preprocess the name.
 */
function filterFirstLetters(name) {
    let cleanedName = cleanNameForInitials(name);
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}
/**
 * Sets focus to the subtask editing input and adjusts visibility of related UI elements.
 * This function is designed to prepare the UI for subtask editing by performing the following actions:
 * 1. Sets focus to the 'editSubtasks' input element, making it the active element for user input. This is useful for immediately allowing the user to start typing in the subtask they wish to edit.
 * 2. Makes the 'confirmAndDeleteEditBtnSubtask' element visible by setting its display style to 'flex'. This element likely contains buttons for confirming the edit or deleting the subtask, thus it's made visible when editing begins.
 * 3. Hides the 'placeholderEditImgSubtask' element by setting its display style to 'none'. This element might be a placeholder or an indicator shown when there are no subtasks being edited, and it's hidden during the editing process.
 * 
 * These actions together facilitate a focused and clear UI for editing subtasks.
 */
function editInputSetFocus() {
    document.getElementById('editSubtasks').focus();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderEditImgSubtask').style.display = 'none';
}
/**
 * Resets the focus and visibility of elements related to editing subtasks.
 * This function performs the following actions:
 * 1. Removes focus from the 'editSubtasks' input element by calling the blur() method on it. This is typically used to remove the keyboard focus from the specified element.
 * 2. Hides the 'confirmAndDeleteEditBtnSubtask' element by setting its display style to 'none'. This element likely contains buttons for confirming changes to a subtask or deleting it.
 * 3. Shows the 'placeholderEditImgSubtask' element by setting its display style to 'flex'. This element might be used to display a placeholder or default state when not actively editing a subtask.
 * 
 * These actions together reset the UI elements involved in editing subtasks to their default visibility and focus states.
 */
function resetEditSubtaskFocus() {
    document.getElementById('editSubtasks').blur();
    document.getElementById('confirmAndDeleteEditBtnSubtask').style.display = 'none';
    document.getElementById('placeholderEditImgSubtask').style.display = 'flex';
}
/**
 * Populates the subtask list in the task editing interface with current subtasks.
 * This function dynamically generates and displays subtask items for editing based on the currentTask's subtasks array. It performs the following steps:
 * 1. Retrieves the 'subtaskListEdit' element to use as the container for subtask items.
 * 2. Clears any existing content in the 'subtaskListEdit' element to prepare for the new list of subtasks.
 * 3. Checks if the currentTask.subtasks is an array to ensure there are subtasks to display.
 * 4. Iterates over each subtask in the currentTask.subtasks array, creating a new HTML structure for each subtask that includes:
 *    - A div element with a class 'editSub' and an id 'subtask' followed by the subtask index, serving as the container for the subtask item.
 *    - A list item (li) displaying the subtask's title.
 *    - A div containing two images, one for editing the subtask and another for deleting it, each with an onclick event handler calling either editSubtask or deleteEditSubtask function with the subtask index as an argument.
 * 5. Appends each newly created subtask item to the 'subtaskListEdit' element's innerHTML.
 * 
 * Note: This function assumes the existence of a global currentTask object with a subtasks array, and the editSubtask and deleteEditSubtask functions for editing and deleting subtasks.
 */
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

/**
 * Sets the current task's priority and updates the UI to reflect this priority.
 * This function performs several key actions to update both the task data and the user interface based on a given priority:
 * 1. Updates the `currentTask.priority` property to the specified priority.
 * 2. Iterates over all priority buttons, removing the 'selected' class from each and resetting their images to the original state.
 * 3. Based on the specified priority, finds the corresponding button (Urgent, Medium, Low) and marks it as selected by adding the 'selected' class and changing the button's image to indicate it's selected.
 * 4. Logs an error if the specified priority does not match any known priority levels.
 * 
 * @param {string} priority - The priority level to set for the current task. Expected values are 'Urgent', 'Medium', or 'Low'.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited.
 * - Also assumes a global variable `selectedPriority` is used to keep track of the currently selected priority.
 * - Relies on specific class names to identify the priority buttons in the UI and attributes to manage their images.
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
 * Adds a new subtask to the current task and updates the UI accordingly.
 * This function retrieves the subtask title from an input field, adds a new subtask to the `currentTask` object, and then updates the UI to reflect the addition. The steps are as follows:
 * 1. Retrieves the subtask title from the 'editSubtasks' input field.
 * 2. Checks if the `currentTask.subtasks` array exists, and initializes it if not.
 * 3. Adds the new subtask to the `currentTask.subtasks` array.
 * 4. Clears the 'editSubtasks' input field.
 * 5. Calls `resetEditSubtaskFocus` to manage focus within the UI (functionality assumed to reset focus for adding another subtask).
 * 6. Calls `showSubtasksEditTask` to update the subtasks display in the UI.
 * 7. Calls `scrollToBottom` to ensure the latest added subtask is visible in the UI (functionality assumed to scroll the view to the bottom of the subtasks list).
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited.
 * - Assumes `resetEditSubtaskFocus`, `showSubtasksEditTask`, and `scrollToBottom` are defined and handle their respective UI updates.
 */
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
/**
 * Scrolls the edit task container to its bottom.
 * This function finds the 'editTaskMainContainer' element and scrolls it to the bottom. This is particularly useful for ensuring that the latest content, such as a newly added subtask, is visible to the user.
 * 
 * @remarks
 * - Assumes the existence of an element with the ID 'editTaskMainContainer' in the DOM.
 * - This function is typically called after adding new content to the 'editTaskMainContainer' to ensure it is brought into view.
 */
function scrollToBottom() {
    const editTaskMainContainer = document.getElementById('editTaskMainContainer');
    if (editTaskMainContainer) {
        editTaskMainContainer.scrollTop = editTaskMainContainer.scrollHeight;
    }
}
/**
 * Deletes a subtask from the current task at a specified index and updates the UI.
 * This function removes a subtask from the `currentTask.subtasks` array based on the provided index and then updates the subtasks display in the UI.
 * 
 * @param {number} i - The index of the subtask to be deleted from the `currentTask.subtasks` array.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited.
 * - Assumes `currentTask.subtasks` is an array of subtask objects.
 * - Calls `showSubtasksEditTask` to refresh the subtasks display in the UI after deletion.
 */
function deleteEditSubtask(i) {
    currentTask.subtasks.splice(i, 1);
    showSubtasksEditTask()
}
/**
 * Edits a subtask in the UI, allowing the user to update its title.
 * This function dynamically generates HTML content to replace the display of a specified subtask with an input field pre-filled with the subtask's current title. It also provides 'delete' and 'confirm' buttons for user actions.
 * 
 * @param {number} i - The index of the subtask in the `currentTask.subtasks` array to be edited.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited.
 * - Assumes `currentTask.subtasks` is an array of subtask objects, each with a `title` property.
 * - The function dynamically updates the innerHTML of the subtask's container to include an input field for editing the title, and images/icons for 'delete' and 'confirm' actions.
 * - The 'delete' action is linked to a `clearEditSubtask` function, and the 'confirm' action is linked to a `confirmEditSubtask` function, both of which should be defined elsewhere.
 * - Assumes the existence of elements with IDs following the pattern `subtask${i}`, where `i` is the index of the subtask.
 */
function editSubtask(i) {
    let subtask = currentTask.subtasks[i];
    document.getElementById(`subtask${i}`).innerHTML = `<div class="editSub"><input type="text" class="editInputSub" id="edit-input${i}" value="${subtask.title}"> <div class="editSubImg "><div class="btn-hover"><img src="assets/img/delete.png" onclick="clearEditSubtask(${i})"></div> | <div class="btn-hover"><img height-btn" src="assets/img/hook.png" onclick="confirmEditSubtask(${i})"></div></div>`;
}
/**
 * Clears the input field for editing subtasks.
 * This function targets the input field used for adding or editing subtasks and sets its value to an empty string, effectively clearing any text the user has entered.
 * 
 * @remarks
 * - Assumes the existence of an input element with the ID 'editSubtasks' in the DOM.
 */
function clearEditSubtaskInput() {
    document.getElementById('editSubtasks').value = '';
}
/**
 * Resets the content of a subtask's edit area to an input field with action buttons.
 * This function targets a specific subtask's edit area by its index and replaces its content with an input field for editing the subtask's title. It also includes 'delete' and 'confirm' action buttons represented by images.
 * 
 * @param {number} i - The index of the subtask in the `currentTask.subtasks` array, used to identify the specific subtask's edit area in the UI.
 * 
 * @remarks
 * - Assumes the existence of elements with IDs following the pattern `subtask${i}`, where `i` is the index of the subtask.
 * - The 'delete' action is linked to this `clearEditSubtask` function itself, allowing for repeated clearing of the input.
 * - The 'confirm' action is linked to a `confirmEditSubtask` function, which should be defined elsewhere to handle the confirmation of the subtask edit.
 */
function clearEditSubtask(i) {
    document.getElementById(`subtask${i}`).innerHTML = `<input type="text" id="edit-input${i}"><div><img src="assets/img/delete.png" onclick="clearEditSubtask(${i})"> | <img src="assets/img/hook.png" onclick="confirmEditSubtask(${i})"></div>`;
}
/**
 * Confirms the edit of a subtask's title and updates the task.
 * This function retrieves the edited title from the input field associated with a specific subtask, updates the subtask's title in the `currentTask` object, and then refreshes the task editing UI.
 * 
 * @param {number} i - The index of the subtask in the `currentTask.subtasks` array that is being edited.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited, including a `firebaseId` property for identification.
 * - Assumes `currentTask.subtasks` is an array of subtask objects, each with a `title` property.
 * - The function checks for the presence of the input element to avoid errors if the element does not exist.
 * - After updating the subtask's title, it calls `openEditTask` with the `currentTask.firebaseId` to refresh the task editing UI, presumably to reflect the updated subtasks.
 * - Calls `scrollToBottom` to ensure the latest changes are visible to the user, especially useful if the task editing UI contains a scrollable area.
 */
function confirmEditSubtask(i) {
    let inputElement = document.getElementById(`edit-input${i}`);

    if (inputElement) {
        let inputValue = inputElement.value;
        currentTask.subtasks[i].title = inputValue;
    }
    openEditTask(currentTask.firebaseId);
    scrollToBottom();
}
/**
 * Opens the task editing interface for a specific task identified by its Firebase ID.
 * This function is responsible for setting up the task editing UI. It performs several key actions to ensure the UI is correctly populated and interactive:
 * 1. Loads the task data for editing based on the provided Firebase ID.
 * 2. Hides the modal task card, if it's currently displayed, to make room for the task editing interface.
 * 3. Shows the task editing card by removing the class that hides it.
 * 4. Calls `generateEditAssign` to populate or refresh the assignment-related UI elements.
 * 5. Calls `showTaskDetails` to display the details of the task being edited.
 * 6. Adds an event listener to the 'Post Edit' button, which triggers the `updateCurrentTask` function when clicked.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to be edited.
 * 
 * @remarks
 * - Assumes the existence of `loadTaskForEdit`, `generateEditAssign`, `showTaskDetails`, and `updateCurrentTask` functions, which are called to handle specific parts of the task editing process.
 * - Assumes the presence of HTML elements with IDs 'modalTaskcard', 'editTaskcard', and 'postEditBtn' in the DOM.
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
 * Closes the task editing popup and reveals the modal task card.
 * This function toggles the visibility of the task editing interface and the modal task card by adding or removing CSS classes that control their display. Specifically, it:
 * - Adds a class to hide the task editing card (`editTaskcard`).
 * - Removes a class from the modal task card (`modalTaskcard`) to make it visible.
 * 
 * @remarks
 * - Assumes the presence of HTML elements with IDs 'editTaskcard' and 'modalTaskcard' in the DOM.
 * - The CSS classes 'edit-task-display-none' and 'modal-task-popup-display-none' are used to control the visibility of these elements.
 */
function closeEditTaskPopup() {
    document.getElementById('editTaskcard').classList.add('edit-task-display-none');
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
}
/**
 * Updates the current task with new values from the task editing form and saves the changes.
 * This function collects updated task information from various input fields and checkboxes in the task editing form, updates the `currentTask` object with these new values, and then calls `updateTask` to save the changes.
 * 
 * @remarks
 * - Assumes the existence of a global `currentTask` object that represents the task currently being edited.
 * - The task's title, description, date, and user category are updated based on the values from their respective input fields.
 * - The task's assigned contacts are updated based on the checked state of checkboxes within the 'editAssigned' element. Each contact is expected to have a value formatted as 'name|initials|bgColor'.
 * - Calls `updateTask` with the `currentTask.firebaseId` and the updated `currentTask` object to save the changes.
 * - Assumes the presence of `updateTask` function, which handles the persistence of the updated task data.
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
/**
 * Dynamically generates and populates the assignment section in the task editing form with contacts.
 * This function creates a list of contacts, each represented by a checkbox, allowing the user to assign contacts to a task. Each contact's information includes their name, initials, and a background color for the initials.
 * 
 * @remarks
 * - Assumes the existence of a global `assign` array containing the contacts to be listed, with each contact having `name` and `bgNameColor` properties.
 * - Utilizes a `filterFirstLetters` function to extract initials from the contact's name, which should be defined elsewhere.
 * - Clears the content of the 'editAssigned' element before populating it to ensure it's updated with the latest contacts information.
 * - For each contact in the `assign` array, it creates a checkbox input and two spans for displaying the initials and name, styling the initials span with the contact's background color.
 * - After populating the contacts, it calls `markCheckedCheckboxes` to ensure previously selected contacts are marked as checked, assuming this function is defined elsewhere and handles the logic for checking the appropriate checkboxes based on some criteria.
 */
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
/**
 * Toggles the visibility of the assignment dropdown and the rotation of the dropdown arrow in the task editing form.
 * This function selects the assignment dropdown and the dropdown arrow elements from the DOM. It then toggles a 'show' class on the dropdown to control its visibility and a 'rotate' class on the arrow to indicate whether the dropdown is open or closed.
 * 
 * @remarks
 * - Assumes the presence of an element with the class 'dropdown-edit-content' in the DOM, representing the assignment dropdown.
 * - Assumes the presence of an element with the ID 'dropdownArrow' in the DOM, representing the arrow icon of the dropdown.
 * - The 'show' class is used to control the visibility of the dropdown, and the 'rotate' class is used to control the rotation state of the arrow icon.
 */
function openDropdownEditAssign() {
    let dropdown = document.querySelector('.dropdown-edit-content');
    document.getElementById('dropdownArrow').classList.toggle('rotate');
    dropdown.classList.toggle('show');
}
/**
 * Asynchronously updates a user task in the database using its Firebase ID and redirects to the board page upon success.
 * This function sends an HTTP PUT request to update a specific task identified by its Firebase ID with new data provided in `updatedUserTask`. Upon successful update, it redirects the user to the board page. If the update fails, it logs the error and displays an alert with the error message.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to be updated.
 * @param {Object} updatedUserTask - An object containing the updated properties of the task.
 * 
 * @remarks
 * - Assumes the existence of a global `BASE_URL` variable that holds the base URL of the Firebase database.
 * - The `Content-Type` header in the request is set to 'application/json' to indicate that the request body format is JSON.
 * - Uses a `try...catch` block to handle any errors that occur during the fetch operation.
 * - Redirects to "board.html" using `window.location.href` upon successful update.
 * - Logs the error to the console and displays an alert if the update operation fails.
 */
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
}
/**
 * Toggles the visibility of the category dropdown content and its arrow rotation in the task editing form, and handles selection and outside clicks.
 * This function is responsible for controlling the category dropdown's visibility in the task editing form. It toggles the dropdown and the rotation of its arrow icon. Additionally, it sets up event listeners to handle selection of a category and to close the dropdown when clicking outside of it.
 * 
 * @remarks
 * - Assumes the presence of elements with IDs 'categoryContentEdit' and 'dropdownArrowCategoryEdit' in the DOM for the category dropdown content and its arrow icon, respectively.
 * - The 'show' class controls the visibility of the dropdown, and the 'rotate' class controls the rotation of the arrow icon.
 * - Defines a `handleClickOutside` function to close the dropdown if a click occurs outside of it. This function is added as an event listener when the dropdown is shown and removed after it's hidden or an option is selected.
 * - Iterates over all radio inputs within elements with the class 'dropdown-option', setting up an event listener for the 'change' event to update the selected category text and close the dropdown.
 * - Uses `setTimeout` to defer the addition of the `click` event listener to ensure it does not immediately trigger after opening the dropdown.
 */
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
