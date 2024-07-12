let currentCategory = '';
let task = [];
/**
 * Asynchronously loads tasks from a specified path in the Firebase database.
 * It fetches the tasks, converts the response to JSON, and then maps the tasks to an array with their Firebase ID and data.
 * After loading the tasks, it calls `generateTask` to update the UI with the loaded tasks.
 * If an error occurs during the fetch operation, it logs the error.
 * 
 * @param {string} [path="/userTask"] - The path in the Firebase database from where to load the tasks. Defaults to "/userTask".
 */
async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            task = Object.entries(responseToJson).map(([firebaseId, taskData]) => ({ firebaseId, ...taskData }));
        }

        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}
/**
 * Populates each task category column with task cards or a placeholder if no tasks are present.
 * It iterates through predefined categories, filters tasks by category, and generates HTML for each task.
 * If a category has no tasks, a placeholder is displayed. For tasks with subtasks, it updates the progress bar.
 */
function generateTask() {
    const categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    
    categories.forEach(category => {
        let tasksInCategory = task.filter(t => t.category === category);
        let categoryElement = document.getElementById(category);
        categoryElement.innerHTML = '';

        if (tasksInCategory.length === 0) {
            categoryElement.innerHTML = generatePlaceholderHTML(category);
        } else {
            tasksInCategory.forEach(taskItem => {
                categoryElement.innerHTML += generateTaskHTML(taskItem);
                if ((taskItem.subtasks || []).length > 0) {
                    updateProgressBar(taskItem);
                }
            });
        }
    });
}
/**
 * Generates HTML markup for a placeholder to be displayed in a task category column when no tasks are present.
 * The placeholder indicates that there are no tasks in the specified category.
 * 
 * @param {string} category - The name of the category for which the placeholder is generated.
 * @returns {string} HTML string representing the placeholder.
 */
function generatePlaceholderHTML(category) {
    return `<div class="placeholder"><span>No tasks ${category}</span></div>`;
}
/**
 * Generates HTML markup for a task card.
 * The task card includes the task's category, title, description, subtasks progress, assigned initials (up to 4 visible),
 * and an icon indicating the task's priority. Additional assigned initials beyond 4 are indicated by a "+N" notation.
 * The task card is draggable, with event handlers for drag start and drag end to facilitate task moving.
 * 
 * @param {Object} taskItem - The task item object containing details to be displayed on the task card.
 * @returns {string} HTML string representing the task card.
 */
function generateTaskHTML(taskItem) {
    let assignArray = taskItem.assign || [];
    let initialCount = assignArray.length;
    let visibleInitials = assignArray.slice(0, 4);
    let hiddenInitialsCount = initialCount > 4 ? initialCount - 4 : 0;

    let initialsHtml = visibleInitials.map(assignData => 
        `<span class="show-initials" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`
    ).join('');

    if (hiddenInitialsCount > 0) {
        initialsHtml += `<span class="show-initials">+${hiddenInitialsCount}</span>`;
    }

    let priorityIcon = getPriorityIcon(taskItem.priority);
    let subtasksHtml = generateSubtasksProgressHTML(taskItem);

    return `
        <div draggable="true" ondragstart="startDragging(event, '${taskItem.firebaseId}')" ondragend="stopDragging(event)" class="taskCard" data-firebase-id="${taskItem.firebaseId}">
        <div class="taskCard-headline-board-overview">    
            <h4 class="task-category-${taskItem.userCategory}">${taskItem.userCategory}</h4>
            <img class="task-popup-arrow" src="assets/img/arrow-down-grey.png" onclick="openMoveMobileMenu('${taskItem.firebaseId}')">
        </div>    
            <p class="task-title">${taskItem.title}</p>
            <p class="task-description">${taskItem.description}</p>
            ${subtasksHtml}
            <div class="show-initials-taskcard">
                <div class="initials-container">${initialsHtml}</div>
                <img src="${priorityIcon}" alt="Image" class="taskcard-img">
            </div>
        </div>`;
}
/**
 * Removes the " (YOU)" suffix from a given name string.
 * This function is typically used to clean user display names that are marked to indicate the current user.
 * 
 * @param {string} name - The name string to be cleaned.
 * @returns {string} The cleaned name without the " (YOU)" suffix.
 */
