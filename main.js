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
document.body.addEventListener('keydown', handleKeyDown);

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

    try {
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
                break;
        }

    } catch (error) {
        return;
    }

    updateDisplay();
}

function handleKeyDown(event) {

    try {
        switch (event.key) {

            case 'c':
                if (event.ctrlKey) {
                    state.reset();
                }

                break;

            case 'Clear':
                state.reset();
                break;

            case 'Delete':
            case 'Backspace':
                handleBackspaceClick();
                break;

            case '+':
                handleOperatorClick('add');
                break;

            case '-':
                if (event.altKey) {
                    handleNegateClick();
                } else {
                    handleOperatorClick('subtract');
                }

                break;

            case '*':
                handleOperatorClick('multiply');
                break;

            case '/':
                event.preventDefault();  // Prevent quick search
                handleOperatorClick('divide');
                break;

            case '^':
                handleOperatorClick('raise');
                break;

            case '=':
            case 'Enter':
                handleEvaluateClick();
                break;

            case '.':
                handleDecimalSeparatorClick();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                handleDigitClick(event.key);
                break;

            default:
                return;
        }

    } catch (error) {
        return;
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

        if (buttonId === '0' && +state.leftOperand === 0) {
            return;
        }

        if (+state.leftOperand === 0) {

            if (operandIsNegative(state.leftOperand)) {
                state.leftOperand = `-${digit}`;
            } else {
                state.leftOperand = digit;
            }

        } else {
            state.leftOperand += digit;
        }

        state.precedingToken = 'leftOperand';
        state.lastAction = 'updateLeftOperand';

    }  else {

        if (state.rightOperand &&
            buttonId === '0' &&
            +state.rightOperand === 0) {
            return;
        }

        if (+state.rightOperand === 0) {

            if (operandIsNegative(state.rightOperand)) {
                state.rightOperand = `-${digit}`;
            } else {
                state.rightOperand = digit;
            }

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
            state.rightOperand += '.';
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
            state.rightOperand = state.rightOperand.slice(1);
        } else {

            if (state.rightOperand === null) {
                state.rightOperand = '-0';
            } else {
                state.rightOperand = `-${state.rightOperand}`;
            }
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

            if (rightOperand === 0) {
                handleDivisionByZero();
                return;
            }

            state.result = leftOperand / rightOperand;
            break;

        case 'raise':
            state.result = leftOperand ** rightOperand;
            break;
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

            if (state.leftOperand.length === 2 &&
                operandIsNegative(state.leftOperand)) {
                state.reset();
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

            if (operandIsNegative(state.rightOperand)) {

                if (+state.rightOperand === 0) {
                    state.rightOperand = '0';

                } else if (state.rightOperand.length === 2) {
                    state.rightOperand = '-0';
                }

            } else {

                if (state.rightOperand.length === 1) {
                    state.rightOperand = null;

                } else {
                    state.rightOperand = state.rightOperand.slice(0, -1);
                }
            }

            if (!state.rightOperand) {
                state.precedingToken = 'operator';
            }

            state.lastAction = 'updateRightOperand';
            break;

        case 'evaluate':
            state.reset();
            break;
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

    if (state.lastAction === 'evaluate' &&
        !isRightOperand &&
        operand.includes('.')) {

        operand = Math.round(operand * 10 ** 6) / (10 ** 6);
    }

    return operand;
}

function unformatOperand(operand) {
    // Removes leading zeros (via coercion), commas, and parentheses
    return String(+operand
        .replaceAll(',', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
    );
}

function addCommaSeparators(operand) {
    let [integerPart, decimalPart] = operand.split('.');
    const isNegative = integerPart.startsWith('-');
    integerPart = integerPart.replaceAll('-', '');

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

    if (isNegative) {
        integerPart = `-${integerPart}`;
    }

    if (operand.includes('.')) {
        return integerPart + '.' + (decimalPart ?? '');
    } else {
        return integerPart;
    }
}

function handleDivisionByZero() {
    state.reset();
    document.getElementById('current-operation').textContent = (
        'Undefined'
    );
    throw new Error('Cannot divide by 0');
}
