/**
 * Validates the presence of required fields in a form and visually indicates missing values.
 * This function checks if the 'title', 'dueDate', and 'category' fields have been filled out or selected.
 * If any of these fields are empty or not selected, it marks them visually by setting their border to red and sets the isValid flag to false.
 * The function returns a boolean value indicating whether all required fields have been properly filled out or selected.
 * 
 * @returns {boolean} isValid - True if all required fields are filled out or selected, false otherwise.
 */
function requiredFields() {
    let isValid = true;
    let title = document.getElementById('title');
    let date = document.getElementById('dueDate');
    let userCategory = document.querySelector('input[name="category"]:checked');

    title.style.border = '';
    date.style.border = '';

    if (title.value === '') {
        title.style.border = '1px solid red';
        isValid = false; 
    } if (date.value === '') {
        date.style.border = '1px solid red';
        isValid = false; 
    } if (!userCategory) {
        document.getElementById('category').style.border = '1px solid red';
        isValid = false;
    }
    return isValid;
}
/**
 * Clears all subtask-related selections and resets the task form to its initial state.
 * This function performs several actions to reset the state of the task form, specifically targeting subtasks and related selections:
 * - Removes the 'selected' class from all priority buttons, effectively deselecting them, and resets their images to the original ones specified in their 'data-original-image' attribute.
 * - Clears the global `globalSubtasks` array, removing all stored subtask data.
 * - Empties the inner HTML of the 'subtaskList' element, removing all listed subtasks from the UI.
 * - Resets the `assignDetails` array, clearing all stored assignment details.
 * - Clears the inner HTML of the 'assignedInitial' element, removing all visual indications of assigned contacts.
 * - Calls `clearCategorySelection` to reset any category selections made, assuming this function is defined elsewhere and handles the logic for clearing category-related selections.
 * 
 * @remarks
 * - Assumes the presence of elements with the class '.prio-buttons button' for priority buttons, 'subtaskList' for the subtask list container, and 'assignedInitial' for displaying assigned contacts' initials.
 * - The function directly modifies global variables `globalSubtasks` and `assignDetails`, which should be defined in the broader scope.
 */
function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image');
    });
    
    globalSubtasks = [];
    document.getElementById('subtaskList').innerHTML = '';
    assignDetails = [];
    document.getElementById('assignedInitial').innerHTML = '';
    clearCategorySelection();
}

