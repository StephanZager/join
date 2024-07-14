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


