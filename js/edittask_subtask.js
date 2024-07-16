/**
 * Generates HTML for a subtask.
 * @param {Object} subtask - The subtask object.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function createSubtaskHTML(subtask, index) {
    return `
        <div class="editSub" id="subtask${index}">
            <li class="edit-list-row">${subtask.title}</li>
            <div class="edit-delete-img-edit-task">
                <div class="btn-hover">
                    <img src="assets/img/edit.png" onclick="editSubtask(${index})">
                </div>
                |
                <div class="btn-hover">
                    <img src="assets/img/delete.png" onclick="deleteEditSubtask(${index})">
                </div>
            </div>
        </div>`;
}

/**
 * Adds a new subtask to the current task.
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
 * Scrolls the edit task container to the bottom.
 */
function scrollToBottom() {
    const editTaskMainContainer = document.getElementById('editTaskMainContainer');
    if (editTaskMainContainer) {
        editTaskMainContainer.scrollTop = editTaskMainContainer.scrollHeight;
    }
}

/**
 * Deletes a subtask by its index.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteEditSubtask(index) {
    currentTask.subtasks.splice(index, 1);
    showSubtasksEditTask();
}

/**
 * Enables editing of a subtask by its index.
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    let subtask = currentTask.subtasks[index];
    document.getElementById(`subtask${index}`).innerHTML = `
        <div class="editSub">
            <input type="text" class="editInputSub" id="edit-input${index}" value="${subtask.title}">
            <div class="editSubImg">
                <div class="btn-hover">
                    <img src="assets/img/delete.png" onclick="clearEditSubtask(${index})">
                </div>
                |
                <div class="btn-hover">
                    <img src="assets/img/hook.png" onclick="confirmEditSubtask(${index})">
                </div>
            </div>
        </div>`;
}

/**
 * Clears the subtask input field.
 */
function clearEditSubtaskInput() {
    document.getElementById('editSubtasks').value = '';
}

/**
 * Clears the subtask input field for a specific subtask.
 * @param {number} index - The index of the subtask to clear.
 */
function clearEditSubtask(index) {
    document.getElementById(`subtask${index}`).innerHTML = `
        <input type="text" id="edit-input${index}">
        <div>
            <img src="assets/img/delete.png" onclick="clearEditSubtask(${index})">
            |
            <img src="assets/img/hook.png" onclick="confirmEditSubtask(${index})">
        </div>`;
}

/**
 * Confirms the edited subtask title.
 * @param {number} index - The index of the subtask to confirm.
 */
function confirmEditSubtask(index) {
    let inputElement = document.getElementById(`edit-input${index}`);
    if (inputElement) {
        let inputValue = inputElement.value;
        currentTask.subtasks[index].title = inputValue;
    }
    openEditTask(currentTask.firebaseId);
    scrollToBottom();
}

/**
 * Adds an event listener for the Enter key to add a subtask.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editSubtasks').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtask();
        }
    });
});