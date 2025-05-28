export default class Calculator {
    #leftOperand = null;
    #operator = null;
    #rightOperand = null;
    #state = {
        lastAction: null,
        precedingToken: 'leftOperand',
    };

    constructor(leftOperand, operator, rightOperand) {
        this.#leftOperand = leftOperand;
        this.#operator = operator;
        this.#rightOperand = rightOperand;
        this.reset();
        this.updateDisplay();
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

        this.updateDisplay();
    }

    updateDisplay() {
        const operationDisplay = document.getElementById('current-operation');
        operationDisplay.textContent = this.displayValue;
    }

    get displayValue() {
        return (
            this.#leftOperand.displayValue +
            this.#operator.displayValue +
            this.#rightOperand.displayValue
        );
    }

    reset() {  // Maybe make value update methods consistent, consider types
        this.#leftOperand.setValue(0);
        this.#operator.id = null;
        this.#rightOperand.setValue(null);
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

        this.reset();
        this.#leftOperand.setValue(result);

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

        if (this.#state.lastAction === 'evaluate') {
            this.reset();
        }

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.negate();
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
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

    handleKeyDown() {
    }
}