function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}
/**
 * Retrieves the file path for the priority icon based on the given priority level.
 * If the specified priority does not match any predefined levels, it defaults to the 'Low' priority icon.
 * 
 * @param {string} priority - The priority level of the task ('Urgent', 'Medium', 'Low').
 * @returns {string} The file path of the corresponding priority icon.
 */
function getPriorityIcon(priority) {
    const icons = {
        Urgent: './assets/img/prio-urgent-icon-unclicked.png',
        Medium: './assets/img/prio-medium-icon-unclicked.png',
        Low: './assets/img/prio-low-icon-unclicked.png'
    };
    return icons[priority] || icons['Low'];
}
/**
 * Generates HTML markup for a task's subtasks progress bar.
 * The progress bar visually represents the completion status of the task's subtasks.
 * It includes a container for the progress bar itself and a text indicator showing the number of completed subtasks out of the total.
 * 
 * @param {Object} taskItem - The task item object containing subtasks to generate progress for.
 * @returns {string} HTML string representing the subtasks progress bar. If the task has no subtasks, returns an empty string.
 */
function generateSubtasksProgressHTML(taskItem) {
    if (!taskItem.subtasks || taskItem.subtasks.length === 0) return '';

    let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    return `
        <div class="progress-bar-subtask">
            <div class="progress-container">
                <div class="progress-background"></div>
                <div id="progressBar_${taskItem.firebaseId}" class="progress-bar"></div>
            </div>
            <div class="subtask-container">
                <p class="subtask-progress" id="subtaskProgress_${taskItem.firebaseId}">${completedSubtasks}/${taskItem.subtasks.length} Subtasks</p>
            </div>
        </div>`;
}
/**
 * Asynchronously updates a task in Firebase with new data for a given task ID.
 * It sends a PATCH request to the Firebase database to update the task with the specified ID.
 * If an error occurs during the fetch operation, it logs the error and rethrows it.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to be updated.
 * @param {Object} newData - The new data to update the task with.
 * @throws {Error} If an error occurs during the fetch operation.
 */
