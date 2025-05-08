displayCurrentTime();
document.querySelector('#buttons').addEventListener('click', handleButtonClick);
let operand1, operator, operand2, currentOperandId, currentOperation;
clearAll();

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

    switch (event.target.id) {
        case 'clear-all':
            clearAll();
            break;
        case 'backspace':
            deleteLastCharacter();
            break;
        case 'raise':
        case 'divide':
        case 'multiply':
        case 'subtract':
        case 'add':
            setOperator(event.target.id);
            break;
        case 'decimal-separator':
            inputDecimalSeparator();
            break;
        default:
            input(event.target.id);
    }
}

function displayCurrentOperation() {
    updateCurrentOperation();
    document.querySelector('#current-operation').textContent = currentOperation;
}

function clearAll() {
    operand1 = '0';
    operator = '';
    operand2 = '';
    currentOperandId = 1;
    updateCurrentOperation();
    displayCurrentOperation();
}

function updateCurrentOperation() {
    currentOperation = operand1 + operator + operand2;
}

function getCurrentOperand() {
    return currentOperandId === 1 ? operand1 : operand2;
}

function setCurrentOperand(string) {
    if (currentOperandId === 1) {
        operand1 = string;
    } else {
        operand2 = string;
    }
}

function deleteLastCharacter() {
    setCurrentOperand(
        format(currentOperation.slice(0, -1))
    );
    displayCurrentOperation();
}

function inputDecimalSeparator() {
    const currentOperand = getCurrentOperand();

    if (!currentOperand.includes('.')) {
        setCurrentOperand(currentOperand + '.');
        displayCurrentOperation();
    }
}

function input(character) {
    setCurrentOperand(
        format(currentOperation + character)
    );
    displayCurrentOperation();
}

function format(string) {
    string = string.replaceAll(',', '');
    string = String(+string);  // Remove leading 0s
    string = addCommaSeparators(string);
    return string;
}

function addCommaSeparators(string) {
    let [integerPart, decimalPart] = string.split('.');

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

    if (string.includes('.')) {
        return integerPart + '.' + (decimalPart ?? '');
    } else {
        return integerPart;
    }
}
