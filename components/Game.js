const React = require('react');
const { Text, Box } = require('ink');

function Game(props) {
    let solution = 'their';

    let attempts = Array(6).fill(Array(5).fill(null));

    return (
        <Box>
            {attempts.map(row => (
                row.map(col =>  (
                    <Box borderStyle='round' borderColor='green'>
                        { col === null && <Text>{' '}</Text> }
                    </Box>
                ))
            ))}
        </Box>
    );
}

module.exports = Game;