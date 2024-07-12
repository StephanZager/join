let currentDraggedElement = null;
let currentTaskFirebaseId = null;
/**
 * Initiates the dragging of an element by setting the current dragged element's Firebase ID,
 * adding data to the drag event, and applying a 'rotated' class to visually indicate the dragging state.
 * This function is typically bound to the `ondragstart` event of draggable elements.
 * 
 * @param {Event} ev - The drag event object.
 * @param {string} firebaseId - The Firebase ID of the element being dragged.
 */
function startDragging(ev, firebaseId) {
    currentDraggedElement = firebaseId;
    ev.dataTransfer.setData("text/plain", firebaseId);
    ev.target.classList.add('rotated');
}
/**
 * Removes the 'rotated' class from the event target, effectively stopping its dragging animation or state.
 * This function is typically called when a drag operation is completed or cancelled.
 * 
 * @param {Event} ev - The event object associated with the drag event.
 */
function stopDragging(ev) {
    ev.target.classList.remove('rotated');
}
/**
 * Prevents the default handling of the drop event.
 * This function is typically used in drag and drop operations to allow a drop by preventing the default behavior.
 * 
 * @param {Event} ev - The event object associated with the drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Asynchronously moves a task to a specified category.
 * It updates the task's category both locally and in Firebase.
 * After updating, it regenerates the task display and, if the task has subtasks, updates the progress bar.
 * 
 * @param {string} category - The category to move the task to.
 */
async function moveTo(category) {
    const firebaseId = currentDraggedElement;
    if (!firebaseId) {
        console.error("Keine verschobene Aufgabe gefunden.");
        return;
    }

    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
        return;
    }

    try {
        task[taskIndex].category = category;
        await updateTaskInFirebase(firebaseId, { category });
        generateTask();
        if ((task[taskIndex].subtasks || []).length > 0) {
            updateProgressBar(task[taskIndex]);
        }
    } catch (error) {
        console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
}

/**
 * Toggles the visibility of the "move to category" dropdown for mobile devices.
 * 
 * This function sets the current task's Firebase ID to the provided ID, then toggles the visibility
 * of the dropdown menu. If the dropdown becomes visible, it adds an event listener to handle clicks outside
 * of the dropdown, allowing it to be closed on such an action.
 * 
 * @param {string} firebaseId The Firebase ID of the task for which the move menu is being opened.
 */
function openMoveMobileMenu(firebaseId) {
    currentTaskFirebaseId = firebaseId;
    let dropdownContent = document.getElementById('moveToCategoryDropdown');
    dropdownContent.classList.toggle('show-move-to-category-dropdown');
   
    if (dropdownContent.classList.contains('show-move-to-category-dropdown')) {
        document.addEventListener('click', handleClickOutside, true);
    }
}

/**
 * Handles clicks outside the "move to category" dropdown, closing it if the click is outside.
 * 
 * This function checks if the click event occurred outside of the dropdown menu. If so, it removes
 * the class that displays the dropdown and removes this event listener to stop listening for outside clicks.
 * 
 * @param {Event} event The click event that triggered this function.
 */
function handleClickOutside(event) {
    let dropdownContent = document.getElementById('moveToCategoryDropdown');
    if (!dropdownContent.contains(event.target)) {
        dropdownContent.classList.remove('show-move-to-category-dropdown');
        
        document.removeEventListener('click', handleClickOutside, true);
    }
}

/**
 * Validates the existence of a task by its Firebase ID.
 * 
 * This asynchronous function checks if a given Firebase ID corresponds to any task in the local task array.
 * If no Firebase ID is provided or if no task matches the given ID, it logs an error message.
 * 
 * @param {string} firebaseId The Firebase ID of the task to validate.
 * @returns {Promise<number>} The index of the task in the local array if found, -1 otherwise.
 */
async function validateTask(firebaseId) {
    if (!firebaseId) {
        console.error("Keine Firebase-ID angegeben.");
        return -1;
    }
    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
    }
    return taskIndex;
}

/**
 * Hides the dropdown menu for moving tasks to categories.
 * 
 * This function selects the dropdown element by its ID and removes the class that makes it visible.
 * It also removes the event listener that handles clicks outside the dropdown, effectively closing it.
 */
function hideDropdown() {
    let dropdownContent = document.getElementById('moveToCategoryDropdown');
    dropdownContent.classList.remove('show-move-to-category-dropdown');
    document.removeEventListener('click', handleClickOutside, true);
}

/**
 * Moves a task to a specified category.
 * 
 * This asynchronous function updates the category of a task both in the local state and in Firebase.
 * After updating, it regenerates the task list and, if applicable, updates the progress bar of the task.
 * Finally, it hides the dropdown menu used for moving tasks.
 * 
 * @param {string} category The target category to move the task to.
 */
async function moveToCategory(category) {
    const firebaseId = currentTaskFirebaseId;
    const taskIndex = await validateTask(firebaseId);
    if (taskIndex === -1) return;

    try {
        task[taskIndex].category = category;
        await updateTaskInFirebase(firebaseId, { category });
        generateTask();
        if ((task[taskIndex].subtasks || []).length > 0) {
            updateProgressBar(task[taskIndex]);
        }
        hideDropdown();
    } catch (error) {
        console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
}