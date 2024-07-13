function buildSubtasksHTML(firebaseId, subtasks) {
    return '<ul class="popup-subtask-ul">' + subtasks.map((subtask, index) => `
        <li class="popup-subtask-list">
            <input type="checkbox" id="subtask-${firebaseId}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtask('${firebaseId}', ${index})">
            <label class="break" for="subtask-${firebaseId}-${index}">${subtask.title}</label>
        </li>`
    ).join('') + '</ul>';
}


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


function generateInitialsHtml(visibleInitials) {
    return visibleInitials.map(assignData => 
        `<span class="show-initials" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`
    ).join('');
}


function buildTaskHTML(taskItem, initialsHtml, priorityIcon, subtasksHtml) {
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

function generatePlaceholderHTML(category) {
    return `<div class="placeholder"><span>No tasks ${category}</span></div>`;
}