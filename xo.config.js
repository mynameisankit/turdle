import eslintConfigXoReact from 'eslint-config-xo-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	...eslintConfigXoReact(),
	{
		rules: {
			'no-unused-vars': ['error', {
				vars: 'all',
				args: 'none',
				caughtErrors: 'none',
				ignoreRestSiblings: true
			}]
		}
	}
]);
