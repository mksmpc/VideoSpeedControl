# Video Speed Control

Extention for browsers, that provide control on video speed by hotkeys.

## Installation

1. Install [Tampermonkey] extention in yor browser
2. Press `+` tab in Tampermonkey (Create new script)
3. Replace default text on text from [script]
4. Press `Ctrl + S`
5. Profit

[tampermonkey]: https://www.tampermonkey.net/
[script]: /videoSpeedControl.js


## Usage

1. Start playing video
2. Press `Ctrl + >` for speed up
3. Press `Ctrl + <` for speed down

### Default speed settings:
- Min speed: **0.5**
- Max speed: **3.0**
- Speed Step: **0.25**

For edit this values change vars at [beginning of the script][speedSettings].

[speedSettings]: /videoSpeedControl.js#L13
