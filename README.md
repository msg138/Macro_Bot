# Macro_Bot
A Macro Bot made using NodeJS, RobotJS, KeyPress, and GKM
This was made to allow me to easier test things, by having the computer complete the repetitive actions i normally would have to.

### Prerequisites
> npm install gkm --save
> npm install keypress --save
> npm install robotjs --save

### Authors
- **Michael George** - *Initial Work* - [MSG138](https://github.com/msg138)

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

### External Libraries Used
- GKM [NPM](https://www.npmjs.com/package/gkm)
- KeyPress [NPM](https://www.npmjs.com/package/keypress)
- RobotJS [NPM](https://www.npmjs.com/package/robotjs)

### Current Features
- Can create a set of actions that will be executed when the start key is pressed.
- These actions include
    - Move the mouse
    - Click the mouse (Left)
    - Press a key on the keyboard
    - Click the mouse (Right)
    - Wait for a color to change on the screen from selected color
    - Wait for a color to change on the screen to a selected color
    - Drag the mouse (While mouse button down)
    - Double Click mouse (Left)
    - Double Click mouse (Right)

### How to use
To start with a script loaded, run 'node bot.js <scriptname>' replacing <scriptname> with the name of the script.
> node bot.js script.json

To setup a script, you can use these keyboard shortcuts, which will translate to actions to be used by the script. These keys can be changed in the javascript file ['bot.js'](bot.js)
Some actions can use variable numbers. These can be entered anytime by pressed a number key, but will be reset if another key is pressed.
Actions:
- ACTION_MOVE - F1                  *Move the mouse to current mouse location*
- ACTION_CLICK - F2                 *Click the mouse at it's script location*
- ACTION_KEYPRESS - F3              *The next key pressed after this will be saved to be pressed when the script is run*
- ACTION_RIGHTCLICK - F4            *Click the mouse(Right) at it's script location*
- ACTION_COLORCHANGE - F5           *Store the position and current color*
- ACTION_COLORCHANGETO - F6         *Store the position and current color*
- ACTION_MOUSEDRAG - F7             *Drag the mouse to current mouse location*

Second set of actions Press The **'MORE'** key before these.
- ACTION_MOVERELATIVEALL - F1         *Makes all mouse movements relative to starting position*
- ACTION_DOUBLECLICK - F2           *Double click the mouse at it's location*
- ACTION_DOUBLERIGHTCLICK - F3      *Double click the mouse(right) at it's location*
- ACTION_REPEATACTION - F4          *Repeat the last action X times, where X is entered before action is added.*

Utility Keys
- REPEAT - F8                       *Used to toggle whether the script repeats or not*
- MORE - F9                         *Used to access more actions to have the script run*
- SAVE - F10                        *Save the script, default saved to bots.json*
- START / RESTART - F11             *Start a script that has been saved, if stopped earlier, it will restart*
- STOP - F12                        *Stop the current script. If no script is running, clears the current script*

You can close the program by pressing 'CTRL - C' in the terminal window of the application.
