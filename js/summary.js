

function greeting() {
    let grettingSummary = document.getElementById('greetingSummary');
    let realTime = new Date();
    let hours = realTime.getHours();

    if (hours >= 18) {
        grettingSummary.innerHTML = 'Good evening,';
    } else if (hours <= 10) {
        grettingSummary.innerHTML = 'Good morning,';
    } else if (hours >= 6 && hours <= 18) {
        grettingSummary.innerHTML = 'Good Day,';
    }
}

function initSummary() {
    greeting();
}