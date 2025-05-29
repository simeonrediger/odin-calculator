export default class Operator {
    #validIds = ['add', 'subtract', 'multiply', 'divide', 'raise'];
    #id = null;

    // Public API
    reset() {
        this.id = null;
    }

    set id(value) {

        if (!this.#validIds.includes(value) && value !== null) {
            throw new Error(`Invalid ID: ${value}`);
        }

        this.#id = value;
    }

    get displayValue() {

        if (this.#id === null) {
            return '';
        }

        return document.getElementById(this.#id).textContent;
    }

    delete(value) {
        this.id = null;
    }

    operate(leftOperand, rightOperand) {

        switch (this.#id) {

            case 'add':
                return leftOperand + rightOperand;

            case 'subtract':
                return leftOperand - rightOperand;

            case 'multiply':
                return leftOperand * rightOperand;

            case 'divide':
                return leftOperand / rightOperand;

            case 'raise':
                return leftOperand ** rightOperand;
        }
    }
}
