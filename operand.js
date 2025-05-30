export default class Operand {
    isEvaluationResult = false;

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
        this.isEvaluationResult = false;
    }

    get displayValue() {
        let value = this.absoluteValue;

        if (value === null) {
            return '';
        }

        if (this.isLeftOperand && this.isEvaluationResult) {
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

    setValue(value) {

        if (typeof value !== 'number' && value !== null) {
            throw new TypeError(`Expected number. Got ${typeof value}`);
        }

        if (value === null) {
            this.absoluteValue = value;
        } else {
            this.isNegative = value < 0;
            this.absoluteValue = String(Math.abs(value));
        }
    }

    append(value) {
        const isDigitOrDecimalSeparator = /^(\d|\.)$/.test(value);

        if (!isDigitOrDecimalSeparator) {
            throw new Error(
                `Expected digit or decimal separator. Got '${value}'.`
            );
        }

        if (value === '.' && this.absoluteValue?.includes('.')) {
            return;
        }

        this.absoluteValue = (this.absoluteValue ?? '') + value;
    }

    negate() {
        this.isNegative = !this.isNegative;
    }

    deleteLastCharacter() {

        if (this.absoluteValue.length > 1) {
            this.absoluteValue = this.absoluteValue.slice(0, -1);

        } else if (this.absoluteValue !== '0') {
            this.absoluteValue = '0';

        } else if (this.isNegative) {
            this.negate();

        } else if (!this.isLeftOperand) {
            this.absoluteValue = null;
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

        const leadingZeros = /^0+\d/;

        if (value?.startsWith('.')) {
            value = '0' + value;  // Add units place

        } else if (leadingZeros.test(value)) {
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
        const leadingZerosBeforeDigit = /^0+(?=\d)/;
        return value.replace(leadingZerosBeforeDigit, '');
    }

    #addThousandsSeparators(value) {

        const unitsPlaceIndex = (() => {
            const decimalSeparatorIndex = value.indexOf('.');

            if (decimalSeparatorIndex === -1) {
                return value.length - 1;
            } else {
                return decimalSeparatorIndex - 1;
            }
        })();

        for (let i = unitsPlaceIndex - 3; i >= 0; i -= 3) {
            const indexToInsertCommaBefore = i + 1;

            value = (
                value.slice(0, indexToInsertCommaBefore) +
                ',' +
                value.slice(indexToInsertCommaBefore)
            );
        }

        return value;
    }

    #roundToNearestMillionth(value) {
        const million = 10 ** 6;
        const roundedValue = Math.round(value * million) / million;

        if (value.endsWith('.')) {
            return String(roundedValue) + '.';
        } else {
            return String(roundedValue);
        }
    }
}
