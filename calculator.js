export default class Calculator {
    #leftOperand = null;
    #operator = null;
    #rightOperand = null;
    #state = {
        lastAction: null,
        precedingToken: 'leftOperand',
    };

    #operationDisplay = document.getElementById('operation');
    #lastOperationDisplay = document.getElementById('last-operation');
    #maxFontSize = 64;  // px
    #minFontSize = 32;  // px

    // Public API
    constructor(leftOperand, operator, rightOperand) {
        this.#leftOperand = leftOperand;
        this.#operator = operator;
        this.#rightOperand = rightOperand;
        this.reset();
        this.displayOperation();
    }

    handleClick(event) {

        if (event.target.tagName !== 'BUTTON') {
            return;
        }

        const buttonId = event.target.id;

        switch (buttonId) {
            case 'clear-all':
                this.handleClearAllClick();
                break;

            case 'backspace':
                this.handleBackspaceClick();
                break;

            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'raise':
                const operatorId = buttonId;
                this.handleOperatorClick(operatorId);
                break;

            case 'evaluate':
                this.handleEvaluateClick();
                break;

            case 'decimal-separator':
                this.handleDecimalSeparatorClick();
                break;

            case 'negate':
                this.handleNegateClick();
                break;

            default:  // Digit buttons
                const digit = buttonId;
                this.handleDigitClick(digit);
                break;
        }

        this.displayOperation();
    }

    handleKeyDown(event) {

        switch (event.key) {

            case 'c':

                if (event.ctrlKey) {
                    this.reset();
                }

                break;

            case 'Clear':
                this.reset();
                break;

            case 'Delete':
            case 'Backspace':
                this.handleBackspaceClick();
                break;

            case '+':
                this.handleOperatorClick('add');
                break;

            case '-':

                if (event.altKey) {
                    this.handleNegateClick();
                } else {
                    this.handleOperatorClick('subtract');
                }

                break;

            case '*':
                this.handleOperatorClick('multiply');
                break;

            case '/':
                event.preventDefault();  // Prevent quick search in Firefox
                this.handleOperatorClick('divide');
                break;

            case '^':
                this.handleOperatorClick('raise');
                break;

            case '=':
            case 'Enter':
                this.handleEvaluateClick();
                break;

            case '.':
                this.handleDecimalSeparatorClick();
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
                const digit = event.key;
                this.handleDigitClick(digit);
                break;

            default:
                return;
        }

        this.displayOperation();
    }

    // Private API
    displayOperation() {
        this.#operationDisplay.textContent = this.operationText;
        this.adjustFontSizeToFit();
    }

    displayLastOperation() {
        this.#lastOperationDisplay.textContent = this.operationText;
    }

    resetLastOperation() {
        this.#lastOperationDisplay.textContent = '';
    }

    get operationText() {
        return (
            this.#leftOperand.displayValue +
            this.#operator.displayValue +
            this.#rightOperand.displayValue
        );
    }

    reset() {
        this.resetOperation();
        this.resetLastOperation();
    }

    resetOperation() {
        this.#leftOperand.reset();
        this.#operator.reset();
        this.#rightOperand.reset();
        this.#state = {
            lastAction: null,
            precedingToken: 'leftOperand',
        };
    }

    evaluate() {

        if (this.#rightOperand.absoluteValue === null) {
            return;
        }

        const result = this.#operator.operate(
            this.#leftOperand.numberValue,
            this.#rightOperand.numberValue,
        );

        this.displayLastOperation();
        this.resetOperation();
        this.#leftOperand.setValue(result);
        this.#leftOperand.isEvaluationResult = true;

        this.#state.lastAction = 'evaluate';
        this.#state.precedingToken = 'leftOperand';
    }

    handleDigitClick(digit) {

        if (this.#state.lastAction === 'evaluate') {
            this.reset();
        }

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.append(digit);
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
            case 'rightOperand':
                this.#rightOperand.append(digit);
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;
        }
    }

    handleDecimalSeparatorClick() {

        if (this.#state.lastAction === 'evaluate') {
            this.reset();
        }

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.append('.');
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
            case 'rightOperand':
                this.#rightOperand.append('.');
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;
        }
    }

    handleNegateClick() {

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.negate();
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
                this.#rightOperand.setValue(0);

            case 'rightOperand':
                this.#rightOperand.negate();
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;
        }
    }

    handleOperatorClick(operatorId) {

        if (this.#state.precedingToken === 'rightOperand') {
            this.evaluate();
        }

        this.#operator.id = operatorId;
        this.#state.lastAction = 'updateOperator';
        this.#state.precedingToken = 'operator';
    }

    handleBackspaceClick() {

        if (this.#state.lastAction === 'evaluate') {
            this.reset();
            return;
        }

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.deleteLastCharacter();
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
                this.#operator.delete();
                this.#state.lastAction = 'updateOperator';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'rightOperand':
                this.#rightOperand.deleteLastCharacter();
                this.#state.lastAction = 'updateRightOperand';

                if (this.#rightOperand.absoluteValue === null) {
                    this.#state.precedingToken = 'operator';
                } else {
                    this.#state.precedingToken = 'rightOperand';
                }

                break;
        }
    }

    handleClearAllClick() {
        this.reset();
    }

    handleEvaluateClick() {
        this.evaluate();
    }

    adjustFontSizeToFit() {
        this.#operationDisplay.style.fontSize = this.#maxFontSize + 'px';

        while (this.displayIsOverflown() && this.displayExceedsMinFontSize()) {
            const newFontSize = Math.max(
                this.#minFontSize,
                this.currentFontSize - 0.5,  // Decrement by half a pixel
            );

            this.#operationDisplay.style.fontSize = newFontSize + 'px';
        }
    }

    displayIsOverflown() {
        return (
            this.#operationDisplay.scrollWidth >
            this.#operationDisplay.clientWidth
        );
    }

    displayExceedsMinFontSize() {
        return this.currentFontSize > this.#minFontSize;
    }

    get currentFontSize() {
        return parseFloat(
            getComputedStyle(this.#operationDisplay).fontSize
        );
    }
}
