'use strict';

const React = require('react');
const { useState, useEffect } = require('react');
const { Text, Box, useApp, useInput } = require('ink');
const BigText = require('ink-big-text');
const importJsx = require('import-jsx');
const Gradient = require('ink-gradient');
const Cache = require('file-system-cache').default;

const { PageProvider, pages } = importJsx('./components/PageContext.js');
const { CacheProvider, keys } = importJsx('./components/CacheContext.js');

const Game = importJsx('./components/Game.js');
const Tutorial = importJsx('./components/Tutorial.js');
const Statistics = importJsx('./components/Statistics.js');

const cache = Cache();

function App() {
	const { exit } = useApp();
	const [page, setPage] = useState('');

	useEffect(async () => {
		const stats = await cache.get(keys.STATISTICS, {});

		if (stats.played === undefined || stats.played === 0)
			setPage(pages.TUTORIAL);
		else
			setPage(pages.GAME);
	}, []);

	useInput((input, key) => {
		if (key.escape) {
			if (page !== pages.GAME)
				setPage(pages.GAME);
			else
				exit();
		}
	});

	return (
		<CacheProvider value={cache}>
			<PageProvider value={{ page, setPage }}>
				<Box justifyContent='center' alignItems='center' flexDirection='column'>
					<Gradient name='teen'><BigText text="TURDLE" /></Gradient>
					<React.Fragment>
						{page === pages.GAME && <Game />}
						{page === pages.TUTORIAL && <Tutorial />}
						{page === pages.STATISTICS && <Statistics />}
					</React.Fragment>
					<Text bold>You can press "Esc" to exit the {page === 'main' ? 'app' : 'current page'}</Text>
				</Box>
			</PageProvider>
		</CacheProvider>
	);
}

module.exports = App;