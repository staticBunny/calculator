'use strict';

const MAX_INPUT_LENGTH = 20;
const TEST_ARRRAY = ['-', '9', '*', '10', '+', '11', '/', '13', '%', '-', '5'];

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const percent = (a, b=100) => a / b;

const LOW_PRECEDENCE = [add, subtract];
const HIGH_PRECEDENCE = [multiply, divide];

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

const canPutNumber = (string) => {
    if (string.slice(-2, -1) == '%') return false;
    if (string.split(' ').at(-1).length == MAX_INPUT_LENGTH) return false;
    return true;
}

const removeEmptyChar = (arr) => {
    return arr.reduce((accum, current) => {
        if (current == '') return accum;
        return accum.concat([current]);
    }, []);
}

const prependZeroIfRequired = (arr) => {
    if (isOperator(arr[0])) return ['0'].concat(arr);
    return arr;
}

const addNumAfterPercent = (arr) => {
    return arr.reduce((previousChars, currentChar) => {
        if (currentChar == '%') {
            return previousChars.concat([currentChar, '100']);
        }
        return previousChars.concat(currentChar);
    }, []);
}

const switchToOperationNames = (arr) => {
    return arr.map(char => {
        if (char == '+') return add;
        if (char == '*') return multiply;
        if (char == '/') return divide;
        if (char == '-') return subtract;
        if (char == '%') return percent;
        return char;
    })
}

const hasHigherPrecedence = (operator1, operator2) => {
    if (LOW_PRECEDENCE.includes(operator1) && 
    LOW_PRECEDENCE.includes(operator2)) return true;

    if (HIGH_PRECEDENCE.includes(operator1) &&
    (HIGH_PRECEDENCE.includes(operator2)) ||
    LOW_PRECEDENCE.includes(operator2)) return true;

    if (operator1 == percent) return true;

    return false;
}

const convertToNum = arr => {
    return arr.map(char => isNumber(char) ? +char : char);
}

const doOneOperation = (mainArr, collector = []) => {
    if (mainArr.length == 3) {
        return collector.concat(
            [operate(mainArr[1], mainArr[0], mainArr[2])]
            );
    }
    if (hasHigherPrecedence(mainArr[1], mainArr[3])) {
        return collector.concat(
            [operate(mainArr[1], mainArr[0], mainArr[2])].concat(
                mainArr.slice(3)
            )
        );
    }
    return doOneOperation(mainArr.slice(2), collector.concat(
        mainArr.slice(0,2)
    ));
}

const repeatFunction = (f, arr) => {
    if (arr.length == 1) return arr[0];
    return repeatFunction(f, f(arr));
}

const computeFinalOutput = arr => {
    return repeatFunction(doOneOperation, 
        convertToNum(
            switchToOperationNames(
                addNumAfterPercent(
                    prependZeroIfRequired(arr)
                )
            )
        ));
}


const inputDiv = document.querySelector('#input');
const outputDiv = document.querySelector('#output');

const BUTTONS = document.querySelectorAll('button');

function putDecimal() {
    const arr = getArrayFromInput();
    if (arr.length == 0) {
        inputDiv.textContent = '0.';
        return;
    }
    const last = arr[arr.length-1];
    if (isOperator(last)) return;
    if (last.includes('.')) return;
    inputDiv.textContent += '.';
}

function showInput(e) {
    let char;
    if (this.document) char = e.key;
    else char = this.id;

    if (isNumber(char)) {
        if (canPutNumber(inputDiv.textContent)){
            inputDiv.textContent += char;
        }    
    }
    if (isOperator(char)) {
        if (canPutOperator(inputDiv.textContent, char)) {
            inputDiv.textContent += ` ${char} `;
        }
    }
    if (char == '.') {
        putDecimal();
    }
}

function showOutput(e) {
    if (this.document) {
        if (e.keyCode != 13 && e.key != '=') return;
    }
    else {
        if (this.id != '=') return;
    }

    const arr = parseInput();
    if (arr == []) {
        outputDiv.textContent = '0';
        return;
    }

    outputDiv.textContent = computeFinalOutput(arr);
}

function checkForEvents() {
    window.addEventListener('keydown', showInput);
    BUTTONS.forEach(button => button.addEventListener('click', showInput));

    window.addEventListener('keydown', showOutput);
    BUTTONS.forEach(button => button.addEventListener('click', showOutput));

    window.addEventListener('keydown', clearScreen);
    BUTTONS.forEach(button => button.addEventListener('click', clearScreen));
}

function clearScreen(e) {
    let option;
    if (this.document) {
        if (e.keyCode == 8) option = 'c';
        else if (e.keyCode == 27) option = 'ac';
        else return;
    }
    else {
        if (this.id != 'ac' && this.id != 'c') return;
        option = this.id;
    }
    console.log('works');

    if (option == 'c') {
        clearLastElement();
    }

    if (option == 'ac') {
        inputDiv.textContent = '';
        outputDiv.textContent = 0;
    }
}

function getArrayFromInput() {
    let arr = inputDiv.textContent.split(' ');
    arr = removeEmptyChar(arr);
    return arr;
}

function clearLastElement() {
    let arr = getArrayFromInput();
    arr.pop();
    if (isOperator(arr[arr.length-1])) {
        inputDiv.textContent = `${arr.join(' ')} `;
    }
    else inputDiv.textContent = arr.join(' ');
}

function parseInput() {
    let arr = getArrayFromInput();
    
    if (arr == []) return arr;
    const last = arr[arr.length-1];

    if (isOperator(last) && last != '%') return arr.slice(0, -1);
    return arr;
}

checkForEvents();

let arr = prependZeroIfRequired(TEST_ARRRAY);
arr = addNumAfterPercent(arr);
arr = switchToOperationNames(arr);
arr = convertToNum(arr);