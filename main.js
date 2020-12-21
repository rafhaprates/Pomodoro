const arrows = document.querySelectorAll('.arrow')
const actions = {
    arrowUpJob,
    arrowDownJob,
    arrowUpPause,
    arrowDownPause,
    arrowUpSection,
    arrowDownSection,
}

arrows.forEach(arrow => {
    arrow.addEventListener("click", changeNumber)
})

function changeNumber(event) {
    const action = event.target.id
    const changeNumberAction = actions[action]

    if (changeNumberAction) {
        changeNumberAction()
    }
}

function arrowUpJob() {
    incrementNumberForFieldId("workingNumber")
}

function arrowDownJob() {
    decrementNumberForFieldId("workingNumber")
}

function arrowUpPause() {
    incrementNumberForFieldId("breakNumber")
}

function arrowDownPause() {
    decrementNumberForFieldId("breakNumber")
}

function arrowUpSection() {
    incrementNumberForFieldId("sessionNumber")
}

function arrowDownSection() {
    decrementNumberForFieldId("sessionNumber")
}

function incrementNumberForFieldId(fieldId) {
    const field = document.querySelector("#" + fieldId)
    let number = parseInt(field.textContent)
    
    number++

    field.innerHTML = number
}

function decrementNumberForFieldId(fieldId) {
    const field = document.querySelector("#" + fieldId)
    let number = parseInt(field.textContent)
    
    number--

    if (number < 0) {
        return
    }

    field.innerHTML = number
}

function createPomodoro() {
    let workingTime = parseInt(document.querySelector("#workingNumber").textContent)
    let breakTime = parseInt(document.querySelector("#breakNumber").textContent)
    let numberOfSessions = parseInt(document.querySelector("#sessionNumber").textContent)

    sessionStorage.setItem('workingTime', workingTime)
    sessionStorage.setItem('breakTime', breakTime)
    sessionStorage.setItem('numberOfSessions', numberOfSessions)

    window.location.href='pomodoro.html';
}

function generatePomodoro() {
    let workingTime = formatLeftZero(sessionStorage.getItem('workingTime'));

    sessionStorage.removeItem('lastTimer');
    sessionStorage.setItem('indicatorsFinished', 0)
    sessionStorage.removeItem('breakWork');

    setWorkTimeInScreen(workingTime + ':00');
    generateIndicatorsSessions();
}

function setWorkTimeInScreen(workingTime) {
    document.querySelector("#timer").innerHTML = workingTime;
}

function generateIndicatorsSessions(className) {
    let numberOfSessions = sessionStorage.getItem('numberOfSessions');
    let indicatorsFinished = sessionStorage.getItem('indicatorsFinished');

    let number = 0;
    let indicators = '';

    for(number; number < indicatorsFinished; number++) {
        indicators += `<div class="indicator ${className}"></div>`;
    }

    for(number; number < numberOfSessions; number++) {
        indicators += '<div class="indicator"></div>';
    }

    document.querySelector("#sessionIndicator").innerHTML = indicators
}

function redirectToHome() {
    window.location.href='index.html';
}

function playPomodoro() {
    let breakWork = sessionStorage.getItem('breakWork');
    let indicatorsFinished = sessionStorage.getItem('indicatorsFinished');

    if (!breakWork) {
        sessionStorage.setItem('indicatorsFinished', ++indicatorsFinished);
    }

    generateIndicatorsSessions('indicator-work');

    setPauseButton();

    let time = getFirstTime();
    let formattedTime;

    let idTimer = setInterval(() => {
        formattedTime = formatLeftZero(time.getMinutes()) + ':' + formatLeftZero(time.getSeconds());
        setWorkTimeInScreen(formattedTime);

        time = new Date(time.getTime() - 1000);
        sessionStorage.setItem('lastTimer', time)

        if(formattedTime === '00:00') {
            clearInterval(idTimer);
            setWorkTimeInScreen(formattedTime);

            endWork();
        }
    }, 1000)

    sessionStorage.setItem('idTimer', idTimer);
}

function endWork() {
    let numberOfSessions = sessionStorage.getItem('numberOfSessions');
    let indicatorsFinished = sessionStorage.getItem('indicatorsFinished');

    if (indicatorsFinished === numberOfSessions) {
        setRestartButton();
        return;
    }

    let breakWork = sessionStorage.getItem('breakWork');
    let watchAlert = document.querySelector("#watchAlert");
    let task = document.querySelector("#task");

    if (!breakWork) {
        watchAlert.classList.remove('work');
        watchAlert.classList.add('break');
    
        task.innerHTML = 'Pausa'
        task.classList.remove('task-work')
        task.classList.add('task-break')
    
        sessionStorage.setItem('breakWork', 1);
        sessionStorage.removeItem('lastTimer');

        generateIndicatorsSessions('indicator-break');

        playPomodoro();
        return;
    }

    watchAlert.classList.remove('break');
    watchAlert.classList.add('work');

    task.innerHTML = 'Trabalho'
    task.classList.remove('task-break');
    task.classList.add('task-work');

    sessionStorage.removeItem('breakWork');
    sessionStorage.removeItem('lastTimer');    

    playPomodoro();
}

function setRestartButton() {
    document.querySelector("#buttonStartPause").innerHTML = '' +
        '<button onclick="restartPomodoro()">' +
            '<i class="fa fa-history"></i>' +
        '</button>'
}

function restartPomodoro() {
    generatePomodoro();
    playPomodoro();
}

function breakPomodoro() {
    let idTimer = sessionStorage.getItem('idTimer');

    setPlayButton()

    clearInterval(idTimer);
}

function setPauseButton() {
    document.querySelector("#buttonStartPause").innerHTML = '' +
        '<button onclick="breakPomodoro()">' +
            '<i class="fa fa-pause"></i>' +
        '</button>'
}

function setPlayButton() {
    document.querySelector("#buttonStartPause").innerHTML = '' +
        '<button onclick="playPomodoro()">' +
            '<i class="fa fa-play"></i>' +
        '</button>'
}

function getFirstTime() {
    let lastTimer = sessionStorage.getItem('lastTimer');

    if(lastTimer) {
        return new Date(lastTimer);
    }

    let breakWork = sessionStorage.getItem('breakWork');

    if(breakWork) {
        let breakTime = sessionStorage.getItem('breakTime')

        let time = new Date();
        time.setMinutes(breakTime);
        time.setSeconds('00');

        return time;
    }

    let workingTime = sessionStorage.getItem('workingTime');

    let time = new Date();
    time.setMinutes(workingTime);
    time.setSeconds('00');

    return time;
}

function formatLeftZero(int) {
    return ("00" + int).slice(-2);
}