async function updateTaskInFirebase(firebaseId, newData) {
    try {
        await fetch(`${BASE_URL}/userTask/${firebaseId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        });
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aufgabe in Firebase:", error);
        throw error;
    }
}
/**
 * Sets the title of the modal based on the user's category of the task item.
 * It also dynamically assigns a class to the modal title for styling purposes,
 * based on the task's user category, with spaces replaced by hyphens.
 * 
 * @param {Object} taskItem - The task item object containing the user category to set as the modal title.
 */
function setModalTitle(taskItem) {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.innerText = taskItem.userCategory;
    modalTitle.className = `task-category-${taskItem.userCategory.replace(/\s+/g, '-')}`;
}
/**
 * Sets the content of the modal based on the provided task item.
 * This includes setting the task's title, description, due date, subtasks, assigned initials,
 * priority icon and text, and configuring the delete and edit task buttons with appropriate actions.
 * 
 * @param {Object} taskItem - The task item object containing the information to display in the modal.
 */
function setModalContent(taskItem) {
    document.getElementById("modalUserTitle").innerText = taskItem.title;
    document.getElementById("modalDescription").innerText = taskItem.description;
    document.getElementById("modalDate").innerText = taskItem.date;
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
    document.getElementById("modalInitials").innerHTML = generateInitialsHTML(taskItem.assign || []);
    document.getElementById("modalPriorityIcon").src = getPriorityIcon(taskItem.priority);
    document.getElementById("modalPriorityText").innerText = taskItem.priority;
    document.getElementById("deleteTaskBtn").innerHTML = `<button onclick="deleteTask('${taskItem.firebaseId}')"><img src="assets/img/delete.png" alt="delete task">Delete</button>`;
    document.getElementById("editTaskBtn").innerHTML = `<button onclick="openEditTask('${taskItem.firebaseId}')"><img src="assets/img/edit.png" alt="edit task">Edit Task</button>`;
}
/**
 * Displays a modal for a task item by setting its title and content, then making the modal visible.
 * 
 * @param {Object} taskItem - The task item object containing the information to be displayed in the modal.
 */
function showModal(taskItem) {
    setModalTitle(taskItem);
    setModalContent(taskItem);
    displayModal();
}
/**
 * Generates HTML markup for displaying assigned initials within a sorted list.
 * The list is sorted alphabetically by the cleaned and uppercased names associated with the initials.
 * Each set of initials is displayed with a background color and is accompanied by the cleaned name.
 * 
 * @param {Array} assignedInitialsArray - An array of objects containing the initials, name, and background color for each assignment.
 * @returns {string} HTML string representing the sorted list of assigned initials and names.
 */
function generateInitialsHTML(assignedInitialsArray) {
    const sortedArray = assignedInitialsArray.sort((a, b) => {
        const nameA = cleanNameForInitials(a.name).toUpperCase();
        const nameB = cleanNameForInitials(b.name).toUpperCase(); 
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return sortedArray.map(assignData => `
        <div class="assign-details">
            <span class="show-initials" style="background-color: ${assignData.bgNameColor}">
                ${assignData.initials}
            </span>
            <span class="assign-name">${cleanNameForInitials(assignData.name)}</span>
        </div>`
    ).join('');
}
/**
 * Generates HTML markup for displaying subtasks as a list with checkboxes.
 * Each subtask is represented by a list item containing a checkbox and a label.
 * The checkbox's checked state reflects the subtask's completion status.
 * Clicking the checkbox triggers the `toggleSubtask` function to toggle the subtask's completion status.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to which the subtasks belong.
 * @param {Array} subtasks - An array of subtask objects.
 * @returns {string} HTML string representing the list of subtasks.
 */
function generateSubtasksHTML(firebaseId, subtasks) {
    if (!subtasks || subtasks.length === 0) return '';

    return '<ul class="popup-subtask-ul">' + subtasks.map((subtask, index) => `
        <li class="popup-subtask-list">
            <input type="checkbox" id="subtask-${firebaseId}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtask('${firebaseId}', ${index})">
            <label class="break" for="subtask-${firebaseId}-${index}">${subtask.title}</label>
        </li>`
    ).join('') + '</ul>';
}
/**
 * Toggles the completion status of a specified subtask for a task identified by its Firebase ID.
 * It updates the task's subtask completion status both locally and in Firebase.
 * After updating, it refreshes the task's progress bar, task card subtasks, and popup subtasks to reflect the changes.
 * 
 * @param {string} firebaseId - The Firebase ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task's subtasks array.
 */
async function toggleSubtask(firebaseId, subtaskIndex) {
    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
        return;
    }

    task[taskIndex].subtasks[subtaskIndex].done = !task[taskIndex].subtasks[subtaskIndex].done;

    try {
        await updateTaskInFirebase(firebaseId, { subtasks: task[taskIndex].subtasks });
        updateProgressBar(task[taskIndex]);
        updateTaskCardSubtasks(task[taskIndex]);
        updatePopupSubtasks(task[taskIndex]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
    }
}
/**
 * Updates the progress bar and subtask count for a given task item.
 * The progress bar's width is set to the percentage of completed subtasks.
 * The subtask count is updated with the format 'completed/total Subtasks'.
 * If the task item has no subtasks or the progress bar is not found, the function returns early.
 * @param {Object} taskItem - The task item to update the progress bar for. Must have a `firebaseId` and `subtasks` property.
 */
function updateProgressBar(taskItem) {
    const totalSubtasks = (taskItem.subtasks || []).length;
    if (totalSubtasks === 0) return;

    const completedSubtasks = (taskItem.subtasks || []).filter(subtask => subtask.done).length;
    const progressBar = document.getElementById(`progressBar_${taskItem.firebaseId}`);

    if (!progressBar) {
        console.error(`Fortschrittsbalken für taskItem mit ID ${taskItem.firebaseId} nicht gefunden.`);
        return;
    }

    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const subtaskProgress = document.getElementById(`subtaskProgress_${taskItem.firebaseId}`);
    if (subtaskProgress) {
        subtaskProgress.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}
/**
 * Updates the subtasks in the popup for a given task item.
 * The 'modalSubtasks' element's innerHTML is set to the result of the `generateSubtasksHTML` function.
 * Assumes that a function named `generateSubtasksHTML` is defined elsewhere.
 * @param {Object} taskItem - The task item to update the popup subtasks for. Must have a `firebaseId` and `subtasks` property.
 */
function updatePopupSubtasks(taskItem) {
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
}
/**
 * Updates the subtask count on the task card for a given task item.
 * The subtask count is updated with the format 'completed/total Subtasks'.
 * If the task card's subtask element is not found, the function returns early.
 * @param {Object} taskItem - The task item to update the task card subtasks for. Must have a `firebaseId` and `subtasks` property.
 */
function updateTaskCardSubtasks(taskItem) {
    const taskCardSubtasks = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"] .subtask-progress`);
    if (taskCardSubtasks) {
        const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
        taskCardSubtasks.textContent = `${completedSubtasks}/${taskItem.subtasks.length} Subtasks`;
    }
}

/**
 * Validates if all required fields have been filled out by calling the `requiredFields` function.
 * It returns `true` if all required fields are valid, otherwise `false`.
 * 
 * @returns {boolean} True if all required fields are valid, otherwise false.
 */
function validateRequiredFields() {
    if (!requiredFields()) {
        return false;
    }
    return true;
}
/**
 * Creates and returns a task object based on the input values from the task creation form.
 * It gathers information such as the task title, description, due date, user-selected category,
 * assignment details, subtasks, and priority.
 * 
 * @returns {Object} A task object containing the gathered information from the form.
 */
function createTaskObject() {
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.querySelector('input[name="category"]:checked')?.value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();

    return {
        title: taskTitle,
        description: taskDescription,
        date: date,
        category: currentCategory,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        priority: selectedPriority
    };
}
/**
 * Sends a new task to the server via a POST request and returns the response data.
 * If the request is not successful, it throws an error with the HTTP status.
 * 
 * @param {Object} newTask - The new task object to be sent to the server.
 * @returns {Promise<Object>} The response data from the server as a promise.
 * @throws {Error} When the HTTP request is not successful.
 */
async function postNewTask(newTask) {
    const response = await fetch(`${BASE_URL}/userTask.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
/**
 * Finalizes the task creation process by adding the new task to the local task list,
 * refreshing the display, closing the task creation popup, and clearing the task form.
 * 
 * @param {Object} newTask - The new task object to be added to the task list.
 */
function finalizeTaskCreation(newTask) {
    task.push(newTask); 
    generateTask(); 
    closeTaskPopup(); 
    clearTaskForm(); 
}
/**
 * Handles the task creation process by validating required fields, creating a new task object,
 * sending it to the server, and finalizing the task creation process.
 * 
 * @param {Event} event - The event object from the form submission.
 */
async function createTask(event) {
    event.preventDefault();
    if (!validateRequiredFields()) return;

    const newTask = createTaskObject();

    try {
        const responseData = await postNewTask(newTask);
        newTask.firebaseId = responseData.name; 
        finalizeTaskCreation(newTask);
    } catch (error) {
        alert(`Fehler beim Erstellen der Aufgabe: ${error.message}`);
    }
}
/**
 * Clears the selection of category radio buttons and resets the category display text.
 * This function performs two main actions:
 * 1. It selects all radio input elements within elements with the class 'dropdown-content-category'
 *    and sets their 'checked' property to false, effectively unselecting them.
 * 2. It then finds the element with the ID 'categoryText' and sets its text content to 'Category',
 *    which is presumably the default or placeholder text.
 */
function clearCategorySelection() {
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    document.getElementById('categoryText').textContent = 'Category';
}
/**
 * Resets the visual priority state of buttons within elements with the class 'prio-buttons'.
 * This function performs the following actions for each button:
 * 1. Removes the 'selected' class, visually indicating the button is not selected.
 * 2. Finds the child <img> element of the button and sets its 'src' attribute to the value
 *    of the button's 'data-original-image' attribute. This typically changes the image
 *    displayed on the button back to its original state.
 */
function resetPriority() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); 
    });
}
/**
 * Clears all checked states of checkboxes within the element with the ID 'assigned'.
 * This function selects all input elements of type checkbox under the specified ID
 * and sets their 'checked' property to false, effectively unchecking them.
 */
function clearAssignedCheckboxes() {
    const assignedCheckboxes = document.querySelectorAll('#assigned input[type="checkbox"]');
    assignedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Deletes a task with the given Firebase ID by sending a DELETE request to the server.
 * If the request is successful, the task is also removed from the `task` array and the tasks are regenerated.
 * If the 'taskModal' element exists, its display style is set to 'none'.
 * If an error occurs during the request, it is logged to the console and an alert is shown with the error message.
 * @param {string} firebaseId - The Firebase ID of the task to delete.
 */
async function deleteTask(firebaseId) {
    try {
        let response = await fetch(BASE_URL + `/userTask/${firebaseId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        task = task.filter(t => t.firebaseId !== firebaseId);
        generateTask();

        const modal = document.getElementById("taskModal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (error) {
        console.error('Fehler beim Löschen der Aufgabe:', error);
        alert(`Fehler beim Löschen der Aufgabe: ${error.message}`);
    }
}
/**
 * Searches tasks based on the input from the 'searchBarInput' element.
 * If the search term is found in the title or description of a task, the task card's background color is set to yellow.
 * If the search term is not found, the task card's background color is reset.
 * If the search term is empty, all task card colors are reset.
 * Assumes that `task` is an array of objects, each with a `title`, `description`, and `firebaseId` property.
 * Also assumes that a function named `resetTaskCardColors` is defined elsewhere.
 */
function searchTasks() {
    const searchTerm = document.getElementById('searchBarInput').value.toLowerCase();

    if (searchTerm.trim() !== '') {
        task.forEach(taskItem => {
            const title = taskItem.title.toLowerCase();
            const description = taskItem.description.toLowerCase();
            const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                taskCard.style.display = ''; // Stellt sicher, dass die Karte angezeigt wird
            } else {
                taskCard.style.display = 'none'; // Blendet die Karte aus, wenn sie den Suchbegriff nicht enthält
            }
        });
    } else {
        resetTaskCardVisibility(); // Stellt die ursprüngliche Sichtbarkeit aller Task-Karten wieder her
    }
}

function resetTaskCardVisibility() {
    task.forEach(taskItem => {
        const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
        taskCard.style.display = ''; // Stellt die Sichtbarkeit jeder Karte wieder her
    });
}
/**
 * Resets the background color of all task cards.
 * Assumes that `task` is an array of objects, each with a `firebaseId` property.
 */
function resetTaskCardColors() {
    task.forEach(taskItem => {
        const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
        taskCard.style.backgroundColor = ''; 
    });
}

/**
 * Closes the task card modal by setting its display style to 'none'.
 */
function closeTaskCard() {
    document.getElementById('taskModal').style.display = 'none';
}

/**
 * Closes the add task popup modal by setting its display style to 'none'.
 */
function closeAddTaskPopup() {
    document.getElementById('addTaskModel').style.display = 'none';
}

/**
 * Slides in a popup with the given ID.
 * @param {string} popupId - The ID of the popup to slide in.
 */
function slideInPopupTask(popupId) {
    let popup = document.getElementById(popupId);    
    popup.classList.add('slide-in'); 
}

/**
 * Ends the slide-in animation for a popup with the given ID.
 * @param {string} popupId - The ID of the popup to end the slide-in animation for.
 */
function endSlideInPopupTask(popupId) {
    let popup = document.getElementById(popupId);    
    popup.classList.remove('slide-in'); 
}

