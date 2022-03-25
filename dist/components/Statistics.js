const React = require('react');
const { useState, useEffect, useContext } = require('react');
const { Text, Box } = require('ink');
const Divider = require('ink-divider');
const importJsx = require('import-jsx');

const { CacheContext, keys } = importJsx('./CacheContext');

function Statistics() {
    const cache = useContext(CacheContext);

    const [statistics, setStatistics] = useState({});

    //Fetch Stats
    useEffect(async () => {
        const stats = await cache.get(keys.STATISTICS, {});
        setStatistics(stats);
    }, []);

    const { played, currentStreak, maxStreak, winPercentage } = statistics;
    let { guessDistribution } = statistics;

    if (!guessDistribution)
        guessDistribution = new Array(6).fill(0);

    const maxCount = Math.max(...guessDistribution);

    const time = new Date();
    const [h, m] = [time.getHours(), time.getMinutes()];

    return (
        <Box alignItems='center' flexDirection='column'>
            <Divider title='Statistics' />
            <Box alignItems='center' justifyContent='space-between' marginY={1}>
                {[
                    {
                        measure: 'Played',
                        value: played
                    }, {
                        measure: 'Current Streak',
                        value: currentStreak
                    }, {
                        measure: 'Max Streak',
                        value: maxStreak
                    }, {
                        measure: 'Win %',
                        value: winPercentage
                    },
                ].map(({ measure, value }) => (
                    <Box
                        flexDirection='column'
                        borderStyle='single'
                        alignItems='center'
                        paddingX={1}
                        marginX={2}
                        key={measure}>
                        <Text>{value === undefined ? 0 : value}</Text>
                        <Text bold>{measure}</Text>
                    </Box>
                ))}
            </Box>
            <Divider title='Guess Distribution' />
            <Box flexDirection='column' alignItems='flex-start' paddingY={1}>
                {guessDistribution.map((amt, idx) => (
                    <Text key={idx}>
                        {`${idx + 1}  `}
                        <Text backgroundColor={amt === 0 ? 'gray' : (amt !== maxCount) ? 'white' : 'green'}>
                            {new Array(Math.min(amt === 0 ? 10 : amt, 10)).fill(' ').join('')}
                        </Text>
                        {`  ${amt}`}
                    </Text>
                ))}
            </Box>
            <Box flexDirection='column' alignItems='center' marginBottom={1}>
                <Text bold>Next Turdle</Text>
                <Text>{24 - h} hours and {60 - m} minutes</Text>
            </Box>
        </Box>
    );
}

module.exports = Statistics;