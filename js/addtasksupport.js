function requiredFields() {
    console.log('Überprüfung der erforderlichen Felder gestartet'); // Log 1
    let isValid = true;
    let title = document.getElementById('title');
    let date = document.getElementById('dueDate');
    let userCategory = document.querySelector('input[name="category"]:checked');

    title.style.border = '';
    date.style.border = '';

    if (title.value === '') {
        console.log('Titel ist erforderlich'); // Log 2
        title.style.border = '1px solid red';
        isValid = false; 
    } if (date.value === '') {
        console.log('Datum ist erforderlich'); // Log 3
        date.style.border = '1px solid red';
        isValid = false; 
    } if (!userCategory) {
        console.log('Kategorie ist erforderlich'); // Log 4
        document.getElementById('category').style.border = '1px solid red';
        isValid = false;
    }

    console.log('Gültigkeitsstatus:', isValid); // Log 5
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

function scrollToBottomAddtask() {
    const maincontainerAddtask = document.getElementById('maincontainerAddtask');
    if (maincontainerAddtask) {
        maincontainerAddtask.scrollTop = maincontainerAddtask.scrollHeight;
    }
}