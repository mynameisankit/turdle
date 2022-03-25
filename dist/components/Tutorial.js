const React = require('react');
const { Text, Box, Newline } = require('ink');
const Divider = require('ink-divider');

function Examples({ children: word }) {
    return (
        <Box>
            {word.map(({ val, correct, exists }, idx) => {
                let textColor;

                if (correct)
                    textColor = 'green';
                else if (exists)
                    textColor = 'yellow';
                else
                    textColor = 'grey';

                return (
                    <Box
                        borderStyle='single'
                        alignItems='center'
                        justifyContent='center'
                        key={idx}
                        height={3}
                        width={6}
                        borderColor={textColor}>
                        <Text
                            bold={exists && correct}
                            color={textColor}>
                            {val}
                        </Text>
                    </Box>
                );
            })}
        </Box>
    );
}

function Tutorial() {
    return (
        <Box justifyContent='center' alignItems='center' flexDirection='column'>
            <Box paddingBottom={1}>
                <Text bold>Tutorial</Text>
            </Box>
            <Divider title={'Rules'} />
            <Box alignItems='flex-start' paddingY={1}>
                <Text>
                    <React.Fragment>
                        {[
                            'Guess the TURDLE in six tries.',
                            'Each guess must be a valid five-letter word. Hit the enter button to submit.',
                            'After each guess, the color of the tiles will change to show how close your guess was to the word.'
                        ].map((instruction, idx, arr) => (
                            <React.Fragment key={idx}>
                                <Text>{idx + 1} : {instruction}</Text>
                                {idx + 1 !== arr.length ? <Newline /> : null}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                </Text>
            </Box>
            <Divider title='Examples' />
            <Box paddingY={1} flexDirection='column'>
                {[
                    {
                        text: 'The letter E is in the word and in the correct spot.',
                        example: [{ val: 'H' }, { val: 'E', correct: true }, { val: 'L' }, { val: 'L' }, { val: 'O' }]
                    },
                    {
                        text: 'The letter O is in the word but not in the correct spot.',
                        example: [{ val: 'A' }, { val: 'B' }, { val: 'O', exists: true }, { val: 'O' }, { val: 'T' }]
                    },
                    {
                        text: 'None of the letter are at the correct spot.',
                        example: [{ val: 'A' }, { val: 'C' }, { val: 'T' }, { val: 'O' }, { val: 'R' }]
                    }
                ].map(({ text, example }, idx, arr) => (
                    <Box key={idx} flexDirection='column' alignItems='center'>
                        <Text>{text}</Text>
                        <Examples>{example}</Examples>
                        {idx + 1 !== arr.length ? <Newline /> : null}
                    </Box>
                ))}
            </Box>
            <Divider />
            <Text bold>
                A new TURDLE will be available each day!
                <Newline />
            </Text>
        </Box>
    );
}

module.exports = Tutorial;