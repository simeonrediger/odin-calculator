import Clock from './clock.js';
import Calculator from './calculator.js';
import Operand from './operand.js';
import Operator from './operator.js';

const clock = new Clock();
clock.displayCurrentTime();

const leftOperand = new Operand();
const operator = new Operator();
const rightOperand = new Operand(false);
const calculator = new Calculator(leftOperand, operator, rightOperand);

const buttons = document.querySelector('#buttons');
buttons.addEventListener('click', calculator.handleClick.bind(calculator));
