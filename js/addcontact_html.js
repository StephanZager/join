/**
 * Displays the "Add New Contact" popup window.
 */
function addNewContactPopUp() {
    document.getElementById('addNewContactPopUp').innerHTML =
    `
    <div id="bg_add_new_contact" class="d-none">
        <div class="bg" onclick="cloeAddNewContactwindow()">
            <div onclick="doNotClose(event)" id="popUpAddContact">
                <div class="addcontact-container">   
                    <img onclick="cloeAddNewContactwindow()" class="close-botton-addcontact-destop" src="assets/img/close-addcontact.png" alt="close">
                    <img onclick="cloeAddNewContactwindow()" class="close-botton-addcontact" src="assets/img/close.button.addcontact.png" alt="close">    
                    <div class="aboveSection">
                        <div class="headline">
                            <img class="join-logo" src="assets/img/logo.desktop.png" alt="logo">
                            <h2 class="h2-addcontact">Add contact</h2>
                            <p class="addcontact-p-task">Tasks are better with a team!</p>
                            <div class="seperator"></div>
                        </div>
                    </div>
                    <img class="profilImgAddContact" src="assets/img/profil.img.addcontact.png.png" alt="profile image">
                    <form id="form" action="" method="post" onsubmit="submitContact(); return false;">
                        <input type="text" class="addcontact-name" id="addcontact_name" name="name" required pattern="^[\\p{L}]+\\s[\\p{L}]+$" placeholder="Name" maxlength="25" oninput="this.setCustomValidity('')" oninvalid="this.setCustomValidity('Please enter first and last name')">
                        <input type="email" class="addcontact-email" id="addcontact_email" name="email" required placeholder="Email" maxlength="25">            
                        <input type="tel" class="addcontact-phone" id="addcontact_phone" name="phone" pattern="0[\\d\\s-]{9,13}" placeholder="01234567890" required maxlength="14">
                        <div class="form-button">
                            <button type="button" class="addcontact_cancel_Button" onclick="cloeAddNewContactwindow()">                    
                                <img class="img-cancel-x" src="assets/img/cancel-addcontact.png" alt="cancel">
                                <img class="img-cancel-x-hover" src="assets/img/cancel-hover-addcontact.png" alt="cancel">
                                <span>Cancel</span>
                            </button>
                            <div id="btn-create-addcontact" class="d-none">
                                <button type="submit" class="addcontact_Button">
                                    <img src="assets/img/check-addcontact.png" alt="check">Create Contact
                                </button>
                            </div>
                            <div id="btn-save-addcontact"></div>                
                        </div>
                    </form>     
                </div>                 
            </div>
        </div>
    </div>
    `; 
}

/**
 * Displays the "Update Contact" popup window for editing contact details.
 * 
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} [path="/contact"] - The path where the contacts are stored in the database.
 * @returns {string} - The HTML string for the update contact popup.
 */
function addUbdateContactPopUp(i, path = "/contact") {
    let user = contacts[i];
    return `<div id="bg_add_ubdate_contact" class="d-none">
    <div class="bg" onclick="cloeAddUbdateContactwindow()">
        <div onclick="doNotClose(event)" id="popUpUbdateContact">
        <div class="addcontact-container">
            <img onclick="cloeAddUbdateContactwindow()" class="close-botton-addcontact-destop" src="assets/img/close-addcontact.png" alt="close">
            <img onclick="cloeAddUbdateContactwindow()" class="close-botton-addcontact" src="assets/img/close.button.addcontact.png" alt="close">
            <div class="aboveSection">
                <div class="headline">
                    <img class="join-logo" src="assets/img/logo.desktop.png" alt="logo">
                    <h2 class="h2-addcontact">Add contact</h2>
                    <p class="addcontact-p-task">Tasks are better with a team!</p>
                    <div class="seperator"></div>
                </div>
            </div>
            <div>
                <div class="profilImgAddContact edit-contact-profil-icon" style="background-color:${user.bgNameColor};" class="initial-user">${user.firstLetters}</div>
            </div>
            <form id="form" action="" method="put" onsubmit="submitForm(event, ${i}, '${user.id}', '${path}'); return false;">
                <input type="text" class="addcontact-name" id="addcontact_edit_name" name="name" required placeholder="Name" maxlength="20">
                <input type="email" class="addcontact-email" id="addcontact_edit_email" name="email" required placeholder="Email" maxlength="25">            
                <input type="tel" class="addcontact-phone" id="addcontact_edit_phone" name="phone" pattern="0[\\d\\s-]{9,13}" placeholder="01234567890" required maxlength="14">
                <div class="form-button">
                    <button type="button" class="addcontact_cancel_Button" onclick="cloeAddUbdateContactwindow()">
                        <img class="img-cancel-x" src="assets/img/cancel-addcontact.png" alt="cancel">
                        <img class="img-cancel-x-hover" src="assets/img/cancel-hover-addcontact.png" alt="cancel">
                        <span>Cancel</span>
                    </button>
                    <div id="btn-create-addcontact">
                        <button type="submit" class="addcontact_Button">
                            <img src="assets/img/check-addcontact.png" alt="check">Save
                        </button>
                    </div>
                    <div id="btn-save-addcontact"></div>
                </div>
            </form>
        </div>           
        </div>
    </div>
</div>`;
}

