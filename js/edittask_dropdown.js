/**
 * Toggles the display of the dropdown and its arrow rotation.
 * @param {Element} dropdown - The dropdown element to toggle.
 * @param {Element} dropdownArrow - The arrow element to rotate.
 */
function toggleDropdownDisplay(dropdown, dropdownArrow) {
    dropdownArrow.classList.toggle('rotate');
    dropdown.classList.toggle('show');
}

/**
 * Sets up a listener to detect clicks outside the dropdown to close it.
 * @param {Element} dropdown - The dropdown element to monitor.
 * @param {Element} dropdownArrow - The arrow element to rotate back.
 */
function setupClickOutsideListener(dropdown, dropdownArrow) {
    function handleClickOutside(event) {
        if (!dropdown.contains(event.target)) {
            toggleDropdownDisplay(dropdown, dropdownArrow);
            removeClickOutsideListener(handleClickOutside);
        }
    }
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
}

/**
 * Removes the outside click listener.
 * @param {Function} handleClickOutside - The function to remove.
 */
function removeClickOutsideListener(handleClickOutside) {
    document.removeEventListener('click', handleClickOutside);
}

/**
 * Opens the dropdown for editing assignments.
 * Initializes the dropdown and sets up the outside click listener.
 */
function openDropdownEditAssign() {
    let dropdown = document.querySelector('.dropdown-edit-content');
    let dropdownArrow = document.getElementById('dropdownArrow');
    toggleDropdownDisplay(dropdown, dropdownArrow);

    if (dropdown.classList.contains('show')) {
        setupClickOutsideListener(dropdown, dropdownArrow);
    }
}