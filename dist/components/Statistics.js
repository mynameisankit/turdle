const React = require('react');
const { useState, useEffect } = require('react');
const { Text, Box } = require('ink');

const STATISTICS_KEY = 'statistics';

function Statistics({ cache, found }) {
    const [statistics, setStatistics] = useState({});

    //Fetch Stats
    useEffect(async () => {
        const defaultStat = {
            played: 0,
            currentStreak: 0,
            maxStreak: 0,
            wins: 0,
            winPercentage: 0,
            dateSet: null
        };

        let stats = await cache.get(STATISTICS_KEY, defaultStat);

        if (stats === defaultStat || new Date().getDate() != new Date(stats.dateSet).getDate()) {
            if (found) {
                stats.currentStreak += 1;
                stats.wins++;
            }
            else
                currentStreak = 0;

            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
            stats.played++;

            stats.winPercentage = stats.wins / stats.played;

            stats.dateSet = new Date();
            await cache.set(STATISTICS_KEY, stats);
        }

        setStatistics(stats);
    }, []);

    return (
        <Box width='50%' alignItems='center' flexDirection='column' borderStyle='single'>
            <Text bold>Statistics</Text>
            <Box width='100%' alignItems='center' justifyContent='center'>
                {[
                    {
                        measure: 'Played',
                        value: statistics?.played
                    }, {
                        measure: 'Current Streak',
                        value: statistics?.currentStreak
                    }, {
                        measure: 'Max Streak',
                        value: statistics?.maxStreak
                    }, {
                        measure: 'Win %',
                        value: statistics?.winPercentage
                    },
                ].map(({ measure, value }) => (
                    <Box key={measure} flexDirection='column'>
                        <Text>{value === undefined ? 0 : value}</Text>
                        <Text>{measure}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

module.exports = Statistics;