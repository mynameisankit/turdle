const React = require('react');
const { useState, useEffect } = require('react');
const { Text, Box, Spacer, Newline, useInput } = require('ink');
const ncp = require('node-clipboardy');
const Cache = require('file-system-cache').default;

//Importing dictionary
const wordsDictionary = require('./database/words.json');
const answersDictionary = require('./database/answers.json');

const gameCache = Cache();

function Game() {
    const diffDays = Math.ceil(Math.abs(new Date() - new Date('2021/6/19')) / (1000 * 60 * 60 * 24)) - 1;
    const solution = answersDictionary[diffDays % (answersDictionary.length)].toUpperCase().split('');

    const [currRow, setRow] = useState(0);
    const [currCol, setCol] = useState(-1);
    const [attempts, setAttempts] = useState(null);
    const [error, setError] = useState(' ');
    const [found, setFound] = useState(false);
    const [turd, setTurd] = useState(false);
    const [copied, setCopied] = useState('Press ctrl+X to share your progress');

    //Initialize State on first mount
    useEffect(async () => {
        const ttl = await gameCache.get('ttl', new Date());

        //Clear the cache when new day starts
        if (ttl === null || new Date().getDate() != new Date(ttl).getDate())
            await gameCache.clear();

        const cachedAttempt = await gameCache.get('attempts', Array(6).fill(0).map(() => new Array(5).fill(null)));

        let firstEmptyRow = 6;
        let isFound = false;

        for (let i = 0; i < 6; i++) {
            if (cachedAttempt[i][0] === null) {
                firstEmptyRow = i;
                break;
            }

            let count = 0;
            for (let j = 0; j < 5; j++)
                count += cachedAttempt[i][j].correct;

            if (count === 5) {
                firstEmptyRow = i + 1;
                isFound = true;
                break;
            }
        }

        setAttempts(cachedAttempt);
        setRow(firstEmptyRow);
        setFound(isFound);
        if (firstEmptyRow === 6)
            setTurd(true);
    }, []);

    useInput(async (input, key) => {
        if (key.escape)
            return;

        if (input !== '')
            input = input[0];

        if (found || turd) {
            if (key.ctrl && input == 'x') {
                let share = `Wordle ${diffDays} ${found ? currRow : `X`}/6\n\n`;

                for (let row of attempts) {
                    for (let col of row) {
                        if (col && col.correct)
                            share += "🟩";
                        else if (col && col.exists)
                            share += "🟨";
                        else
                            share += "⬛";
                    }

                    share += "\n";
                }

                ncp.writeSync(share);
                setCopied(`Copied!`);
            }

            return;
        }

        if (key.return) {
            if (currCol != 4) {
                setError('Not enough letters');
                return;
            }

            let currWord = attempts[currRow];

            //Check if word is in dictionary
            const word = currWord.map(chObj => chObj.val).join('').toLowerCase();
            if (wordsDictionary[word] === undefined) {
                setError(`Word ${word.toUpperCase()} not in dictionary`);
                return;
            }

            let numCorrect = 0;

            //Count the frequency of alphabet in solution word 
            const freq = {};
            for (let i = 0; i < solution.length; i++) {
                const curr = solution[i];

                if (freq[curr] == undefined)
                    freq[curr] = 1;
                else
                    freq[curr]++;
            }

            //Check the alphabets at correct position
            //and reduce the frequency accordingly
            for (let i = 0; i < currWord.length; i++) {
                const chObj = currWord[i];
                const ch = chObj.val;

                if (solution[i] === ch) {
                    chObj.correct = true;
                    numCorrect++;
                    freq[ch]--;
                }
            }

            //Mark the alphabets at wrong position
            for (let i = 0; i < currWord.length; i++) {
                const chObj = currWord[i];
                const ch = chObj.val;

                if (freq[ch] && !chObj.correct) {
                    chObj.exists = true;
                    freq[ch]--;
                }
            }

            setFound(numCorrect === 5);
            setAttempts(attempts);
            setRow(currRow + 1);
            setCol(-1);

            //Save the board in cache with the time
            await gameCache.save([
                { key: 'attempts', value: attempts },
                { key: 'ttl', value: new Date() }
            ]);

            if (currRow == 5)
                setTurd(true);
        }
        else if (input === ' ' || key.tab)
            return;
        else {
            let newCol = currCol;

            //Note - Holding backspace causes weird output
            //BUG: Pressing characters when last col has a value does not work
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
                };
            }

            setError(` `);
            setCol(newCol);
            setAttempts(attempts);
        }
    });

    const finalTextColour = '#A1E8AF';
    return (
        <Box flexDirection='column' alignItems='center'>
            <Box justifyContent='center' alignItems='center'>
                <Text color='#F85A3E'>{error}</Text>
            </Box>
            <Box flexDirection='column' alignItems='center'>
                {attempts && attempts.map((row, row_idx) => (
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
            {/* TODO: Find a better way to display the below text */}
            <Box flexDirection='column' justifyContent='center' alignItems='center'>
                <Text bold color={finalTextColour}>{found && currRow == 1 && 'Genius!'}</Text>
                <Text bold color={finalTextColour}>{turd && `You are ${found ? 'still ' : ''}a turd!`}</Text>
                <Text bold color={finalTextColour}>{turd && !found && `The correct answer is ${solution.join('')}`}</Text>
                <Text bold color={finalTextColour}>{found ? `You have found the answer ${solution.join('')} in ${currRow}/6 attempts` : ' '}</Text>
                <Text bold color={finalTextColour}>{(found || turd) && copied}</Text>
                <Spacer />
            </Box>
            <Newline />
        </Box>
    );
}

module.exports = Game;