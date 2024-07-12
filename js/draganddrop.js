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
 * Öffnet oder schließt das Dropdown-Menü für die mobile Ansicht, um eine Aufgabe in eine andere Kategorie zu verschieben.
 * 
 * Diese Funktion wechselt die Sichtbarkeit des Dropdown-Menüs zum Verschieben von Aufgaben. Wenn das Menü geöffnet wird,
 * fügt es einen Event-Listener hinzu, der auf Klicks außerhalb des Dropdowns hört, um das Menü zu schließen. Wenn das Menü
 * geschlossen wird, entfernt es diesen Event-Listener, um unnötige Event-Listener im Dokument zu vermeiden.
 * 
 * @param {string} firebaseId - Die Firebase-ID der Aufgabe, die verschoben werden soll. Diese ID wird verwendet,
 * um die aktuelle Aufgabe zu identifizieren und den Zustand `currentTaskFirebaseId` entsprechend zu setzen.
 */
function openMoveMobileMenu(firebaseId) {
    currentTaskFirebaseId = firebaseId;
   let dropdownContent = document.getElementById('moveToCategoryDropdown');
   dropdownContent.classList.toggle('show-move-to-category-dropdown');

   function handleClickOutside(event) {
    if (!dropdownContent.contains(event.target)) {
        dropdownContent.classList.remove('show-move-to-category-dropdown'); 
        document.removeEventListener('click', handleClickOutside); 
    }

    } if (dropdownContent.classList.contains('show-move-to-category-dropdown')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    } else {
    document.removeEventListener('click', handleClickOutside);
    }
}

/**
 * Verschiebt eine Aufgabe in eine neue Kategorie.
 * 
 * Diese Funktion aktualisiert die Kategorie einer Aufgabe sowohl im lokalen Zustand als auch in Firebase.
 * Nach der Aktualisierung wird die Aufgabenliste neu generiert und der Fortschrittsbalken aktualisiert,
 * falls die Aufgabe Unteraufgaben hat. Schließlich wird das Dropdown-Menü zum Verschieben der Kategorien geschlossen.
 * 
 * @param {string} category - Die Zielkategorie, in die die Aufgabe verschoben werden soll.
 */
async function moveToCategory(category) {
    const firebaseId = currentTaskFirebaseId;
    if (!firebaseId) {
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
        let dropdownContent = document.getElementById('moveToCategoryDropdown');
        dropdownContent.classList.remove('show-move-to-category-dropdown');
    } catch (error) {
        console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
}