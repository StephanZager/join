/**
 * Clears all subtasks, resets priority buttons, assigned details, and category selections.
 * This function performs the following actions:
 * 1. Finds all elements with the class '.prio-buttons' and iterates over them to remove the 'selected' class and reset their image to the original one specified in the 'data-original-image' attribute.
 * 2. Resets the subtaskList array to an empty array, indicating that all subtasks have been cleared.
 * 3. Clears the innerHTML of the element with the ID 'subtaskList', removing all visual representations of subtasks from the UI.
 * 4. Resets the assignDetails array to an empty array, clearing any stored details about task assignments.
 * 5. Clears the innerHTML of the element with the ID 'assignedInitial', removing any visual representation of assigned initials.
 * 6. Calls the clearCategorySelection function to reset any category selections made.
 * 
 * Note: This function assumes the existence of a global subtaskList array, a global assignDetails array, and a clearCategorySelection function.
 */
function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); 
    });
    subtaskList = [];
    document.getElementById('subtaskList').innerHTML = '';
    assignDetails = [];
    document.getElementById('assignedInitial').innerHTML = '';
    clearCategorySelection();
}
/**
 * Clears all inputs and selections within the task form and resets global subtasks.
 * This function performs a series of actions to reset the task creation or editing form to its default state:
 * 1. Calls clearAssignedCheckboxes to uncheck all checkboxes related to task assignment.
 * 2. Calls resetPriority to reset any selected priority level for the task.
 * 3. Calls clearCategorySelection to clear any selected categories.
 * 4. Sets the value of the 'title' input field to an empty string, effectively clearing it.
 * 5. Sets the value of the 'taskDescription' textarea to an empty string.
 * 6. Clears the innerHTML of the 'assignedInitial' element, which may display initials of assigned persons.
 * 7. Sets the value of the 'dueDate' input field to an empty string, clearing any selected date.
 * 8. Clears the innerHTML of the 'subtaskList' element, which may contain a list of subtasks.
 * 9. Resets the globalSubtasks array to an empty array, clearing any stored subtask data.
 * 
 * Note: This function assumes the existence of the clearAssignedCheckboxes, resetPriority, and clearCategorySelection functions, as well as the globalSubtasks variable.
 */
function clearTaskForm() {
    clearAssignedCheckboxes();
    resetPriority();
    clearCategorySelection();
    document.getElementById('title').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('assignedInitial').innerHTML = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('subtaskList').innerHTML = '';
    globalSubtasks = [];
}
/**
 * Opens the 'addTaskModel' popup by setting its display style to 'block'.
 */
function openTaskPopup(category) {
    currentCategory = category;
    let addTaskModel = document.getElementById("addTaskModel");
    if (window.innerWidth > 900) {
        addTaskModel.style.display = "flex";
    } else {
        addTaskModel.classList.add("hidden-responsive");
    }
}
/**
 * Adjusts the visibility of the 'addTaskModel' element based on the window's width.
 * This function checks the current inner width of the window. If the width is 900 pixels or less, it adds a class 'hidden-responsive' to the 'addTaskModel' element, effectively hiding it in a responsive manner. If the window's width is greater than 900 pixels, it removes the 'hidden-responsive' class from the 'addTaskModel' element, but only if the element's display style is already set to 'flex', ensuring the element is only made visible when it is intended to be shown.
 * This approach allows for responsive design, automatically adjusting the visibility of elements based on the window size.
 */
function checkWindowSize() {
    let addTaskModel = document.getElementById("addTaskModel");
    if (window.innerWidth <= 900) {
        addTaskModel.classList.add("hidden-responsive");
    } else {
        if (addTaskModel.style.display === "flex") {
            addTaskModel.classList.remove("hidden-responsive");
        }
    }
}
/**
 * Attaches event listeners to the window for 'load' and 'resize' events to execute the checkWindowSize function.
 * When the window is initially loaded ('load' event), or when it is resized ('resize' event), the checkWindowSize function is called.
 * This setup is typically used to adjust the layout or functionality of a webpage based on the window size, ensuring responsive design or behavior.
 */
window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);
/**
 * Closes the 'addTaskModel' popup by setting its display style to 'none'.
 */
function closeTaskPopup() {
    document.getElementById("addTaskModel").style.display = "none";
}
/**
 * Displays a modal for tasks and initiates an animation for the task card popup.
 * This function performs the following actions to display a modal and animate the task card popup:
 * 1. Finds the modal element by its ID 'taskModal' and sets its display style to 'block', making it visible.
 * 2. Finds the task card popup element by its ID 'modalTaskcard' and removes the class 'modal-task-popup-display-none' to make it visible.
 * 3. Sets a timeout of 10 milliseconds before calling the slideInPopupTask function with the argument 'taskCardPoupAnimation'.
 *    This delay ensures the CSS animation is triggered after the element becomes visible.
 * 
 * Note: This function assumes the existence of a slideInPopupTask function that handles the animation logic.
 */
function displayModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "block";
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
    setTimeout(() => {
        slideInPopupTask('taskCardPoupAnimation');
    }, 10);
}
/**
 * Attaches an event listener to the document that listens for clicks on elements with the class 'taskCard'.
 * Upon the DOMContentLoaded event, this script adds a click event listener to the entire document.
 * When a click event occurs, it checks if the clicked element has the class 'taskCard'.
 * If so, it retrieves the 'data-firebase-id' attribute from the clicked element, which is expected to be a unique identifier for a task.
 * It then searches an array named 'task' for an object where the 'firebaseId' property matches this identifier.
 * If a matching task object is found, it calls the showModal function, passing the found task object as an argument.
 * This is typically used to display detailed information about the task in a modal dialog.
 * 
 * Note: This script assumes the existence of a global 'task' array containing task objects with 'firebaseId' properties, and a showModal function.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("taskCard")) {
            const firebaseId = event.target.getAttribute("data-firebase-id");
            const taskItem = task.find(t => t.firebaseId === firebaseId);
            if (taskItem) showModal(taskItem);
        }
    });
});

/**
 * Opens the task window by navigating to 'addtask_desktop.html'.
 */
function openTaskWindow() {
    window.location.href = "addtask_desktop.html";
}