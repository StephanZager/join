const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";
/**
 * Dynamically includes HTML content into elements based on the "w3-include-html" attribute.
 * This function searches for all elements with the "w3-include-html" attribute and attempts to fetch the HTML content
 * specified in the attribute's value. If the fetch operation is successful, the content is included into the element.
 * If the fetch fails (e.g., due to a 404 error), a "Page not found" message is displayed instead.
 * After processing all elements, the function calls `afterHTMLIncluded` to perform any necessary follow-up actions.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    await afterHTMLIncluded();
}
/**
 * Executes a series of functions after the HTML content is fully loaded, adjusting the UI based on the current URL.
 * This function is designed to be called once the HTML document's content is fully loaded to ensure that all DOM elements
 * are accessible. It performs initial UI setup tasks such as showing the login state, highlighting active links, and checking
 * user authentication. Additionally, it adjusts the visibility of certain elements based on the current page, specifically
 * for privacy policy and legal notice pages, and applies further UI adjustments for login and signup policies.
 */
async function afterHTMLIncluded() {
    showLoginInitial(); 
    highlightActiveLinks();
    checkAuthentication();
    
    if (window.location.pathname.includes('privacy-police.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        if (loginHelpElement) {
            loginHelpElement.style.display = 'none';
        }
    }
   
    if (window.location.pathname.includes('legalnotice.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        if (loginHelpElement) {
            loginHelpElement.style.display = 'none';
        }
    }

    loginSignupPolicies();
}
/**
 * Adjusts the visibility and positioning of certain page elements during the signup process based on the current URL.
 * This function first calls `changeUrl` to adjust link URLs as necessary. Then, it checks the current page's pathname.
 * If the user is on the privacy policy or legal notice pages during signup, it hides the login help and content menu elements
 * and adjusts the margin of the policy links element. This is intended to streamline the user interface on these specific pages.
 */
async function loginSignupPolicies() {
    changeUrl();
    setInnerWidthPolicies();
    if (window.location.pathname.includes('policy_over_signup.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        let contentMenu = document.getElementById('navbar');
        let policeElements = document.getElementById('policeLinks');
        if (loginHelpElement && contentMenu && policeElements) {
            loginHelpElement.style.display = 'none';
            contentMenu.style.display = 'none';
            policeElements.style.marginTop = 'auto';
        }
    }
    if (window.location.pathname.includes('legal_notice_over_signup.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        let contentMenu = document.getElementById('navbar');
        let policeElements = document.getElementById('policeLinks');
        if (loginHelpElement && contentMenu) {
            loginHelpElement.style.display = 'none';
            contentMenu.style.display = 'none';
            policeElements.style.marginTop = 'auto';
        }
    }
}
/**
 * Dynamically changes the URLs of privacy and legal notice links based on the current page.
 * This function checks the current page's pathname. If the user is on either the privacy policy or legal notice signup pages,
 * it updates the href attributes of the privacy policy and legal notice links to point to the respective pages.
 * This ensures that users are directed to the correct information pages during the signup process.
 */
async function changeUrl(){
    if (window.location.pathname.includes('policy_over_signup.html')) {
        let privacyUrl = document.getElementById('privacyPolice');
        let legalUrl = document.getElementById('legalNotice');
        if (privacyUrl && legalUrl) {
            privacyUrl.href = 'policy_over_signup.html';
            legalUrl.href = 'legal_notice_over_signup.html';
        }
    }
    if (window.location.pathname.includes('legal_notice_over_signup.html')) {
        let privacyUrl = document.getElementById('privacyPolice');
        let legalUrl = document.getElementById('legalNotice');
        if (privacyUrl && legalUrl) {
            privacyUrl.href = 'policy_over_signup.html';
            legalUrl.href = 'legal_notice_over_signup.html';
        }
    }
}

function setInnerWidthPolicies() {
    let innerWidth = window.innerWidth;
    let menubar = document.getElementById('menubar');
    if (innerWidth < 900 && menubar) {
        menubar.style.display = 'none';
    } else if (innerWidth >= 900) {
        menubar.style.display = 'flex';
    }
}

window.onload = setInnerWidthPolicies;
window.onresize = setInnerWidthPolicies;
/**
 * Toggles the visibility of the dropdown menu.
 * This function adds or removes the "show" class to the element with the ID "dropdownMenu",
 * effectively showing or hiding the dropdown menu.
 */
function dropdownMenu() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}
/**
 * Closes the dropdown menu when clicking outside of it.
 * This function is attached to the window's click event and checks if the clicked element matches the specified selector.
 * If the clicked element does not match, it iterates through all elements with the class "dropdown-content"
 * and removes the "show" class from any that have it, closing any open dropdown menus.
 */
window.onclick = function(event) {
    if (!event.target.matches('#joinProfil')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
/**
 * Highlights active links in the navigation based on the current URL.
 * This function iterates through all links within the navigation bar and additional link sections,
 * compares the current URL with the href attribute of the links, and adds or removes specific CSS classes
 * to visually indicate the active state. This includes highlighting the text, associated sections, and images.
 */
function highlightActiveLinks() {
    let currentUrl = window.location.href;
    let links = document.querySelectorAll('.navbar .link, .links .link-to');
    links.forEach(function (link) {
        let linkSection = link.closest('.linkSection');
        let img = link.querySelector('img');

        if (currentUrl.includes(link.getAttribute('href'))) {
            if (link.classList.contains('link-to') && link.closest('.links')) {
                link.classList.add('activeLink'); 
            }
            if (linkSection) {
                linkSection.classList.add('activeLink');
            }
            link.classList.add('activeText');
            if (img) {
                img.classList.add('activeImage');
            }
        } else {
            if (link.classList.contains('link-to') && link.closest('.links')) {
                link.classList.remove('activeLink');
            }
            if (linkSection) {
                linkSection.classList.remove('activeLink');
            }
            link.classList.remove('activeText');
            if (img) {
                img.classList.remove('activeImage');
            }
        }
    });
}
/**
 * Checks if the current user is authenticated or has access to allowed paths.
 * If the user is not logged in, does not have guest access, and the current path is not allowed,
 * the user is redirected to the login page.
 */
function checkAuthentication() {
    const allowedPaths = ['/index.html', '/policy_over_signup.html', '/legal_notice_over_signup.html'];
    const currentPath = window.location.pathname;

    const isLoggedIn = localStorage.getItem('loggedInUser');
    const isGuest = localStorage.getItem('guestLogin');

    const isAllowedPath = allowedPaths.includes(currentPath);

    if (!isLoggedIn && !isGuest && !isAllowedPath) {
        window.location.href = 'index.html';
    }
}

/**
 * Checks if the current device is a mobile device based on the user agent.
 * It tests the navigator's userAgent against a regex pattern that matches common mobile device identifiers.
 * 
 * @returns {boolean} True if the user agent matches a mobile device, false otherwise.
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}





