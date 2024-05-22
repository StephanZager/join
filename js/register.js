const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Handles the form submission, validates the input, and sends the data to Firebase.
 * @param {Event} event - The form submission event.
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
        password: password
    };

    try {
        // Send data to Firebase
        await postData("/userData", userData); // Path to the DB where the record should be saved

        // Show success popup
        showSuccessPopup();

        // Redirect to the new page after 3 seconds
        setTimeout(() => {
            window.location.href = "index.html"; // Change this to the desired URL
        }, 3000);

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
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
        window.location.href = "index.html"; // Change this to the desired URL
    });
}

// Event listeners for toggling password visibility
document.getElementById('password').addEventListener('click', () => togglePasswordVisibility('password'));
document.getElementById('confirmPassword').addEventListener('click', () => togglePasswordVisibility('confirmPassword'));
