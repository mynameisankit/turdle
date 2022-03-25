'use strict';

const React = require('react');
const { useState } = require('react');
const { Text, Box, useApp, useInput } = require('ink');
const BigText = require('ink-big-text');
const importJsx = require('import-jsx');
const Gradient = require('ink-gradient');

const { PageProvider } = importJsx('./components/PageContext.js');
const Game = importJsx('./components/Game.js');
const Tutorial = importJsx('./components/Tutorial.js');

function App() {
	const { exit } = useApp();
	const [page, setPage] = useState('tutorial');

	useInput((input, key) => {
		if (key.escape) {
			if (page !== 'main')
				setPage('main');
			else
				exit();
		}
	});

	return (
		<PageProvider value={{ page, setPage }}>
			<Box justifyContent='center' alignItems='center' flexDirection='column'>
				<Gradient name='teen'><BigText text="TURDLE" /></Gradient>
				<React.Fragment>
					{page === 'main' && <Game />}
					{page === 'tutorial' && <Tutorial />}
				</React.Fragment>
				<Text bold>You can press "Esc" to exit the {page === 'main' ? 'app' : 'current page'}</Text>
			</Box>
		</PageProvider>
	);
}

module.exports = App;