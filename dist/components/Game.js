const React = require('react');
const { useState, useEffect, useContext } = require('react');
const { Text, Box, Newline, useInput } = require('ink');
const ncp = require('node-clipboardy');
const Divider = require('ink-divider');
const importJsx = require('import-jsx');

const { CacheContext, keys } = importJsx('./CacheContext');
const { PageContext, pages } = importJsx('./PageContext');

//Importing dictionary
const wordsDictionary = require('../database/words.json');
const answersDictionary = require('../database/answers.json');

function Game() {
    const diffDays = Math.ceil(Math.abs(new Date() - new Date('2021/6/19')) / (1000 * 60 * 60 * 24)) - 1;
    const solution = answersDictionary[diffDays % (answersDictionary.length)].toUpperCase().split('');

    const cache = useContext(CacheContext);
    const { setPage } = useContext(PageContext);

    const [currRow, setRow] = useState(0);
    const [currCol, setCol] = useState(-1);
    const [attempts, setAttempts] = useState(null);
    const [error, setError] = useState(' ');
    const [copied, setCopied] = useState(false);
    const [completed, setCompleted] = useState({ found: false, turd: false });

    //Initialize State on first mount
    useEffect(async () => {
        const ttl = await cache.get(keys.GAME_CACHE_SET, new Date());

        //Clear the cache when new day starts
        if (ttl === null || new Date().getDate() !== new Date(ttl).getDate()) {
            await cache.remove(keys.ATTEMPTS);
            await cache.remove(keys.GAME_CACHE_SET);
        }

        const cachedAttempt = await cache.get(keys.ATTEMPTS, Array(6).fill(0).map(() => new Array(5).fill(null)));

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
        setCompleted({
            found: isFound,
            turd: (firstEmptyRow === 6)
        });
    }, []);

    //Update the player statistics
    useEffect(async () => {
        const { found, turd } = completed;

        const date_set = await cache.get(keys.STATISTICS_SET, null);

        if ((found || turd) &&
            (date_set === null || new Date(date_set).getDate() !== new Date().getDate())) {
            const stats = await cache.get(keys.STATISTICS, {
                played: 0,
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                winPercentage: 0,
                guessDistribution: new Array(6).fill(0)
            });

            //Silently fail when an error occurs
            stats.currentStreak = found ? stats.currentStreak + 1 : 0;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
            stats.wins += found ? 1 : 0;
            stats.played += 1;
            stats.winPercentage = stats.wins / stats.played;
            if (found)
                stats.guessDistribution[currRow - 1] += 1;

            await cache.set(keys.STATISTICS, stats);
            await cache.set(keys.STATISTICS_SET, new Date());
        }

    }, [completed]);

    //Update the state according to user input
    useInput(async (input, key) => {
        if (key.escape)
            return;

        if (input !== '')
            input = input[0];

        const { found, turd } = completed;

        if (found || turd) {
            if (key.ctrl) {
                if (input === 'x' || input === 'X') {
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
                    setCopied(true);
                }
                else if (input === 's' || input === 'S')
                    setPage(pages.STATISTICS);

                return;
            }
        }

        if (key.return) {
            if (currCol !== 4) {
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

                if (freq[curr] === undefined)
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

            //Save the board in cache with the time
            await cache.save([
                { key: keys.ATTEMPTS, value: attempts },
                { key: keys.GAME_CACHE_SET, value: new Date() }
            ]);


            setAttempts(attempts);
            setRow(currRow + 1);
            setCol(-1);
            setCompleted({
                found: (numCorrect === 5),
                turd: (currRow === 5)
            });
        }
        else if (input === ' ' || key.tab)
            return;
        else {
            let newCol = currCol;

            //Note - Holding backspace causes weird output
            //BUG: Pressing characters when last col has a value does not work
            if (key.backspace || key.delete) {
                if (newCol !== -1)
                    attempts[currRow][newCol] = null;

                if (currCol !== -1)
                    newCol -= 1;
            }
            else if (/[a-zA-Z]/.test(input)) {
                if (currCol !== 4)
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

    const { found, turd } = completed;

    return (
        <React.Fragment>
            <Box flexDirection='column' alignItems='center'>
                <Box justifyContent='center' alignItems='center'>
                    <Text bold color='#F85A3E'>{error}</Text>
                    <Newline />
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
                                                color={textColor}>
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
                {(found || turd) && (
                    <Box flexDirection='column' justifyContent='center' alignItems='center'>
                        {[
                            found ? [
                                'You are Genius',
                                'Magnificent',
                                'You are smart enough, I guess',
                                'Your mom must be proud of you',
                                'Reject humanity, Embrace Monke',
                                'My grandmother must have guessed it by now!'][currRow - 1]
                                : 'You are a Turd 💩',
                            turd && !found && `The correct answer is ${solution.join('')}`,
                            found && `You have found the answer ${solution.join('')} in ${currRow}/6 attempts`,
                            ' ',
                            'Press Ctrl + S to see your statistics',
                            (copied ? 'Copied!' : 'Press Ctrl + X to share your progress'),
                            ' '
                        ].map((text, idx) => (
                            Boolean(text) && (
                                <Text key={idx} bold color='#A1E8AF'>{text}</Text>
                            )
                        ))}
                    </Box>
                )}
            </Box>
        </React.Fragment>
    );
}

module.exports = Game;