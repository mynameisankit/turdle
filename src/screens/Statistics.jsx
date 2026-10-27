import React from "react";
import { Text, Box } from "ink";
import Divider from "ink-divider";
import useStatistics from "./useStatistics.js";

const STATISTIC_MEASURES = [
    { measure: "Played", valueKey: "played" },
    { measure: "Current Streak", valueKey: "currentStreak" },
    { measure: "Max Streak", valueKey: "maxStreak" },
    { measure: "Win %", valueKey: "winPercentage" },
];
const MAX_GUESS_BAR_LENGTH = 10;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

function getGuessBarColor(amount, maxCount) {
    if (amount === 0) return "gray";
    if (amount !== maxCount) return "white";
    return "green";
}

function getGuessBarLength(amount) {
    if (amount === 0) return MAX_GUESS_BAR_LENGTH;
    return Math.min(amount, MAX_GUESS_BAR_LENGTH);
}

function StatisticMeasures({ statistics }) {
    return (
        <Box alignItems="center" justifyContent="space-between" marginY={1}>
            {STATISTIC_MEASURES.map(({ measure, valueKey }) => (
                <Box
                    flexDirection="column"
                    borderStyle="single"
                    alignItems="center"
                    paddingX={1}
                    marginX={2}
                    key={measure}
                >
                    <Text>{statistics[valueKey] ?? 0}</Text>
                    <Text bold>{measure}</Text>
                </Box>
            ))}
        </Box>
    );
}

function GuessDistribution({ distribution }) {
    const maxCount = Math.max(...distribution);

    return (
        <Box flexDirection="column" alignItems="flex-start" paddingY={1}>
            {distribution.map((amount, index) => (
                <Text key={index}>
                    {`${index + 1}  `}
                    <Text backgroundColor={getGuessBarColor(amount, maxCount)}>
                        {" ".repeat(getGuessBarLength(amount))}
                    </Text>
                    {`  ${amount}`}
                </Text>
            ))}
        </Box>
    );
}

function getTimeUntilNextPuzzle(now) {
    return {
        hours: HOURS_PER_DAY - now.getHours(),
        minutes: MINUTES_PER_HOUR - now.getMinutes(),
    };
}

function NextPuzzleCountdown() {
    const { hours, minutes } = getTimeUntilNextPuzzle(new Date());

    return (
        <Box flexDirection="column" alignItems="center" marginBottom={1}>
            <Text bold>Next Turdle</Text>
            <Text>
                {hours} hours and {minutes} minutes
            </Text>
        </Box>
    );
}

function Statistics() {
    const statistics = useStatistics();
    const guessDistribution = statistics.guessDistribution;

    return (
        <Box alignItems="center" flexDirection="column">
            <Divider title="Statistics" />
            <StatisticMeasures statistics={statistics} />
            <Divider title="Guess Distribution" />
            <GuessDistribution distribution={guessDistribution} />
            <NextPuzzleCountdown />
        </Box>
    );
}

export default Statistics;
