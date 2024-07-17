/**
 * Handles the form submission, validates the input, and sends the data to Firebase.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function submitData(event) {
    event.preventDefault(); 
    
    let name = document.getElementById('userName').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    hideErrorMessages();
   
    let isValid = await validateForm(password, confirmPassword, email);
    if (!isValid) {
        return; 
    }
   
    let userData = createUserData(name, email, password);
    let contact = createContactData(name, email);
    await submitFormData(userData, contact);  
}

/**
 * Hides all error messages by setting their display style to 'none'.
 * 
 */
function hideErrorMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('criteriaMessage').style.display = 'none';
    document.getElementById('emailExistsMessage').style.display = 'none';
}

/**
 * Creates a user data object with the provided information.  * 
 * 
 * @returns {Object} - The user data object.
 */
function createUserData(name, email, password) {
    let user = {
        name: name,
        email: email,
        password: password,
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name)
    };
    return user;
}

/**
 * Creates a contact data object with the provided information. * 
 * 
 * @returns {Object} - The contact data object.
 */
function createContactData(name, email) {
    let contact = {
        name: name,
        email: email,
        phone: "Telefon/Mobilnummer",
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name),
    };
    return contact;
}

/**
 * Validates the form inputs for password criteria, password match, and email existence. * 
 * 
 * @returns {Promise<boolean>} - Returns true if validation is successful, otherwise false.
 */
async function validateForm(password, confirmPassword, email) {
    let errorMessage = document.getElementById('errorMessage');
    let criteriaMessage = document.getElementById('criteriaMessage');
    let emailExistsMessage = document.getElementById('emailExistsMessage');
    
    if (!isValidPassword(password)) {
        criteriaMessage.style.display = 'block';
        return false;
    }    
    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        return false;
    }    
    if (await emailExists(email)) {
        emailExistsMessage.style.display = 'block';
        return false;
    }
    return true;
}

/**
 * Submits the user data and contact data to the server.
 * 
 * @param {Object} userData - The user data object.
 * @param {Object} contact - The contact data object.
 * @returns {Promise<void>}
 */
async function submitFormData(userData, contact) {
    try {        
        await postData("/userData", userData);       
        await postData("/contact", contact);       
        showSuccessPopup();
       
        setTimeout(() => {
            window.location.href = "index.html"; 
        }, 2000);
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

/**
 * Sets up the password field toggle functionality to show/hide the password.
 * 
 * @param {string} inputFieldId - The ID of the password input field.
 */
function setupPasswordFieldToggle(inputFieldId) {
    const passwordInputField = document.getElementById(inputFieldId);
    let isPasswordVisible = false;
    let clickCount = 0;

    passwordInputField.addEventListener("mousedown", function(event) {
        event.preventDefault();
        clickCount += 1;
        const cursorPosition = passwordInputField.selectionStart;

        if (clickCount === 1) {
            passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
        } else if (clickCount === 2) {
            isPasswordVisible = true;
            passwordInputField.type = "text";
            passwordInputField.style.backgroundImage = "url('../assets/img/visibility_on.png')";
        } else if (clickCount === 3) {
            isPasswordVisible = false;
            passwordInputField.type = "password";
            passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
            clickCount = 0;
        }

        
        passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
        passwordInputField.focus();
    });

    passwordInputField.addEventListener("focus", function() {
        if (!isPasswordVisible) {
            passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
        }
    });

    passwordInputField.addEventListener("blur", function() {
        if (!isPasswordVisible) {
            passwordInputField.style.backgroundImage = "url('../assets/img/lock-password-input.png')";
            clickCount = 0;
        }
    });
}

setupPasswordFieldToggle("password");
setupPasswordFieldToggle("confirmPassword");


/**
 * Toggles the visibility of the password field.
 * 
 * @param {string} fieldId - The ID of the password field to toggle.
 */
function togglePasswordVisibility(fieldId) {
    let passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordField.classList.add("visible");
    } else {
        passwordField.type = "password";
        passwordField.classList.remove("visible");
    }
}

/**
 * Validates the password against specific criteria.
 * 
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}


function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');

    return firstLetters;
}


function toAssignColorNameLogo() {
    let backgroundcolor = userNameColor[Math.floor(Math.random() * userNameColor.length)];

    return backgroundcolor;
}

/**
 * Displays the success popup and adds a click listener for immediate redirection.
 * 
 */
function showSuccessPopup() {
    let popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    popup.addEventListener('click', () => {
        window.location.href = "index.html";
    });
}