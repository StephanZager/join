/**
 * Generates HTML for a subtask item.
 * @param {Object} subtaskToEdit - The subtask to edit.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The HTML string for the subtask item.
 */
function createSubtaskItemHTML(subtaskToEdit, index) {
    return `
        <div id="subtaskToEdit${index}" class="subtask-item">
            <li class="addtask-subtask-li">${subtaskToEdit.title}</li>
            <div class="edit-delete-img">
                <div class="btn-hover-task"><img src="assets/img/edit.png" alt="Edit" onclick="editSubtaskAddtask(${index})"></div>
                <div style="display: flex; align-items: center;">|</div>
                <div class="btn-hover-task"><img src="assets/img/delete.png" alt="Delete" onclick="deleteSubtask(${index})"></div>
            </div>
        </div>`;
}