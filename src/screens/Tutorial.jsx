import React from 'react';
import { Text, Box, Newline } from 'ink';
import Divider from 'ink-divider';
import LetterTile from '../components/LetterTile.jsx';
import { getLetterTileColor } from '../components/letterTileColors.js';

const TUTORIAL_RULES = [
    "Guess the TURDLE in six tries.",
    "Each guess must be a valid five-letter word. Hit the enter button to submit.",
    "After each guess, the color of the tiles will change to show how close your guess was to the word.",
];
const TUTORIAL_EXAMPLES = [
    {
        text: "The letter E is in the word and in the correct spot.",
        example: [
            { val: "H" },
            { val: "E", correct: true },
            { val: "L" },
            { val: "L" },
            { val: "O" },
        ],
    },
    {
        text: "The letter O is in the word but not in the correct spot.",
        example: [
            { val: "A" },
            { val: "B" },
            { val: "O", exists: true },
            { val: "O" },
            { val: "T" },
        ],
    },
    {
        text: "None of the letter are at the correct spot.",
        example: [
            { val: "A" },
            { val: "C" },
            { val: "T" },
            { val: "O" },
            { val: "R" },
        ],
    },
];

function Examples({ children: word }) {
    return (
        <Box>
            {word.map(({ val, correct, exists }, idx) => {
                const textColor = getLetterTileColor(
                    { correct, exists },
                    "grey",
                );

                return (
                    <LetterTile
                        key={idx}
                        color={textColor}
                        bold={exists && correct}
                        value={val}
                    />
                );
            })}
        </Box>
    );
}

function Tutorial() {
    return (
        <Box justifyContent="center" alignItems="center" flexDirection="column">
            <Box paddingBottom={1}>
                <Text bold>Tutorial</Text>
            </Box>
            <Divider title={"Rules"} />
            <Box alignItems="flex-start" paddingY={1}>
                <Text>
                    <React.Fragment>
                        {TUTORIAL_RULES.map((instruction, idx, arr) => (
                            <React.Fragment key={idx}>
                                <Text>
                                    {idx + 1} : {instruction}
                                </Text>
                                {idx + 1 !== arr.length ? <Newline /> : null}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                </Text>
            </Box>
            <Divider title="Examples" />
            <Box paddingY={1} flexDirection="column">
                {TUTORIAL_EXAMPLES.map(({ text, example }, idx, arr) => (
                    <Box key={idx} flexDirection="column" alignItems="center">
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

export default Tutorial;
