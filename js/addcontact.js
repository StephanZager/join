function openAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
}

function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

