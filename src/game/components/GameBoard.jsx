import React from "react";
import { Box } from "ink";
import LetterTile from "../../components/LetterTile.jsx";
import { getLetterTileColor } from "../../components/letterTileColors.js";

function GameBoard({ attempts, currentRow }) {
    return (
        <Box flexDirection="column" alignItems="center">
            {attempts &&
                attempts.map((row, rowIndex) => (
                    <Box key={rowIndex}>
                        {row.map((letter, columnIndex) => {
                            const textColor = getLetterTileColor(
                                letter,
                                rowIndex < currentRow ? "grey" : "white",
                            );
                            return (
                                <LetterTile
                                    key={columnIndex}
                                    color={textColor}
                                    bold={letter && letter.exists && letter.correct}
                                    value={letter === null ? " " : letter.val}
                                />
                            );
                        })}
                    </Box>
                ))}
        </Box>
    );
}

export default GameBoard;
