import { CACHE_KEYS } from "../context/CacheContext.jsx";
import { loadStatistics } from "../data/cache.js";
import { MAX_ATTEMPTS } from "./constants.js";

export function createEmptyStatistics() {
    return {
        played: 0,
        currentStreak: 0,
        maxStreak: 0,
        wins: 0,
        winPercentage: 0,
        guessDistribution: new Array(MAX_ATTEMPTS).fill(0),
    };
}

function isCompletedGame({ found, turd }) {
    return found || turd;
}

function hasAlreadyRecorded(dateSet, now) {
    return dateSet !== null && new Date(dateSet).getDate() === now.getDate();
}

function updateGuessDistribution(guessDistribution, found, currentRow) {
    return guessDistribution.map((count, index) =>
        index === currentRow - 1 && found ? count + 1 : count,
    );
}

function calculateUpdatedStatistics(statistics, { found, currentRow }) {
    const currentStreak = found ? statistics.currentStreak + 1 : 0;
    const wins = statistics.wins + (found ? 1 : 0);
    const played = statistics.played + 1;

    return {
        ...statistics,
        currentStreak,
        maxStreak: Math.max(statistics.maxStreak, currentStreak),
        wins,
        played,
        winPercentage: wins / played,
        guessDistribution: updateGuessDistribution(
            statistics.guessDistribution,
            found,
            currentRow,
        ),
    };
}

async function saveStatisticsForDate(cache, statistics, now) {
    await cache.set(CACHE_KEYS.STATISTICS, statistics);
    await cache.set(CACHE_KEYS.STATISTICS_SET, now);
}

export async function recordCompletedGame(cache, completion, now = new Date()) {
    if (!isCompletedGame(completion)) return;

    const dateSet = await cache.get(CACHE_KEYS.STATISTICS_SET, null);
    if (hasAlreadyRecorded(dateSet, now)) return;

    const statistics = await loadStatistics(cache, createEmptyStatistics());
    const updatedStatistics = calculateUpdatedStatistics(
        statistics,
        completion,
    );

    await saveStatisticsForDate(cache, updatedStatistics, now);
}
