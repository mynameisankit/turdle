'use strict';

const React = require('react');
const { Text, Box, useApp, useInput } = require('ink');
const BigText = require('ink-big-text');
const importJsx = require('import-jsx');
const Gradient = require('ink-gradient');

const Game = importJsx('./Game');

function App() {
	const {exit} = useApp();

	useInput((input, key) => {
		if(key.escape)
			exit();
	});

	return (
		<Box justifyContent='center' alignItems='center' flexDirection='column'>
			<Gradient name='teen'><BigText text="TURDLE" /></Gradient>
			<Game />
			<Text>You can press "Esc" to exit</Text>
		</Box>
	);
}

module.exports = App;