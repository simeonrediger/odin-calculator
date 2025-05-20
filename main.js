const state = {

    reset() {
        // 'state' referenced explicitly to avoid incorrect 'this' binding
        state.leftOperand = '0';
        state.operator = null;
        state.rightOperand = null;
        state.result = null;
        state.lastAction = null;
    },
};

state.reset();
updateDisplay();
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
            handleOperatorClick(buttonId);
            break;

        case 'evaluate':
            // TODO
            break;

        case 'decimal-separator':
            handleDecimalSeparatorClick();
            break;

        case 'negate':
            handleNegateClick();
            break;

        default:  // Digit buttons
            handleDigitClick(buttonId);
    }

    updateDisplay();
}

function updateDisplay() {
    let operation = formatOperand(state.leftOperand);

    if (state.operator) {
        const operatorSymbol = (
            document.getElementById(state.operator).textContent
        );

        operation += operatorSymbol;
    }

    if (state.rightOperand) {
        operation += formatOperand(state.rightOperand);
    }

    document.getElementById('current-operation').textContent = operation;
}

function handleDigitClick(buttonId) {
    const digit = String(buttonId);

    if (shouldConcatenateLeftOperand()) {
        state.leftOperand += digit;
        state.lastAction = 'updateLeftOperand';
    }  else {

        if (rightOperandIsNegative()) {
            state.rightOperand = (
                state.rightOperand.slice(0, -1) +
                digit +
                state.rightOperand.slice(-1)
            );
        } else {
            state.rightOperand = (state.rightOperand ?? '') + digit;
        }

        state.lastAction = 'updateRightOperand';
    }
}

function handleDecimalSeparatorClick() {

    if (shouldConcatenateLeftOperand()) {

        if (!state.leftOperand.includes('.')) {
            state.leftOperand += '.';
            state.lastAction = 'updateLeftOperand';
        }

    } else {

        if (!state.rightOperand.includes('.')) {

            if (rightOperandIsNegative()) {
                state.rightOperand = (
                    state.rightOperand.slice(0, -1) +
                    '.' +
                    state.rightOperand.slice(-1)
                );
            } else {
                state.rightOperand += '.';
            }

            state.lastAction = 'updateRightOperand';
        }
    }
}

function handleNegateClick() {

    if (shouldConcatenateLeftOperand()) {

        if (state.leftOperand.startsWith('-')) {
            state.leftOperand = state.leftOperand.slice(1);
        } else {
            state.leftOperand = `-${state.leftOperand}`;
        }

        state.lastAction = 'updateLeftOperand';

    } else {

        if (rightOperandIsNegative()) {
            state.rightOperand = state.rightOperand.slice(2, -1);
        } else {
            state.rightOperand = `(-${state.rightOperand})`;
        }

        state.lastAction = 'updateRightOperand';
    }
}

function handleOperatorClick(buttonId) {
    state.operator = buttonId;
    state.lastAction = 'updateOperator';
}

function shouldConcatenateLeftOperand() {
    return state.operator === null;
}

function rightOperandIsNegative() {
    return state.rightOperand?.startsWith('-');
}

function formatOperand(operand) {
    const endsWithDecimalSeparator = operand.endsWith('.');

    operand = unformatOperand(operand);
    operand = String(operand);
    operand = addCommaSeparators(operand);

    if (endsWithDecimalSeparator) {
        operand += '.';
    }

    return operand;
}

function unformatOperand(operand) {
    // Removes leading zeros (via coercion), commas, and parentheses
    return +operand.replaceAll(',|\(|\)', '');
}

function addCommaSeparators(operand) {
    let [integerPart, decimalPart] = operand.split('.');

    integerPart = Array.from(integerPart).reduceRight(
        (commaSeparatedInteger, digit, i) => {

            if (
                integerPart.length > 3 &&
                integerPart.length - i > 3 &&
                (integerPart.length - i) % 3 === 1
            ) {
                commaSeparatedInteger = `${digit},` + commaSeparatedInteger;
            } else {
                commaSeparatedInteger = digit + commaSeparatedInteger;
            }

            return commaSeparatedInteger;
        },
        ''
    );

    if (operand.includes('.')) {
        return integerPart + '.' + (decimalPart ?? '');
    } else {
        return integerPart;
    }
}
