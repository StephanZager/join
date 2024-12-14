/**
 * Handles the DOMContentLoaded event to initialize the login form functionalities.
 * - Loads saved email and password if 'Remember me' was checked.
 * - Sets up event listeners for form submission and password visibility toggle.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById('login-form')) {
    const form = document.getElementById('login-form');
    const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('error-message');

    if (localStorage.getItem('rememberMe') === 'true') {
      emailInput.value = localStorage.getItem('email');
      passwordInput.value = localStorage.getItem('password');
      rememberMeCheckbox.checked = true;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      login();
    });

    setupPasswordToggle(passwordInput);
  }
});


/**
 * Initializes password toggle functionality for an input field.
 * @param {HTMLInputElement} passwordInputField - The password input field to enhance.
 */
function setupPasswordToggle(passwordInputField) {
  let isPasswordVisible = false;
  let clickCount = 0;

  /**
   * Toggles the password visibility and updates the input type.
   */
  function togglePasswordVisibility() {
    isPasswordVisible = !isPasswordVisible;
    passwordInputField.type = isPasswordVisible ? "text" : "password";
    updateBackgroundImage();
  }

  /**
   * Resets the click count to zero.
   */
  function resetClickCount() {
    clickCount = 0;
  }

  /**
   * Updates the background image of the password input field.
   */
  function updateBackgroundImage() {
    const image = isPasswordVisible ? "visibility_on.png" : "visibility_off_password.png";
    passwordInputField.style.backgroundImage = `url('../assets/img/${image}')`;
  }

  /**
   * Handles mouse down events to toggle visibility or update image.
   * @param {MouseEvent} event - The mouse down event.
   */
  function handleMouseDown(event) {
    event.preventDefault();
    clickCount += 1;
    const cursorPosition = passwordInputField.selectionStart;

    if (clickCount === 1) {
      updateBackgroundImage();
    } else if (clickCount === 2) {
      togglePasswordVisibility();
    } else if (clickCount === 3) {
      togglePasswordVisibility();
      resetClickCount();
    }

    passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
    passwordInputField.focus();
  }

  /**
   * Handles focus events to update the background image if needed.
   */
  function handleFocus() {
    if (!isPasswordVisible) {
      updateBackgroundImage();
    }
  }

  /**
   * Handles blur events to reset background image and click count.
   */
  function handleBlur() {
    if (!isPasswordVisible) {
      passwordInputField.style.backgroundImage = "url('../assets/img/lock-password-input.png')";
      resetClickCount();
    }
  }

  passwordInputField.addEventListener("mousedown", handleMouseDown);
  passwordInputField.addEventListener("focus", handleFocus);
  passwordInputField.addEventListener("blur", handleBlur);
}

/**
 * Finds a user by email and password.
 * @param {Object} userData - The user data object.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object|null} - The matched user or null if not found.
 */
async function findUserByEmailAndPassword(userData, email, password) {
  for (let key in userData) {
    if (userData[key].email === email && userData[key].password === password) {
      return userData[key];
    }
  }
  return null;
}

/**
 * Handles successful login.
 * @param {Object} user - The user object.
 * @param {HTMLInputElement} rememberMeCheckbox - The "Remember Me" checkbox element.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
function handleLoginSuccess(user, rememberMeCheckbox, email, password) {
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.setItem('rememberMe', 'false');
  }
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userFirstLetters', user.firstLetters);
  localStorage.setItem('loggedInUser', user.name);
  localStorage.setItem('showGreetings', 'true');
  window.location.href = "summary.html";
}

/**
 * Displays an error message.
 * @param {HTMLElement} errorMessageElement - The error message element.
 */
function displayError(errorMessageElement) {
  errorMessageElement.style.display = 'block';
}

/**
 * Handles the login process.
 */
async function login() {
  let email = document.getElementById('emailInput').value;
  let password = document.getElementById('passwordInput').value;
  const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
  const errorMessage = document.getElementById('error-message');

  try {
    let userData = await getData("/userData");
    let user = await findUserByEmailAndPassword(userData, email, password);

    if (user) {
      handleLoginSuccess(user, rememberMeCheckbox, email, password);
    } else {
      displayError(errorMessage);
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
  }
}

/**
 * Handles guest login.
 */
async function guestLogin() {
  const guestEmail = "guest@example.de";
  const guestPassword = "Test12..";

  try {
    let userData = await getData("/userData");
    let guestUser = await findUserByEmailAndPassword(userData, guestEmail, guestPassword);

    if (guestUser) {
      handleGuestLoginSuccess(guestUser, guestEmail);
    } else {
      console.error("Guest account not found.");
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
  }
}

/**
 * Handles successful guest login.
 * @param {Object} guestUser - The guest user object.
 * @param {string} guestEmail - The guest email.
 */
function handleGuestLoginSuccess(guestUser, guestEmail) {
  localStorage.setItem('email', guestEmail);
  localStorage.setItem('userName', guestUser.name);
  localStorage.setItem('userFirstLetters', guestUser.firstLetters);
  localStorage.setItem('guestLogin', 'true');
  localStorage.setItem('showGreetings', 'true');
  window.location.href = "summary.html";
}

/**
 * Logs out the user.
 */
function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userFirstLetters');
  localStorage.removeItem('guestLogin');
  window.location.href = "index.html";
}

/**
 * Displays the user's initials on all pages.
 */
function showLoginInitial() {
  let userFirstLetters = localStorage.getItem('userFirstLetters');
  let joinProfilElement = document.getElementById('joinProfil');
  if (joinProfilElement) {
    joinProfilElement.innerHTML = userFirstLetters;
  }
}

document.addEventListener('DOMContentLoaded', showLoginInitial);