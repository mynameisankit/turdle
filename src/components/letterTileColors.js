const WHITE = "white";
const GREEN = "green";
const YELLOW = "yellow";

function getLetterTileColor(letter, defaultColor) {
    if (letter === null) return WHITE;
    if (letter.correct) return GREEN;
    if (letter.exists) return YELLOW;
    return defaultColor;
}

export { getLetterTileColor };
