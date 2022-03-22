const answersDictionary = require('./database/answers.json');

const diffTime = Math.abs(new Date() - new Date('2021/6/19'));
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
let solution = answersDictionary[diffDays%(answersDictionary.length)];

console.log(solution);