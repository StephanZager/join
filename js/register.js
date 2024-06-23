/**
 * Handles the form submission, validates the input, and sends the data to Firebase.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function submitData(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    let name = document.getElementById('userName').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let errorMessage = document.getElementById('errorMessage');
    let criteriaMessage = document.getElementById('criteriaMessage');
    let emailExistsMessage = document.getElementById('emailExistsMessage');

    // Hide all error messages
    errorMessage.style.display = 'none';
    criteriaMessage.style.display = 'none';
    emailExistsMessage.style.display = 'none';

    // Check password criteria
    if (!isValidPassword(password)) {
        criteriaMessage.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        return;
    }

    if (await emailExists(email)) {
        emailExistsMessage.style.display = 'block';
        return;
    }

    let userData = {
        name: name,
        email: email,
        password: password,
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name)
    };

    let contact = {
        name: name,
        email: email,
        phone: "Telefon/Mobilnummer",
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name),
    };

    try {
        // Send data to Firebase
        await postData("/userData", userData); // Path to the DB where the record should be saved

        await postData("/contact", contact);

        // Show success popup
        showSuccessPopup();

        // Redirect to the new page after 3 seconds
        setTimeout(() => {
            window.location.href = "index.html"; // Change this to the desired URL
        }, 2000);

    } catch (error) {
        console.error("Error posting data:", error);
    }
}

/**
 * Toggles the visibility of the password field.
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
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}

/**
 * Checks if the given email already exists in the database.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
async function emailExists(email) {
    try {
        let response = await fetch(BASE_URL + "/userData.json");
        if (!response.ok) {
            throw new Error("Error fetching data: " + response.statusText);
        }
        let data = await response.json();
        for (let key in data) {
            if (data[key].email === email) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
    }
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
 * Sends data to the specified path in the Firebase database.
 * @param {string} path - The path in the Firebase database to send the data.
 * @param {Object} data - The data to send.
 * @returns {Promise<Object>} The response from the Firebase database.
 * @throws Will throw an error if the request fails.
 */
async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        // Add error handling
        console.error("Error posting data:", response.statusText);
        return;
    }

    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Displays the success popup and adds a click listener for immediate redirection.
 */
function showSuccessPopup() {
    let popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    popup.addEventListener('click', () => {
        window.location.href = "index.html";
    });
}

/**
 * Sets up the password field toggle functionality to show/hide the password.
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

        // Restore the cursor position
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

// Initialize password field toggles
setupPasswordFieldToggle("password");
setupPasswordFieldToggle("confirmPassword");
