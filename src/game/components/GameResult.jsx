import React from "react";
import { Box, Text } from "ink";
import { MAX_ATTEMPTS } from "../constants.js";

const WINNING_MESSAGES = [
    "You are Genius",
    "Magnificent",
    "You are smart enough, I guess",
    "Your mom must be proud of you",
    "Reject humanity, Embrace Monke",
    "My grandmother must have guessed it by now!",
];

function getOutcomeMessages({ found, turd, currentRow, solution }) {
    if (found) {
        return [
            WINNING_MESSAGES[currentRow - 1],
            `You have found the answer ${solution} in ${currentRow}/${MAX_ATTEMPTS} attempts`,
        ];
    }

    if (turd) return ["You are a Turd 💩", `The correct answer is ${solution}`];
    return ["You are a Turd 💩"];
}

function getShareActionMessage(copied) {
    if (copied) {
        return "Copied!";
    }

    return "Press Ctrl + X to share your progress";
}

function createResultMessages(props) {
    return [
        ...getOutcomeMessages(props),
        " ",
        "Press Ctrl + S to see your statistics",
        getShareActionMessage(props.copied),
        " ",
    ];
}

function GameResult(props) {
    const { found, turd } = props;
    if (!found && !turd) return null;

    return (
        <Box flexDirection="column" justifyContent="center" alignItems="center">
            {createResultMessages(props).map((message, index) => (
                <Text key={index} bold color="#A1E8AF">
                    {message}
                </Text>
            ))}
        </Box>
    );
}

export default GameResult;
