/**
 * Validates required fields and highlights any missing inputs.
 * @returns {boolean} - Returns true if all fields are valid, otherwise false.
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
    } 
    if (date.value === '') {
        date.style.border = '1px solid red';
        isValid = false; 
    } 
    if (!userCategory) {
        document.getElementById('category').style.border = '1px solid red';
        isValid = false;
    }
    
    return isValid;
}