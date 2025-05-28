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
                this.handleOperatorClick(buttonId);
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
                this.handleDigitClick(buttonId);
                break;
        }

        this.updateDisplay();
    }

    get displayValue() {
        return (
            this.#leftOperand.displayValue +
            this.#operator.displayValue +
            this.#rightOperand.displayValue
        );
    }

    reset() {
        this.#leftOperand = '0';
        this.#operator = null;
        this.#rightOperand = null;
        this.#state = {
            lastAction: null,
            precedingToken: 'leftOperand',
        };
    }

    evaluate() {
        const result = this.#operator.operate(
            this.#leftOperand.numberValue,
            this.#rightOperand.numberValue,
        );

        this.reset();
        this.#leftOperand.update(String(+result));  // Fix/implement
    }

    appendCurrentOperand(character) {

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand += character;
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
                this.#rightOperand += character;
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'operator';
                break;

            case 'rightOperand':
                this.#rightOperand += character;
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;
        }
    }

    updateOperator(operatorId) {
        this.#operator.id = operatorId;
    }

    deleteLastCharacter() {

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

    negateCurrentOperand() {

        switch (this.#state.precedingToken) {

            case 'leftOperand':
                this.#leftOperand.negate();
                this.#state.lastAction = 'updateLeftOperand';
                this.#state.precedingToken = 'leftOperand';
                break;

            case 'operator':
                this.#rightOperand.negate();
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;

            case 'rightOperand':
                this.#rightOperand.negate();
                this.#state.lastAction = 'updateRightOperand';
                this.#state.precedingToken = 'rightOperand';
                break;
        }
    }

    handleDigitClick(digit) {
        this.operation.append(digit);
    }

    handleNegateClick() {
        this.operation.negateCurrentOperand();
    }

    handleDecimalSeparatorClick() {
        this.operation.append('.');
    }

    handleOperatorClick(operatorId) {
    }

    handleBackspaceClick() {
    }

    handleClearAllClick() {
    }

    handleEvaluateClick() {
    }

    handleKeyDown() {
    }
}
