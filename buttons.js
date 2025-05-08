const clearAll = document.querySelector('#clear-all');
const backspace = document.querySelector('#backspace');

const raise = document.querySelector('#raise');
const divide = document.querySelector('#divide');
const multiply = document.querySelector('#multiply');
const subtract = document.querySelector('#subtract');
const add = document.querySelector('#add');
const evaluate = document.querySelector('#evaluate');

const negate = document.querySelector('#negate');
const decimal = document.querySelector('#decimal');
const numbers = document.querySelectorAll('.number');

function addEventListeners() {
    // clearAll.addEventListener('click', clearInput);
    // backspace.addEventListener('click', deleteLastInput);

    // raise.addEventListener('click', raise);
    // divide.addEventListener('click', divide);
    // multiply.addEventListener('click', multiply);
    // subtract.addEventListener('click', subtract);
    // add.addEventListener('click', add);
    // evaluate.addEventListener('click', evaluate);

    // negate.addEventListener('click', negateCurrentNumber);
    // decimal.addEventListener('click', input);

    // numbers.forEach(number => number.addEventListener('click', input));
}

export const buttons = {
    addEventListeners,
};
