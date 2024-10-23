import * as vscode from 'vscode';

// Utility functions to handle color conversions
const colorUtils = {
	intToHexColor(value: number): string {
		return `0x${value.toString(16).toUpperCase()}`;
	},
	hexToARGB(hex: string): string {
		const intValue = parseInt(hex.replace('0x', ''), 16);
		const a = (intValue >> 24) & 0xFF;
		const r = (intValue >> 16) & 0xFF;
		const g = (intValue >> 8) & 0xFF;
		const b = intValue & 0xFF;
		return `Color.fromARGB(${a}, ${r}, ${g}, ${b})`;
	},
	argbToInt(a: number, r: number, g: number, b: number): string {
		const intValue = ((a & 0xFF) << 24) | ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
		return `${intValue >>> 0}`;  // Ensure unsigned 32-bit integer
	}
};

// Shared function to find and convert the nearest color to the cursor
function findAndConvertNearestColor(text: string, cursorIndex: number): { newText: string, matchRange: vscode.Range | null } {
	const intColorRegex = /Color\((\d+)\)/g;
	const hexColorRegex = /Color\(0x([0-9A-F]+)\)/g;
	const argbColorRegex = /Color\.fromARGB\((\d+), (\d+), (\d+), (\d+)\)/g;

	let nearestMatch: RegExpExecArray | null = null;
	let matchRange: vscode.Range | null = null;
	let newText = '';
	let minDistance = Infinity;

	// Helper function to check each regex for a match and calculate the closest one
	const checkMatches = (regex: RegExp, converter: (match: RegExpExecArray) => string) => {
		let match;
		while ((match = regex.exec(text)) !== null) {
			const start = match.index;
			const end = regex.lastIndex;
			const distance = Math.abs(cursorIndex - start); // Calculate distance from cursor to match
			if (distance < minDistance) {
				minDistance = distance;
				nearestMatch = match;
				matchRange = new vscode.Range(0, start, 0, end);  // We'll adjust the line dynamically later
				newText = converter(match); // Get the new converted text
			}
		}
	};

	// Check for Color(int)
	checkMatches(intColorRegex, (match) => {
		const colorInt = parseInt(match[1], 10);
		return `Color(${colorUtils.intToHexColor(colorInt)})`;
	});

	// Check for Color(0x...)
	checkMatches(hexColorRegex, (match) => {
		const hexColor = `0x${match[1]}`;
		return colorUtils.hexToARGB(hexColor);
	});

	// Check for Color.fromARGB(...)
	checkMatches(argbColorRegex, (match) => {
		const a = parseInt(match[1], 10);
		const r = parseInt(match[2], 10);
		const g = parseInt(match[3], 10);
		const b = parseInt(match[4], 10);
		return `Color(${colorUtils.argbToInt(a, r, g, b)})`;
	});

	return { newText, matchRange };
}

// Quick fix provider
class DartColorSwitcherActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
		const line = document.lineAt(range.start.line);
		const text = line.text;
		const cursorIndex = range.start.character;

		const { newText, matchRange } = findAndConvertNearestColor(text, cursorIndex);

		if (matchRange && newText) {
			const action = this.createFix(document, new vscode.Range(line.lineNumber, matchRange.start.character, line.lineNumber, matchRange.end.character), newText);
			return [action];
		}

		return [];
	}

	private createFix(document: vscode.TextDocument, range: vscode.Range, newText: string): vscode.CodeAction {
		const fix = new vscode.CodeAction(`Convert to ${newText}`, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, range, newText);
		return fix;
	}
}

// Command registration
export function activate(context: vscode.ExtensionContext) {
	const switchColorCommand = vscode.commands.registerCommand('dartColorSwitcher.switch', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const position = editor.selection.active;  // Use cursor position
		const line = document.lineAt(position.line);
		const text = line.text;
		const cursorIndex = position.character;

		const { newText, matchRange } = findAndConvertNearestColor(text, cursorIndex);

		// Apply the nearest match if one is found
		if (newText && matchRange) {
			editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(line.lineNumber, matchRange.start.character, line.lineNumber, matchRange.end.character), newText);
			});
		}
	});

	// Register the quick action provider
	const dartColorSwitcherActionProvider = vscode.languages.registerCodeActionsProvider('dart', new DartColorSwitcherActionProvider(), {
		providedCodeActionKinds: DartColorSwitcherActionProvider.providedCodeActionKinds
	});

	context.subscriptions.push(switchColorCommand, dartColorSwitcherActionProvider);
}

export function deactivate() { }
