import { MAX_ATTEMPTS, WORD_LENGTH } from "./constants.js";
import { scoreGuess } from "./logic.js";

function replaceRow(attempts, rowIndex, transform) {
    return attempts.map((row, index) =>
        index === rowIndex ? transform(row) : row,
    );
}

function getNextColumn(currentColumn, deleting, enteringLetter) {
    if (deleting) {
        if (currentColumn === -1) return -1;
        return currentColumn - 1;
    }
    if (enteringLetter) return Math.min(currentColumn + 1, WORD_LENGTH - 1);
    return currentColumn;
}

export function prepareGuess({
    attempts,
    currentRow,
    currentColumn,
    solution,
    words,
}) {
    if (currentColumn !== WORD_LENGTH - 1) {
        return { ok: false, error: "Not enough letters" };
    }

    const currentGuess = attempts[currentRow];
    const word = currentGuess
        .map((letter) => letter.val)
        .join("")
        .toLowerCase();
    if (words[word] === undefined) {
        return { ok: false, error: `Word ${word.toUpperCase()} not in dictionary` };
    }

    const { guess, correctCount } = scoreGuess(currentGuess, solution);
    const nextRow = currentRow + 1;

    return {
        ok: true,
        attempts: replaceRow(attempts, currentRow, () => guess),
        currentRow: nextRow,
        completed: {
            found: correctCount === WORD_LENGTH,
            turd: currentRow === MAX_ATTEMPTS - 1,
        },
    };
}

export function updateCurrentGuess({
    attempts,
    currentRow,
    currentColumn,
    character,
    key,
}) {
    const deleting = key.backspace || key.delete;
    const enteringLetter = /[a-zA-Z]/.test(character);
    const nextColumn = getNextColumn(currentColumn, deleting, enteringLetter);
    const nextAttempts = replaceRow(attempts, currentRow, (row) =>
        row.map((letter, column) => {
            if (deleting && column === currentColumn) return null;
            if (enteringLetter && column === nextColumn) {
                return {
                    val: character.toUpperCase(),
                    correct: false,
                    exists: false,
                };
            }
            return letter;
        }),
    );

    return { attempts: nextAttempts, currentColumn: nextColumn };
}
