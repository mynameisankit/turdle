'use strict';
const React = require('react');
const {Text, Box} = require('ink');
const BigText = require('ink-big-text')
const importJsx = require('import-jsx')

const Game = importJsx('./components/Game')

const App = ({name = 'Stranger'}) => (
	<Box alignItems='center'>
		<BigText text="TURDLE"/>
		<Game/>
	</Box>
);


module.exports = App;