/**
 * Generates the HTML for displaying user information.
 * 
 * @param {Object} user - The user object containing contact details.
 * @param {number} index - The index of the user in the contacts array.
 * @returns {string} - The HTML string for the user information.
 */
function userInfoHTML(user, index) {
    return `
    <div class="user-info-header">
        <div style="background-color:${user.bgNameColor};" class="initial-user">${user.firstLetters}</div>
        <div class="user-info-name">
            <h2 class="user-name">${user.name}</h2>
            <div class="edit-delete-desktop">
                <div class="user-edit-delete" id="buttonEditDeleteHandy">
                    <div class="user-edit-delete-section" onclick="editUser(${index}), slideInPopup('popUpUbdateContact')">
                        <img class="img-delete-contact" src="assets/img/edit-contacts.png" alt="edit">
                        <img class="img-delete-contact-hover" src="assets/img/pan-edit-hover-contact.png" alt="edit">
                        <p>Edit</p>
                    </div>
                    <div class="user-edit-delete-section" onclick="deleteUser(${index})">
                        <img class="img-delete-contact" src="assets/img/delete-contacts.png" alt="delete">
                        <img class="img-delete-contact-hover" src="assets/img/delete-trash-contact-hover.png" alt="delete">
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="contact-information-headline">
        <span>Contact Information</span>
    </div>
    <div class="contact-info-email-phone">
        <div>
            <p>Email</p>
            <a href="mailto:${user.email}">${user.email}</a>
        </div>
        <div>
            <p>Phone</p>
            <a style="color:black;" href="tel:${user.phone}">${user.phone}</a>
        </div>
    </div>
    `;
}

/**
 * Generates the HTML for displaying a contact in the contact list.
 * 
 * @param {Object} contact - The contact object containing contact details.
 * @returns {string} - The HTML string for the contact list item.
 */
function contactHTML(contact) {
    return `
    <div id="userButton${contact.originalIndex}" class="show-contact" tabindex="0" onclick="slideInPopup('contactInfo');openUserInfo(${contact.originalIndex});openUserInfoWindow();doNotClose(event)">               
        <div>
            <div style="background-color:${contact.bgNameColor};" class="initial-contact">
                <span>${contact.firstLetters}</span>
            </div>
        </div>
        <div class="show-contact-details">
            <span>${contact.name}</span> 
            <span class="show-contact-email">${contact.email}</span>
        </div>                       
    </div>
    `;
}

/**
 * Generates the HTML for the user edit/delete menu in mobile view.
 * 
 * @returns {string} - The HTML string for the user edit/delete menu.
 */
function getUserEditDeleteHTML() {
    return `
        <div id="bg-edit-delete">
            <div id="containerEditDeleteHandy" class="container-edit-delete-handy" onclick="doNotClose(event)">
                <div class="user-edit-delete-handy" id="buttonEditDeleteHandy">
                    <div onclick="editUser(${currentOpenUser}), slideInPopup('popUpUbdateContact'), closeUserDeleteEditWindow()" class="user-edit-delete-section-handy">
                        <img src="assets/img/edit-contacts.png" alt="edit">
                        <p>Edit</p>
                    </div>
                    <div onclick="deleteUser(${currentOpenUser}), closeUserDeleteEditWindow(), closeUserInfoWindow()" class="user-edit-delete-section-handy">
                        <img src="assets/img/delete-contacts.png" alt="delete">
                        <p>Delete</p>
                    </div>
                </div>
            </div>            
        </div>`;
}