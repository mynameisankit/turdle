import { CACHE_KEYS } from "../context/CacheContext.jsx";
import { MAX_ATTEMPTS, WORD_LENGTH } from "../game/constants.js";
import { createEmptyAttempts } from "../game/logic.js";

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidGuessDistribution(distribution) {
    return (
        distribution === undefined ||
        (Array.isArray(distribution) &&
            distribution.length === MAX_ATTEMPTS &&
            distribution.every(
                (count) => Number.isSafeInteger(count) && count >= 0,
            ))
    );
}

function isValidStatistics(statistics) {
    return (
        isObject(statistics) &&
        isValidGuessDistribution(statistics.guessDistribution)
    );
}

function assertValidStatistics(statistics) {
    if (!isValidStatistics(statistics)) {
        throw new Error("Saved statistics are invalid.");
    }

    return statistics;
}

async function loadValidatedStatistics(cache, fallback) {
    return assertValidStatistics(
        await cache.get(CACHE_KEYS.STATISTICS, fallback),
    );
}

function mergeStatistics(fallback, statistics) {
    return { ...fallback, ...statistics };
}

export function loadInitialStatistics(cache) {
    return loadValidatedStatistics(cache, {});
}

function isValidAttemptLetter(letter) {
    return (
        letter === null ||
        (isObject(letter) &&
            typeof letter.val === "string" &&
            letter.val.length === 1)
    );
}

function isValidAttemptRow(row) {
    return (
        Array.isArray(row) &&
        row.length === WORD_LENGTH &&
        row.every(isValidAttemptLetter)
    );
}

function isValidAttempts(attempts) {
    return (
        Array.isArray(attempts) &&
        attempts.length === MAX_ATTEMPTS &&
        attempts.every(isValidAttemptRow)
    );
}

function assertValidAttempts(attempts) {
    if (!isValidAttempts(attempts)) {
        throw new Error("Saved game progress is invalid.");
    }

    return attempts;
}

function isGameDateCurrent(cacheDate, now) {
    return (
        cacheDate !== null && new Date(cacheDate).getDate() === now.getDate()
    );
}

async function clearExpiredGameAttempts(cache, cacheDate, now) {
    if (isGameDateCurrent(cacheDate, now)) return;

    await cache.remove(CACHE_KEYS.ATTEMPTS);
    await cache.remove(CACHE_KEYS.GAME_CACHE_SET);
}

async function loadValidatedAttempts(cache) {
    const attempts = await cache.get(
        CACHE_KEYS.ATTEMPTS,
        createEmptyAttempts(),
    );
    return assertValidAttempts(attempts);
}

export async function loadGameAttempts(cache, now = new Date()) {
    const cacheDate = await cache.get(CACHE_KEYS.GAME_CACHE_SET, now);
    await clearExpiredGameAttempts(cache, cacheDate, now);
    return loadValidatedAttempts(cache);
}

export function saveGameAttempts(cache, attempts, now = new Date()) {
    return cache.save([
        { key: CACHE_KEYS.ATTEMPTS, value: attempts },
        { key: CACHE_KEYS.GAME_CACHE_SET, value: now },
    ]);
}

export async function loadStatistics(cache, fallback) {
    const statistics = await loadValidatedStatistics(cache, fallback);
    return mergeStatistics(fallback, statistics);
}

export async function captureResult(operation) {
    try {
        return { ok: true, value: await operation() };
    } catch (error) {
        return { ok: false, error };
    }
}
