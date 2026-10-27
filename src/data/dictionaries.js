import { readFileSync } from "node:fs";

function loadDictionary(fileName) {
    return JSON.parse(
        readFileSync(new URL(fileName, import.meta.url), "utf8"),
    );
}

const WORDS_DICTIONARY = loadDictionary("./words.json");
const ANSWERS_DICTIONARY = loadDictionary("./answers.json");

export { ANSWERS_DICTIONARY, WORDS_DICTIONARY };
