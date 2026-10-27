import React from "react";
import { Box, Text, Newline } from "ink";
import useGameController from "./useGameController.js";
import GameBoard from "./components/GameBoard.jsx";
import GameResult from "./components/GameResult.jsx";

function Game() {
    const game = useGameController();
    return (
        <Box flexDirection="column" alignItems="center">
            <Box justifyContent="center" alignItems="center">
                <Text bold color="#F85A3E">
                    {game.error}
                </Text>
                <Newline />
            </Box>
            <GameBoard attempts={game.attempts} currentRow={game.currentRow} />
            <Newline />
            <GameResult
                {...game.completed}
                currentRow={game.currentRow}
                solution={game.solution}
                copied={game.copied}
            />
        </Box>
    );
}

export default Game;
