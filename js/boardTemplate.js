/**
 * Generates HTML for a list of subtasks with checkboxes.
 * @param {string} firebaseId - Unique ID for the task from Firebase.
 * @param {Array} subtasks - Array of subtask objects.
 * @returns {string} - HTML string for the subtasks.
 */
function buildSubtasksHTML(firebaseId, subtasks) {
    return '<ul class="popup-subtask-ul">' + subtasks.map((subtask, index) => `
        <li class="popup-subtask-list">
            <input type="checkbox" id="subtask-${firebaseId}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtask('${firebaseId}', ${index})">
            <label class="break" for="subtask-${firebaseId}-${index}">${subtask.title}</label>
        </li>`
    ).join('') + '</ul>';
}

/**
 * Generates HTML for a list of assignees with initials.
 * @param {Array} sortedArray - Array of assignee data objects.
 * @returns {string} - HTML string for the assignees.
 */
function buildInitialsHTML(sortedArray) {
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
 * Generates HTML for subtask progress bar.
 * @param {Object} taskItem - Task object.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @returns {string} - HTML string for the subtask progress.
 */
function buildSubtasksProgressHTML(taskItem, completedSubtasks) {
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
 * Generates HTML for a list of visible assignees' initials.
 * @param {Array} visibleInitials - Array of assignee data objects.
 * @returns {string} - HTML string for the initials.
 */
function generateInitialsHtml(visibleInitials) {
    return visibleInitials.map(assignData => 
        `<span class="show-initials" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`
    ).join('');
}

/**
 * Generates HTML for a task card.
 * @param {Object} taskItem - Task object.
 * @param {string} initialsHtml - HTML string for the assignees' initials.
 * @param {string} priorityIcon - URL for the priority icon image.
 * @param {string} subtasksHtml - HTML string for the subtasks.
 * @returns {string} - HTML string for the task card.
 */
function buildTaskHTML(taskItem, initialsHtml, priorityIcon, subtasksHtml) {
    return `
        <div draggable="true" ondragstart="startDragging(event, '${taskItem.firebaseId}')" ondragend="stopDragging(event)" class="taskCard" data-firebase-id="${taskItem.firebaseId}">
        <div class="taskCard-headline-board-overview">    
            <h4 class="task-category-${taskItem.userCategory}">${taskItem.userCategory}</h4>
            <img class="task-popup-arrow" src="assets/img/arrow-up-down.png" onclick="openMoveMobileMenu('${taskItem.firebaseId}')">
        </div>    
            <p class="task-title">${taskItem.title}</p>
            <p id="taskDesctription" class="task-description">${taskItem.description}</p>
            ${subtasksHtml}
            <div class="show-initials-taskcard">
                <div class="initials-container">${initialsHtml}</div>
                <img src="${priorityIcon}" alt="Image" class="taskcard-img">
            </div>
        </div>`;
}

/**
 * Generates HTML for a placeholder when there are no tasks in a category.
 * @param {string} category - The category name.
 * @returns {string} - HTML string for the placeholder.
 */
function generatePlaceholderHTML(category) {
    return `<div class="placeholder"><span>No tasks ${category}</span></div>`;
}