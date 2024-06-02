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

/**
 * @fileOverview Script to toggle password visibility on click and change background image accordingly.
 * @module PasswordToggle
 */

document.addEventListener("DOMContentLoaded", function() {
  /**
   * The password input field element.
   * @type {HTMLElement}
   */
  const passwordInput = document.getElementById("passwordInput");

  /**
   * Indicates if the password is visible.
   * @type {boolean}
   */
  let isPasswordVisible = false;

  /**
   * Counter to track the number of clicks.
   * @type {number}
   */
  let clickCount = 0;

  /**
   * Event listener for the click event on the password input field.
   */
  passwordInput.addEventListener("click", function() {
    clickCount += 1;
    if (clickCount === 1) {
      passwordInput.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
    } else if (clickCount === 2) {
      isPasswordVisible = true;
      passwordInput.type = "text";
      passwordInput.style.backgroundImage = "url('../assets/img/visibility_on.png')";
    } else if (clickCount === 3) {
      isPasswordVisible = false;
      passwordInput.type = "password";
      passwordInput.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
      clickCount = 0; 
    }
  });

  /**
   * Event listener for the focus event on the password input field.
   */
  passwordInput.addEventListener("focus", function() {
    if (!isPasswordVisible) {
      passwordInput.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
    }
  });

  /**
   * Event listener for the blur event on the password input field.
   */
  passwordInput.addEventListener("blur", function() {
    if (!isPasswordVisible) {
      passwordInput.style.backgroundImage = "url('../assets/img/lock-password-input.png')";
      clickCount = 0; 
    }
  });
});