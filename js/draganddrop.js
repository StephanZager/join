let currentDraggedElement = null;


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