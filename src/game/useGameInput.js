import { useInput } from "ink";
import ncp from "node-clipboardy";
import { captureResult, saveGameAttempts } from "../data/cache.js";
import { recordCompletedGame } from "./statistics.js";
import { createShareText } from "./logic.js";
import { prepareGuess, updateCurrentGuess } from "./attempts.js";
import { PAGES } from "../context/PageContext.jsx";

async function copyProgress({
    puzzleDay,
    attempts,
    completed,
    currentRow,
    notify,
    clear,
    setCopied,
}) {
    const result = await captureResult(() =>
        ncp.writeSync(
            createShareText(
                puzzleDay,
                attempts,
                completed.found,
                currentRow,
            ),
        ),
    );

    if (result.ok) {
        setCopied(true);
        clear();
        return;
    }

    notify(
        "Progress could not be copied. Check clipboard access and press Ctrl + X to retry.",
    );
}

async function handleCompletedGameShortcut(input, context) {
    const { key } = context;
    if (!key.ctrl) return false;

    if (input.toLowerCase() === "x") {
        await copyProgress(context);
    } else if (input.toLowerCase() === "s") {
        context.setPage(PAGES.STATISTICS);
    }

    return true;
}

async function saveGuessProgress(context, submission) {
    return captureResult(() =>
        saveGameAttempts(context.cache, submission.attempts),
    );
}

function applyGuessSubmission(context, submission) {
    context.setAttempts(submission.attempts);
    context.setCurrentRow(submission.currentRow);
    context.setCurrentColumn(-1);
    context.setError(" ");
    context.setCompleted(submission.completed);
    context.clear();
}

async function updateCompletedStatistics(context, submission) {
    const result = await captureResult(() =>
        recordCompletedGame(context.cache, {
            ...submission.completed,
            currentRow: submission.currentRow,
        }),
    );
    if (!result.ok) {
        context.notify(
            "Your guess was saved, but statistics could not be updated.",
        );
    }
}

async function submitGuess(context) {
    const submission = prepareGuess(context);
    if (!submission.ok) {
        context.setError(submission.error);
        return;
    }

    const saveResult = await saveGuessProgress(context, submission);
    if (!saveResult.ok) {
        context.setError("Progress could not be saved. Press Enter to retry.");
        context.notify("Your guess is still on screen, but it has not been saved.");
        return;
    }

    applyGuessSubmission(context, submission);
    await updateCompletedStatistics(context, submission);
}

function updateGuess(context, character, key) {
    if (character === " " || key.tab) return;

    const updatedGuess = updateCurrentGuess({
        attempts: context.attempts,
        currentRow: context.currentRow,
        currentColumn: context.currentColumn,
        character,
        key,
    });

    context.setError(" ");
    context.setCurrentColumn(updatedGuess.currentColumn);
    context.setAttempts(updatedGuess.attempts);
}

function useGameInput(context) {
    useInput(async (input, key) => {
        if (key.escape || !context.attempts) return;

        if (context.completed.found || context.completed.turd) {
            const handled = await handleCompletedGameShortcut(input, {
                ...context,
                key,
            });
            if (handled) return;
        }

        if (key.return) {
            await submitGuess(context);
            return;
        }

        const character = input === "" ? "" : input[0];
        updateGuess(context, character, key);
    });
}

export default useGameInput;
