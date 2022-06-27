import { dictionary } from './dictionary.js';

const re = /[а-яёїієґ]/;
let currentRow = 1;
let currentRowElement = document.querySelector('#row' + currentRow);
let answerWord = '';
const resetBtn = document.querySelector('#reset');
const checkBtn = document.querySelector('#check');

const setWord = () => {
    let chosenNum = Math.floor(Math.random() * (dictionary.length - 1)) + 1;
    answerWord = dictionary[chosenNum];
}

setWord();
console.log(answerWord)
document.addEventListener('keydown', (e) => {
    let pressedLetter = e.key;
    if (currentRow <= 6) {
        if (pressedLetter.length === 1 && currentRowElement.dataset.letters.length < 5 && re.test(pressedLetter)) {
            updateLetters(pressedLetter);
            if (currentRowElement.dataset.letters.length > 4) {
                checkBtn.removeAttribute('disabled');
            }
        } else if (e.key === 'Backspace' && currentRowElement.dataset.letters !== '') {
            letterDelete();
            checkBtn.setAttribute('disabled', 'true');
        } else if (e.key === 'Enter' && currentRowElement.dataset.letters.length === 5) {
            submitRow();
        } 
    } 
    
});

const updateLetters = (letter) => {
    let currentWord = currentRowElement.dataset.letters;
    let newWord = currentWord + letter;
    let currentSquare = newWord.length;
    currentRowElement.dataset.letters = newWord;
    updateSquares(currentSquare, letter);
}

const updateSquares = (squareNumber, letter) => {
    let currenTile = document.querySelector('#square' + squareNumber + 'row' + currentRow);
    currenTile.innerText = letter;
}

const letterDelete = () => {
    let currentWord = currentRowElement.dataset.letters;
    let newWord = currentWord.slice(0, -1);
    currentRowElement.dataset.letters = newWord;
    squareDelete(currentWord.length);
}

const squareDelete = (squareNumber) => {
    document.querySelector('#square' + squareNumber + 'row' + currentRow).innerText = '';
}

const checkLetter = (position) => {
    let usersLetter = currentRowElement.dataset.letters.charAt(position);
    let answerLetter = answerWord.charAt(position);
    if(usersLetter === answerLetter) {
        return 'correct';
    } else {
        return checkIfLetterExists(usersLetter) ? 'present' : 'absent';
    }
}

const checkIfLetterExists = (letter) => {
    return answerWord.includes(letter);
}

const setSquareBackground = (i, status) => {
    let squareNum = i + 1;
    let square = document.querySelector('#square' + squareNum + 'row' + currentRow);
    if (status === 'correct') {
        square.classList.add('right');
    } else if (status === 'present') {
        square.classList.add('includes');
    } else if (status === 'absent') {
        square.classList.add('wrong');
    }
    checkIfGuessComplete(i);
}

const submitRow = () => {
    checkBtn.setAttribute('disabled', 'true');
    for (let i = 0; i < 5; i++) {
        setSquareBackground(i, checkLetter(i));
    }
}

const checkIfGuessComplete = (i) => {
    if (i === 4) {
        if (!dictionary.includes(currentRowElement.dataset.letters)) {
            alert('Not in word list');
            for (let i = currentRow; i < 7; i++) {
                let row = document.querySelector('#row' + i);
                row.dataset.letters = '';
                for (let j = 1; j < 6; j++) {
                    let square = document.querySelector('#square' + j + 'row' + i);
                    square.innerText = '';
                    square.classList.remove('right');
                    square.classList.remove('includes');
                    square.classList.remove('wrong');
                }
            }
        } else {
            checkWin();
        }
    }
}

const checkWin = () => {
    if (answerWord === currentRowElement.dataset.letters) {
        alert('Congratulations! You won.')
    } else {
        currentRow += 1;
        currentRowElement = document.querySelector('#row' + currentRow);
        if (currentRow === 7) {
            alert('Game over.')
        }
    }
}

const resetRows = () => {
    for (let i = 1; i < 7; i++) {
        let row = document.querySelector('#row' + i);
        row.dataset.letters = '';
        for (let j = 1; j < 6; j++) {
            let square = document.querySelector('#square' + j + 'row' + i);
            square.innerText = '';
            square.classList.remove('right');
            square.classList.remove('includes');
            square.classList.remove('wrong');
        }
    }
    currentRow = 1; 
    currentRowElement = document.querySelector('#row' + currentRow);
    setWord();
    checkBtn.setAttribute('disabled', 'true');
    console.log(answerWord);
}

resetBtn.addEventListener('click', resetRows);

checkBtn.addEventListener('click', submitRow);
