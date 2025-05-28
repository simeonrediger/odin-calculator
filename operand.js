export default class Operand {
    #isLeftOperand = null;
    #absoluteValue = null;
    #isNegative = false;

    // Public API
    constructor(isLeftOperand = true) {
        this.isLeftOperand = isLeftOperand;
        this.reset();
    }

    reset() {
        this.absoluteValue = this.isLeftOperand ? '0' : null;
        this.isNegative = false;
    }

    get displayValue() {
        let value = this.absoluteValue;

        if (value === null) {
            return '';
        }

        if (this.isLeftOperand) {
            value = this.#roundToNearestMillionth(value);
        }        

        value = this.#addThousandsSeparators(value);

        if (this.isNegative) {
            value = '-' + value;

            if (!this.isLeftOperand) {
                value = '(' + value + ')';
            }
        }

        return value;
    }

    get numberValue() {
        let value = +this.absoluteValue;

        if (this.isNegative) {
            value *= -1;
        }

        return value;
    }

    get isEmpty() {
        return this.absoluteValue === null;
    }

    append(character) {
        this.absoluteValue += character;
    }

    negate() {
        this.isNegative = !this.isNegative;
    }

    deleteLastCharacter(value) {

        if (value.length > 1) {
            value = value.slice(0, -1);

        } else if (value !== '0') {
            value = '0';

        } else if (this.isNegative) {
            this.negate();

        } else if (!this.isLeftOperand) {
            value = null;
        }
    }

    // Private API
    get absoluteValue() {
        return this.#absoluteValue;
    }

    set absoluteValue(value) {

        if (value !== null && typeof value !== 'string') {
            throw new TypeError(`Expected string. Got ${typeof value}.`);
        }

        if (value?.startsWith('.')) {
            value = '0' + value;  // Add units place
        } else if (value?.startsWith('00')) {
            value = this.#removeRedundantLeadingZeros(value);
        }

        this.#absoluteValue = value;
    }

    get isNegative() {
        return this.#isNegative;
    }

    set isNegative(value) {

        if (typeof value !== 'boolean') {
            throw new TypeError(`Expected boolean. Got ${typeof value}.`);
        }

        this.#isNegative = value;
    }

    get isLeftOperand() {
        return this.#isLeftOperand;
    }

    set isLeftOperand(value) {

        if (this.isLeftOperand !== null) {
            throw new Error('Property cannot be reassigned.');
        }

        if (typeof value !== 'boolean') {
            throw new TypeError(`Expected boolean. Got ${typeof value}.`);
        }

        this.#isLeftOperand = value;
    }

    #removeRedundantLeadingZeros(value) {
        // Removes each zero preceding a digit at the start of the string
        // Preserves units place
        return value.replace(/^0+(?=\d)/, '');
    }

    #addThousandsSeparators(value) {

        const unitsPlaceIndex = () => {
            const decimalSeparatorIndex = value.indexOf('.');

            if (decimalSeparatorIndex === -1) {
                return value.length - 1;
            } else {
                return decimalSeparatorIndex - 1;
            }
        };

        for (let i = unitsPlaceIndex - 3; i >= 0; i -= 3) {
            value = value.splice(i, 0, ',');
        }

        return value;
    }

    #roundToNearestMillionth(value) {
        const million = 10 ** 6;
        value = Math.round(value * million) / million;
        return String(value);
    }
}
