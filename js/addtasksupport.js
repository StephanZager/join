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

function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });
    
    globalSubtasks = [];
    document.getElementById('subtaskList').innerHTML = '';
    assignDetails = [];
    document.getElementById('assignedInitial').innerHTML = '';
    clearCategorySelection();
}

