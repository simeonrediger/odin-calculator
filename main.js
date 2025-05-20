const state = {

    reset() {
        // 'state' referenced explicitly to avoid incorrect 'this' binding
        state.leftOperand = '0';
        state.operator = null;
        state.rightOperand = null;
        state.result = null;
        state.shouldOverwriteDisplay = false;
    },
};

state.reset();
displayCurrentTime();
document.querySelector('#buttons').addEventListener('click', handleButtonClick);

function displayCurrentTime() {
    const timeDisplay = document.querySelector('#time');
    timeDisplay.textContent = new Date()
    .toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
    .replace(/\s+(AM|PM)/, '')    // Remove meridiem indicator
    .replace(/0(?=[0-9]:)/, '');  // Remove left-padding 0 from hour
}

function handleButtonClick(event) {
    if (event.target.tagName !== 'BUTTON') {
        return;
    }

    const buttonId = event.target.id;

    switch (buttonId) {
        case 'clear-all':
            // TODO
            break;

        case 'backspace':
            // TODO
            break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'raise':
            // TODO
            break;

        case 'evaluate':
            // TODO
            break;

        case 'decimal-separator':
            // TODO
            break;

        default:  // Digit buttons
            handleDigitClick(buttonId);
    }

    updateDisplay();
}

function updateDisplay() {
    let operation = state.leftOperand;

    if (state.operator) {
        operation += state.operator;
    }

    if (state.rightOperand) {
        operation += state.rightOperand;
    }

    document.getElementById('current-operation').textContent = operation;
}

function handleDigitClick(buttonId) {
    const digit = String(buttonId);

    if (shouldConcatenateLeftOperand()) {
        state.leftOperand += digit;
    }  else {
        state.rightOperand = state.rightOperand ?? '';
        state.rightOperand += digit;
    }
}

function shouldConcatenateLeftOperand() {
    return state.operator === null;
}
