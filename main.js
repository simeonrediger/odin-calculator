displayCurrentTime();
document.querySelector('#buttons').addEventListener('click', handleButtonClick);

let currentOperation = '0';
displayCurrentOperation();

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
        default:  // Case for nonzero numbers
            input(event.target.id);
    }
}

function displayCurrentOperation() {
    document.querySelector('#current-operation').textContent = currentOperation;
}

function input(string) {
    currentOperation = format(currentOperation + string);
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
        (stringWithCommas, digit, i) => {

            if (
                integerPart.length > 3 &&
                integerPart.length - i > 3 &&
                (integerPart.length - i) % 3 === 1
            ) {
                stringWithCommas = `${digit},` + stringWithCommas;
            } else {
                stringWithCommas = digit + stringWithCommas;
            }

            return stringWithCommas;
        },
        ''
    );

    return integerPart + (decimalPart ?? '');
}
