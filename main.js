const state = {

    reset() {
        // 'state' referenced explicitly to avoid incorrect 'this' binding
        state.leftOperand = '0';
        state.operator = null;
        state.rightOperand = null;
        state.result = null;
        state.precedingToken = null;
        state.lastAction = 'updateLeftOperand';
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
            state.reset();
            break;

        case 'backspace':
            handleBackspaceClick();
            break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'raise':
            handleOperatorClick(buttonId);
            break;

        case 'evaluate':
            handleEvaluateClick();
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
    console.debug(state);
    let operation = formatOperand(state.leftOperand);

    if (state.operator) {
        const operatorSymbol = (
            document.getElementById(state.operator).textContent
        );

        operation += operatorSymbol;
    }

    if (state.rightOperand) {
        operation += formatOperand(state.rightOperand, true);
    }

    document.getElementById('current-operation').textContent = operation;
}

function handleDigitClick(buttonId) {

    if (state.lastAction === 'evaluate') {
        state.reset();
    }

    const digit = String(buttonId);

    if (shouldConcatenateLeftOperand()) {
        state.leftOperand += digit;
        state.precedingToken = 'leftOperand';
        state.lastAction = 'updateLeftOperand';

    }  else {

        if (operandIsNegative(state.rightOperand)) {
            state.rightOperand = (
                state.rightOperand.slice(0, -1) +
                digit +
                state.rightOperand.slice(-1)
            );
        } else {
            state.rightOperand = (state.rightOperand ?? '') + digit;
        }

        state.precedingToken = 'rightOperand';
        state.lastAction = 'updateRightOperand';
    }
}

function handleDecimalSeparatorClick() {

    if (state.lastAction === 'evaluate') {
        state.reset();
    }

    if (shouldConcatenateLeftOperand()) {

        if (!state.leftOperand.includes('.')) {
            state.leftOperand += '.';
            state.precedingToken = 'leftOperand';
            state.lastAction = 'updateLeftOperand';
        }

    } else {

        if (!state.rightOperand.includes('.')) {

            if (operandIsNegative(state.rightOperand)) {
                state.rightOperand = (
                    state.rightOperand.slice(0, -1) +
                    '.' +
                    state.rightOperand.slice(-1)
                );
            } else {
                state.rightOperand += '.';
            }

            state.precedingToken = 'rightOperand';
            state.lastAction = 'updateRightOperand';
        }
    }
}

function handleNegateClick() {

    if (state.lastAction === 'evaluate') {
        state.reset();
    }

    if (shouldConcatenateLeftOperand()) {

        if (operandIsNegative(state.leftOperand)) {
            state.leftOperand = state.leftOperand.slice(1);
        } else {
            state.leftOperand = `-${state.leftOperand}`;
        }

        if (state.leftOperand) {
            state.precedingToken = 'leftOperand';
        } else {
            state.precedingToken = null;
        }

        state.lastAction = 'updateLeftOperand';

    } else {

        if (operandIsNegative(state.rightOperand)) {
            // state.rightOperand = state.rightOperand.slice(2, -1);
            state.rightOperand = state.rightOperand.slice(1);
        } else {
            // state.rightOperand = `(-${state.rightOperand})`;
            state.rightOperand = `-${state.rightOperand}`;
        }

        if (state.rightOperand) {
            state.precedingToken = 'rightOperand';
        } else {
            state.precedingToken = 'operator';
        }

        state.lastAction = 'updateRightOperand';
    }
}

function handleOperatorClick(buttonId) {

    if (state.lastAction === 'updateRightOperand') {
        evaluate();
    }

    state.operator = buttonId;
    state.precedingToken = 'operator';
    state.lastAction = 'updateOperator';
}

function handleEvaluateClick() {
    evaluate();
}

function evaluate() {

    if (!state.rightOperand) {
        return;
    }

    const leftOperand = +state.leftOperand;
    const rightOperand = +state.rightOperand;

    switch (state.operator) {

        case 'add':
            state.result = leftOperand + rightOperand;
            break;

        case 'subtract':
            state.result = leftOperand - rightOperand;
            break;

        case 'multiply':
            state.result = leftOperand * rightOperand;
            break;

        case 'divide':
            state.result = leftOperand / rightOperand;
            break;

        case 'raise':
            state.result = leftOperand ** rightOperand;
    }

    state.leftOperand = state.result;
    state.operator = null;
    state.rightOperand = null;
    state.precedingToken = 'leftOperand';
    state.lastAction = 'evaluate';
}

function handleBackspaceClick() {

    if (state.lastAction === 'evaluate') {
        state.reset();
        return;
    }

    switch (state.precedingToken) {

        case 'leftOperand':

            if (state.leftOperand === '0') {
                return;
            }

            state.leftOperand = state.leftOperand.slice(0, -1);

            if (!state.leftOperand) {
                state.precedingToken = null;
            }

            state.lastAction = 'updateLeftOperand';
            break;

        case 'operator':
            state.operator = null;
            state.precedingToken = 'leftOperand';
            state.lastAction = 'updateOperator';
            break;

        case 'rightOperand':
            state.rightOperand = state.rightOperand.slice(0, -1);

            if (!state.rightOperand) {
                state.precedingToken = 'operator';
            }

            state.lastAction = 'updateRightOperand';
            break;

        case 'evaluate':
            state.reset();
    }
}

function shouldConcatenateLeftOperand() {
    return state.operator === null;
}

function operandIsNegative(operand) {
    return operand?.startsWith('-');
}

function formatOperand(operand, isRightOperand = false) {
    operand = String(operand);
    const isNegative = operandIsNegative(operand);
    const isZero = +operand === 0;
    const endsWithDecimalSeparator = operand.endsWith('.');

    operand = unformatOperand(operand);
    operand = addCommaSeparators(operand);

    if (isNegative && isZero) {
        operand = '-' + operand;
    }

    if (endsWithDecimalSeparator) {
        operand += '.';
    }

    if (isRightOperand && isNegative) {
        operand = `(${operand})`;
    }

    return operand;
}

function unformatOperand(operand) {
    // Removes leading zeros (via coercion), commas, and parentheses
    console.log(operand
        .replaceAll(',', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
    );
    return String(+operand
        .replaceAll(',', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
    );
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
