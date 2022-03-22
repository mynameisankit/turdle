const React = require('react');
const { useState } = require('react');
const { Text, Box, Spacer, Newline, useInput } = require('ink');
const wordsDictionary = require('../database/words.json');
const answersDictionary = require('../database/answers.json');

function Game(props) {
    const diffTime = Math.abs(new Date() - new Date('2021/6/19'));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    const solution = answersDictionary[diffDays % (answersDictionary.length)].toUpperCase().split('');

    const [currRow, setRow] = useState(0);
    const [currCol, setCol] = useState(-1);
    const [attempts, setAttempts] = useState(new Array(6).fill(0).map(() => new Array(5).fill(null)));
    const [error, setError] = useState(' ');
    const [found, setFound] = useState(false);
    const [turd, setTurd] = useState(false);

    useInput((input, key) => {
        if(found || turd)
            return;

        let newCol = currCol;

        if (key.return) {
            if (currCol != 4) {
                setError('Not enough letters');
                return;
            }

            let currWord = attempts[currRow];

            //Check if word is in dictionary
            const word = currWord.map(chObj => chObj.val).join('').toLowerCase();
            if (wordsDictionary[word] == undefined) {
                setError(`Word ${word.toUpperCase()} not in dictionary`);
                return;
            }

            let numCorrect = 0;
            for (let i = 0; i < currWord.length; i++) {
                const chObj = currWord[i];
                const ch = chObj.val;

                if (solution.includes(ch))
                    chObj.exists = true;

                if (solution[i] === ch) {
                    chObj.correct = true;
                    numCorrect++;
                }
            }

            setFound(numCorrect === 5);
            setAttempts(attempts);
            setRow(currRow + 1);
            setCol(-1);
            
            if(currRow == 5)
                setTurd(true);
        }
        else if (input === ' ' || key.tab)
            return;
        else {
            setError(` `);

            if (key.backspace || key.delete) {
                if (newCol != -1)
                    attempts[currRow][newCol] = null;

                if (currCol != -1)
                    newCol -= 1;
            }
            else if (/[a-zA-Z]/.test(input)) {
                if (currCol != 4)
                    newCol += 1;

                attempts[currRow][newCol] = {
                    val: input.toUpperCase(),
                    correct: false,
                    exists: false
                }
            }

            setCol(newCol);
            setAttempts(attempts);
        }
    });

    return (
        <Box flexDirection='column' alignItems='center'>
            <Box justifyContent='center' alignItems='center'>
                <Text color='#F85A3E'>{error}</Text>
            </Box>
            <Box flexDirection='column' alignItems='center'>
                {attempts.map((row, row_idx) => (
                    <Box key={row_idx}>
                        {
                            row.map((col, col_idx) => {
                                let textColor;

                                if (col === null)
                                    textColor = 'white';
                                else if (col.correct)
                                    textColor = 'green';
                                else if (col.exists)
                                    textColor = 'yellow';
                                else if (row_idx < currRow)
                                    textColor = 'grey';
                                else
                                    textColor = 'white';

                                return (
                                    <Box
                                        height={3}
                                        width={6}
                                        key={col_idx}
                                        borderStyle='single'
                                        borderColor={textColor}
                                        alignItems='center'
                                        justifyContent='center'
                                    >
                                        <Text
                                            bold={col && col.exists && col.correct}
                                            color={textColor}
                                        >
                                            {col === null ? ' ' : col.val}
                                        </Text>
                                    </Box>
                                );
                            })
                        }
                    </Box>
                ))}
            </Box>
            <Newline />
            <Box flexDirection='column' justifyContent='center' alignItems='center'>
                <Text bold color='#EEF1BD'>{found && currRow == 1 && 'Genius!'}</Text>
                <Text bold color='#EEF1BD'>{turd && `You are ${found ? 'still ' : ''}a turd!`}</Text>
                <Text bold color='#EEF1BD'>{turd && !found && `The correct answer is ${solution.join('')}`}</Text>
                <Text bold color='#EEF1BD'>
                    {found ? `You have found the answer ${solution.join('')} in ${currRow}/6 attempts` : ' '}
                </Text>
                <Spacer />
            </Box>
            <Newline />
        </Box>
    );
}

module.exports = Game;