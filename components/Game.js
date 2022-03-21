const React = require('react');
const { Text, Box } = require('ink');

function Game(props) {
    let solution = 'their';

    let attempts = Array(6).fill(Array(5).fill(null));

    return (
        <Box flexDirection='column'>
            {attempts.map((row, row_idx) => (
                <Box key={row_idx}>
                    {
                        row.map((col, col_idx) => (
                            <Box
                                height={3}
                                width={6}
                                key={col_idx}
                                borderStyle='round'
                                borderColor={col.correct ? 'green' : (col.exists ? 'yellow' : 'white')}
                            >
                                <Text>{col === null ? ' ' : col.val}</Text>
                            </Box>
                        ))
                    }
                </Box>
            ))}
        </Box>
    );
}

module.exports = Game;