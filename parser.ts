export const enum Tokens {
	NAME = "nam",
	ASSIGNMENT = "ass",
	NUMBER = "num",

	// Operators
	OPERATOR_ADD = "add",
}

export interface Token {
	type: Tokens;
	value?: string;
}

function tokenizeLine(contents: string, lineNr: number) {
	const tokens: Token[] = [];
	let cursor = 0;

	while (cursor < contents.length) {
		let char = contents[cursor];

		if (char === "+") {
			cursor++;
			tokens.push({ type: Tokens.OPERATOR_ADD });
			continue;
		}

		if (char === "(" || char === ")" || char === "," || char === "{" || char === "}") {
			cursor++;
			continue;
		}

		if (char === "/") {
			const peek = contents[cursor + 1];

			// A comment
			if (peek === "/") {
				return tokens;
			}
		}

		if (char === "=") {
			const peek = contents[cursor + 1];

			switch (true) {
				case peek === "=": {
					// evaluation
					break;
				}

				default: {
					tokens.push({
						type: Tokens.ASSIGNMENT,
						value: "=",
					});

					cursor++;
					continue;
				}
			}
		}

		if (/\s/.test(char)) {
			cursor++;
			continue;
		}

		const numbers = /[0-9]/;
		if (numbers.test(char)) {
			let value = "";

			while (numbers.test(char)) {
				value += char;
				char = contents[++cursor];
			}

			tokens.push({
				type: Tokens.NUMBER,
				value,
			});

			continue;
		}

		const letters = /[a-z_]/i;
		if (letters.test(char)) {
			let value = "";

			while (char && letters.test(char)) {
				value += char;
				char = contents[++cursor];
			}

			tokens.push({
				type: Tokens.NAME,
				value,
			});

			continue;
		}

		throw new TypeError(`stupid baka syntax error at ${char} on line ${lineNr}`);
	}

	return tokens;
}

export function parse(file: string) {
	const lines = file.split("\n");

	const tokens: Token[] = [];

	for (let line = 1; line <= lines.length; line++) {
		const contents = lines[line - 1];
		const lineTokens = tokenizeLine(contents, line);
		tokens.push(...lineTokens);
	}

	return tokens;
}
