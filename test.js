const wordsDictionary = require('./database/words.json');

currWord = 'abuna'.split('')
if(wordsDictionary[currWord.join('').toLowerCase()] == undefined) {
    console.log(`Word ${currWord.join('').toLowerCase()} not in dictionary`);
}