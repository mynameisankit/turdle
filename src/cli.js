#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import meow from "meow";

import "tsx/esm";

const { default: UI } = await import("./ui.jsx");
const CLI = meow(
    `
	Usage
	  $ turdle
`,
    { importMeta: import.meta },
);

render(React.createElement(UI, CLI.flags));
