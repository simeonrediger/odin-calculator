export default class Operator {
    #validIds = ['add', 'subtract', 'multiply', 'divide', 'raise'];
    #id = null;
    #operate = null;

    // Public API
    reset() {
        this.id = null;
    }

    set id(value) {

        if (!this.#validIds.includes(value) && value !== null) {
            throw new Error(`Invalid ID: ${value}`);
        }

        this.#id = value;
        this.#updateOperate();
    }

    get displayValue() {

        if (this.#id === null) {
            return '';
        }

        return document.getElementById(this.#id).textContent;
    }

    get operate() {
        return this.#operate;
    }

    delete(value) {
        this.id = null;
    }

    // Private API
    #updateOperate() {

        if (this.#id === null) {
            this.#operate = null;
        }

        this.#operate = this[`#${this.#id}`];
    }

    #add(leftOperand, rightOperand) {
        return leftOperand + rightOperand;
    }

    #subtract(leftOperand, rightOperand) {
        return leftOperand - rightOperand;
    }

    #multiply(leftOperand, rightOperand) {
        return leftOperand * rightOperand;
    }

    #divide(leftOperand, rightOperand) {
        return leftOperand / rightOperand;
    }

    #raise(leftOperand, rightOperand) {
        return leftOperand ** rightOperand;
    }
}
