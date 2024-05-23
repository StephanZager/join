/**
 * Event listener for DOMContentLoaded.
 * Initializes the login form and loads saved credentials if 'Remember me' was checked.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('login-form');
    const signupSection = document.querySelector('.signup-section');
    const footer = document.querySelector('footer');
    const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('error-message');

    // Load saved email and password if 'Remember me' was checked
    if (localStorage.getItem('rememberMe') === 'true') {
        emailInput.value = localStorage.getItem('email');
        passwordInput.value = localStorage.getItem('password');
        rememberMeCheckbox.checked = true;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        login();
    });
});

/**
 * Base URL for Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Handles user login.
 * Fetches user data from Firebase and validates email and password.
 * Redirects to summary page if credentials are valid.
 * Saves credentials in local storage if 'Remember me' is checked.
 * @async
 */
async function login() {
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;
    const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
    const errorMessage = document.getElementById('error-message');

    try {
        let userData = await getData("/userData");

        let user = null;
        for (let key in userData) {
            if (userData[key].email === email && userData[key].password === password) {
                user = userData[key];
                break;
            }
        }

        if (user) {
            // Save credentials if 'Remember me' is checked
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.setItem('rememberMe', 'false');
            }

            // Save user's name
            localStorage.setItem('userName', user.name);
            console.log("Username saved to localStorage:", user.name);

            window.location.href = "summary.html";
        } else {
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
    }
}

/**
 * Fetches data from the given Firebase path.
 * @async
 * @param {string} path - The path to fetch data from.
 * @returns {Promise<Object>} The fetched data.
 */
async function getData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
        console.error("Error fetching data:", response.statusText);
        return;
    }
    let responseData = await response.json();
    return responseData;
}

