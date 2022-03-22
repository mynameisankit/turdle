const React = require('react');
const { useState } = require('react');
const { Text, Box, useInput } = require('ink');
const wordsDictionary = require('../database/words.json');

function Game(props) {
    let solution = 'their'.toUpperCase();
    let solarr = solution.split('');

    const [currRow, setRow] = useState(0);
    const [currCol, setCol] = useState(-1);
    const [attempts, setAttempts] = useState(new Array(6).fill(0).map(() => new Array(5).fill(null)));
    const [error, setError] = useState(' ');

    useInput((input, key) => {
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

            for (let i = 0; i < currWord.length; i++) {
                const chObj = currWord[i];
                const ch = chObj.val;

                if (solarr.includes(ch))
                    chObj.exists = true;

                if (solarr[i] === ch)
                    chObj.correct = true;
            }

            setAttempts(attempts);
            setRow(currRow + 1);
            setCol(-1);
        }
        else if(input === ' ' || key.tab) 
            return;
        else  {
            setError(` `);

            if (key.backspace || key.delete) {
                if (newCol != -1)
                    attempts[currRow][newCol] = null;

                if (currCol != -1)
                    newCol -= 1;
            }
            else if(/[a-zA-Z]/.test(input)) {
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
        <Box flexDirection='column'>
            <Box justifyContent='center' alignItems='center'>
                <Text color='#F85A3E'>{error}</Text>
            </Box>
            <React.Fragment>
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
                                else if(row_idx < currRow)
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
            </React.Fragment>
        </Box>
    );
}

module.exports = Game;