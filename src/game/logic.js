import {
    DAY_IN_MILLISECONDS,
    MAX_ATTEMPTS,
    PUZZLE_EPOCH,
    WORD_LENGTH,
} from "./constants.js";

const GREEN_TILE = "🟩";
const YELLOW_TILE = "🟨";
const BLACK_TILE = "⬛";

export function getPuzzleDay(now = new Date()) {
    return Math.ceil(Math.abs(now - PUZZLE_EPOCH) / DAY_IN_MILLISECONDS) - 1;
}

export function getSolution(answers, puzzleDay = getPuzzleDay()) {
    return answers[puzzleDay % answers.length].toUpperCase().split("");
}

function getRestoredRow(firstEmptyRow, winningRow) {
    if (winningRow !== -1) return winningRow + 1;
    if (firstEmptyRow !== -1) return firstEmptyRow;
    return MAX_ATTEMPTS;
}

export function createEmptyAttempts() {
    return Array.from({ length: MAX_ATTEMPTS }, () =>
        new Array(WORD_LENGTH).fill(null),
    );
}

function findFirstEmptyRow(attempts) {
    return attempts.findIndex((row) => row[0] === null);
}

function findWinningRow(attempts) {
    return attempts.findIndex((row) =>
        row.every((letter) => letter && letter.correct),
    );
}

export function restoreProgress(attempts) {
    const firstEmptyRow = findFirstEmptyRow(attempts);
    const winningRow = findWinningRow(attempts);
    const row = getRestoredRow(firstEmptyRow, winningRow);
    const found = winningRow !== -1;

    return { row, found, turd: row === MAX_ATTEMPTS };
}

function positionGuessLetters(guess, solution) {
    return guess.map((letter, index) => ({
        ...letter,
        correct: solution[index] === letter.val,
        exists: false,
    }));
}

function countLetters(letters) {
    return letters.reduce(
        (counts, letter) => ({
            ...counts,
            [letter]: (counts[letter] || 0) + 1,
        }),
        {},
    );
}

function removeCorrectLetters(frequencies, positionedGuess) {
    return positionedGuess.reduce(
        (counts, letter) =>
            letter.correct
                ? { ...counts, [letter.val]: counts[letter.val] - 1 }
                : counts,
        frequencies,
    );
}

function scorePositionedLetters(positionedGuess, remainingFrequency) {
    return positionedGuess.reduce(
        (result, letter) => {
            if (letter.correct)
                return { ...result, guess: [...result.guess, letter] };

            const exists = result.frequency[letter.val] > 0;
            return {
                guess: [...result.guess, { ...letter, exists }],
                frequency: exists
                    ? {
                          ...result.frequency,
                          [letter.val]: result.frequency[letter.val] - 1,
                      }
                    : result.frequency,
            };
        },
        { guess: [], frequency: remainingFrequency },
    );
}

export function scoreGuess(guess, solution) {
    const positionedGuess = positionGuessLetters(guess, solution);
    const letterFrequencies = countLetters(solution);
    const remainingFrequency = removeCorrectLetters(
        letterFrequencies,
        positionedGuess,
    );
    const scoredGuess = scorePositionedLetters(
        positionedGuess,
        remainingFrequency,
    );
    const correctCount = positionedGuess.filter(
        (letter) => letter.correct,
    ).length;

    return { guess: scoredGuess.guess, correctCount };
}

function createShareHeader(puzzleDay, found, currentRow) {
    return `Wordle ${puzzleDay} ${
        found ? currentRow : "X"
    }/${MAX_ATTEMPTS}\n\n`;
}

function getShareTile(letter) {
    if (letter && letter.correct) return GREEN_TILE;
    if (letter && letter.exists) return YELLOW_TILE;
    return BLACK_TILE;
}

function createShareGrid(attempts) {
    return attempts
        .map((row) => `${row.map(getShareTile).join("")}\n`)
        .join("");
}

export function createShareText(puzzleDay, attempts, found, currentRow) {
    return `${createShareHeader(puzzleDay, found, currentRow)}${createShareGrid(
        attempts,
    )}`;
}
