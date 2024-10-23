# Dart Color Switcher

The **Dart Color Switcher** is a Visual Studio Code extension that helps developers quickly convert between different Dart color representations such as:

- Integer-based color to Hex (e.g., `Color(4281033611)` to `Color(0xFF2B638B)`)
- Hex color to ARGB (e.g., `Color(0xFF2B638B)` to `Color.fromARGB(255, 43, 99, 139)`)
- ARGB to Integer color (e.g., `Color.fromARGB(255, 43, 99, 139)` to `Color(4281033611)`)

The extension supports both a quick action and a command that can be triggered via keybindings.

## Features

- **Automatic Color Conversion**: Converts the nearest Dart color expression to another format based on its current representation.
- **Supported Color Representations**:
  - `Color(int)`
  - `Color(0x...)`
  - `Color.fromARGB(...)`
- **Quick Fix Integration**: Easily convert colors by hovering over a `Color()` expression and using the Quick Fix option.
- **Keyboard Shortcut**: Use a keyboard shortcut to trigger the conversion of the nearest color expression to the cursor.

## Usage

### 1. Quick Fix Action
The extension provides a Quick Fix action that allows you to convert Dart color expressions by placing the cursor near a `Color()` instance in your code.

- **Hover over a color expression** (e.g., `Color(0xFF2B638B)`) and you will see a light bulb icon appear.
- **Select the Quick Fix option** to convert the color to a different format.

### 2. Keyboard Shortcut
You can also use the keyboard shortcut to perform the same conversion action:

- **Windows/Linux**: `Ctrl + Shift + H`
- **macOS**: `Cmd + Shift + H`

Place the cursor near any `Color()` expression in your code and press the shortcut keys to convert the nearest color format.

### Supported Conversions

- **Integer to Hex**: Converts `Color(4281033611)` to `Color(0xFF2B638B)`.
- **Hex to ARGB**: Converts `Color(0xFF2B638B)` to `Color.fromARGB(255, 43, 99, 139)`.
- **ARGB to Integer**: Converts `Color.fromARGB(255, 43, 99, 139)` to `Color(4281033611)`.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for Dart Color Switcher.
4. Click Install to install the extension.

## Contributing
If you'd like to contribute to the project, feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
