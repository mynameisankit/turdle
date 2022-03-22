'use strict';
const React = require('react');
const { Text, Box, useApp, useInput } = require('ink');
const BigText = require('ink-big-text');
const importJsx = require('import-jsx');

const Game = importJsx('./components/Game');

function App() {
	const {exit} = useApp();

	useInput((input, key) => {
		if(key.escape)
			exit();
	});

	return (
		<Box justifyContent='center' alignItems='center' flexDirection='column'>
			<Text>Press "Esc" to exit</Text>
			<BigText text="TURDLE" />
			<Game />
		</Box>
	);
}

module.exports = App;