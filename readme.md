# Turdle

> Wordle for your command line.

![Turdle demo](https://raw.githubusercontent.com/mynameisankit/turdle/main/media/demo.gif)

Turdle is a terminal word game. Guess the five-letter answer in six tries. After each guess, the tiles show which letters are correct and which letters appear elsewhere in the answer.

## Requirements

- Node.js `22.20.0` or newer in the supported Node.js release lines (`22.20+`, `24.12+`, or `26+`).

## Install and play

Install Turdle globally with npm:

```sh
npm install --global turdle
turdle
```

Or run it once without a global install:

```sh
npx turdle
```

## How to play

Enter a valid five-letter word and press **Enter**. You have six guesses to find the answer. Green tiles mark letters in the correct position; yellow tiles mark letters in the answer but in another position.

### Keyboard shortcuts

- **Esc**: leave the current page or exit the game.
- **Ctrl + S**: view statistics after a game ends.
- **Ctrl + X**: copy and share your progress after a game ends.

## Error recovery

If saved progress cannot be loaded, Turdle starts a fresh in-memory game and displays a warning. If saving a guess fails, the guess stays on screen so you can press **Enter** to retry. Statistics and clipboard errors are reported separately and do not discard a saved guess.

## Run from source

```sh
git clone https://github.com/mynameisankit/turdle.git
cd turdle
yarn install
yarn test
```

The `test` script launches the terminal game locally.

## Development

The project uses ES modules and JSX. Its terminal interface is built with React and Ink. Source code is organized under `src/app`, `src/components`, `src/context`, `src/data`, `src/game`, and `src/screens`.

## License

MIT
