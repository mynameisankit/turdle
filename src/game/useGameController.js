import { useEffect, useState } from "react";
import { useCache } from "../context/CacheContext.jsx";
import { usePage } from "../context/PageContext.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import { captureResult, loadGameAttempts } from "../data/cache.js";
import {
    ANSWERS_DICTIONARY,
    WORDS_DICTIONARY,
} from "../data/dictionaries.js";
import {
    createEmptyAttempts,
    getPuzzleDay,
    getSolution,
    restoreProgress,
} from "./logic.js";
import { recordCompletedGame } from "./statistics.js";
import useGameInput from "./useGameInput.js";

const INITIAL_COMPLETION = { found: false, turd: false };

function createRestoredGameState(loadResult) {
    const attempts = loadResult.ok ? loadResult.value : createEmptyAttempts();
    const progress = restoreProgress(attempts);
    const completion = { found: progress.found, turd: progress.turd };

    return { attempts, progress, completion };
}

function applyRestoredGameState({ attempts, progress, completion }, context) {
    context.setAttempts(attempts);
    context.setCurrentRow(progress.row);
    context.setCompleted(completion);
}

function reportProgressLoadFailure(notify) {
    notify(
        "Saved progress could not be loaded. A fresh game has started; progress may not persist.",
    );
}

async function updateRestoredStatistics(cache, progress, completion, notify) {
    const result = await captureResult(() =>
        recordCompletedGame(cache, { ...completion, currentRow: progress.row }),
    );
    if (!result.ok) {
        notify(
            "Your saved progress loaded, but statistics could not be updated.",
        );
    }
}

async function restoreGameState(context) {
    const loadResult = await captureResult(() =>
        loadGameAttempts(context.cache),
    );
    const restoredState = createRestoredGameState(loadResult);

    applyRestoredGameState(restoredState, context);

    if (!loadResult.ok) {
        reportProgressLoadFailure(context.notify);
        return;
    }

    context.clear();
    await updateRestoredStatistics(
        context.cache,
        restoredState.progress,
        restoredState.completion,
        context.notify,
    );
}

function useGameController() {
    const puzzleDay = getPuzzleDay();
    const solution = getSolution(ANSWERS_DICTIONARY, puzzleDay);
    const cache = useCache();
    const { setPage } = usePage();
    const { notify, clear } = useFeedback();
    const [currentRow, setCurrentRow] = useState(0);
    const [currentColumn, setCurrentColumn] = useState(-1);
    const [attempts, setAttempts] = useState(null);
    const [error, setError] = useState(" ");
    const [copied, setCopied] = useState(false);
    const [completed, setCompleted] = useState(INITIAL_COMPLETION);

    useEffect(() => {
        restoreGameState({
            cache,
            setAttempts,
            setCurrentRow,
            setCompleted,
            notify,
            clear,
        });
    }, [cache, clear, notify]);

    useGameInput({
        attempts,
        cache,
        completed,
        currentColumn,
        currentRow,
        notify,
        clear,
        puzzleDay,
        setAttempts,
        setCompleted,
        setCurrentColumn,
        setCurrentRow,
        setError,
        setPage,
        setCopied,
        solution,
        words: WORDS_DICTIONARY,
    });

    return {
        attempts,
        completed,
        copied,
        currentRow,
        error,
        solution: solution.join(""),
    };
}

export default useGameController;
