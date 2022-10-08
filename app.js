'use strict';

const MAX_INPUT_LENGTH = 20;

/* Pure functions */

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operate = (operator, a, b) => operator(a, b);

const isNumber = char => (char >= '0') && (char <= '9') ? true : false;
const isOperator = char => {
    if (char == '/' || char == '*' || char == '+' || char == '-' || char == '%'){
        return true;
    } 
    return false;
}

const canPutOperator = (string, operator) => {
    if (isNumber(string.slice(-1)) || string.slice(-2, -1) == '%') return true;
    if (string == '' && (operator == '+' || operator == '-')) return true;
    return false;
}

const canPutNumber = (string, num) => {
    if (string.slice(-2, -1) == '%') return false;
    if (string.split(' ').at(-1).length == MAX_INPUT_LENGTH) return false;
    return true;
}

/* --- */


const inputDiv = document.querySelector('#input');
const outputDiv = document.querySelector('#output');

const BUTTONS = document.querySelectorAll('button');

function showInput(e) {
    let char;
    if (this.document) char = e.key;
    else char = this.id;

    if (isNumber(char)) {
        if (canPutNumber(inputDiv.textContent, char)){
            inputDiv.textContent += char;
        }    
    }
    if (isOperator(char)) {
        if (canPutOperator(inputDiv.textContent, char)) {
            inputDiv.textContent += ` ${char} `;
        }
    }
}

function checkForEvents() {
    window.addEventListener('keydown', showInput);
    BUTTONS.forEach(button => button.addEventListener('click', showInput));
}

function clearInput() {
    inputDiv.textContent = '';
}

clearInput();
checkForEvents();