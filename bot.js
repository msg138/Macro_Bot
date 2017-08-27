// Get mouse coordinates, used for designing scripts
var test = undefined;
var fs = require("fs");
fs.exists("simpletest.js", function (exists) {
    if (exists) {
        test = require("./simpletest.js");
    }else
        test = false;
});

var robot = require("robotjs");
var keypress = require('keypress');
var fs = require("fs");
var gkm = require('gkm');

// TODO make an array of skripts with this object prototype.
var script = {
    action: [],
    params: [],
    delay: [],
    currentStep: 0
};

var currentScript = 0; // Store the current acting script.

/*/ Listen to all mouse events (click, pressed, released, moved, dragged)
gkm.events.on('mouse.*', function(data) {
	console.log(this.event + ' ' + data);
});*/

var SMOOTH_MOVE = true;

var CURRENT_DELAY = 100;

var SCRIPT_REPEAT = true;
var REPEAT_DELAY = 0;

var ACTION_MORE = -1;
// Will be used to access more actions available to the user.
var ACTION_MORE2 = -2;
var ACTION_MORE3 = -3;
var ACTION_MORE4 = -4;

var ACTION_MOVE = 0;
var ACTION_CLICK = 1;
var ACTION_KEYPRESS = 2;
var ACTION_RIGHTCLICK = 3;
var ACTION_COLORCHANGE = 4;
var ACTION_COLORCHANGETO = 5;
var ACTION_MOUSEDRAG = 6;
var ACTION_DOUBLECLICK = 7;
var ACTION_DOUBLERIGHTCLICK = 8;
// This action will make all moves in the script relative. (AFTER THIS ACTION IS ADDED) 
var ACTION_MOVERELATIVEALL = 9;
var ACTION_MOVERELATIVE = 10;
var ACTION_REPEAT = 11;

function stringAction(a){
    switch(a){
        case ACTION_MOVE:
            return "ACTION_MOVE";
        case ACTION_CLICK:
            return "ACTION_CLICK";
        case ACTION_KEYPRESS:
            return "ACTION_KEYPRESS";
        case ACTION_RIGHTCLICK:
            return "ACTION_RIGHTCLICK";
        case ACTION_COLORCHANGE:
            return "ACTION_COLORCHANGE";
        case ACTION_COLORCHANGETO:
            return "ACTION_COLORCHANGETO";
        case ACTION_MOUSEDRAG:
            return "ACTION_MOUSEDRAG";
        case ACTION_DOUBLECLICK:
            return "ACTION_DOUBLECLICK";
        case ACTION_DOUBLERIGHTCLICK:
            return "ACTION_DOUBLERIGHTCLICK";
        case ACTION_MOVERELATIVEALL:
            return "ACTION_MOVERELATIVEALL";
        case ACTION_MOVERELATIVE:
            return "ACTION_MOVERELATIVE";
        case ACTION_REPEAT:
            return "ACTION_REPEAT";
    }
}

// Must press CTRL in conjunction with this key.
var KACTION_QUIT = 'c';

// First set of actions
var KACTION_MOVE = 'F1';
var KACTION_CLICK = 'F2';
var KACTION_KEYPRESS = 'F3';
var KACTION_RIGHTCLICK = 'F4';
var KACTION_COLORCHANGE = 'F5';
var KACTION_COLORCHANGETO = 'F6';
var KACTION_MOUSEDRAG = 'F7';

// Toggle whether the script should repeat.
var KREPEAT = 'F8';

// use this to have access more actions to be used.
var KMORE = 'F9';

// Second set of actions
var KACTION_MOVERELATIVEALL = 'F1';
var KACTION_DOUBLECLICK = 'F2';
var KACTION_DOUBLERIGHTCLICK = 'F3';
var KACTION_REPEAT = 'F4';
var KACTION_DELAY = 'F5';

var KSAVE = 'F10';
var KSTART = 'F11';
var KSTOP = 'F12';

var running = undefined;

var currentNumber = 0;

var storeAction = undefined;
 
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  if (key) {
      if(key.name == KACTION_QUIT && key.ctrl){
          process.exit();
      }
  }
});
// Listen to all pressed key events
gkm.events.on('key.pressed', function(data) {
    console.log(this.event + ' ' + (data+"").toLowerCase());

    if((data+"").toLowerCase() === "left control"){
        return;
    }

    var num = parseInt(data);
    if(!isNaN(num)){
        currentNumber = currentNumber * 10;
        currentNumber += num;
        return;
    }

    var mpos = robot.getMousePos();

    if(storeAction !== undefined){
        if(storeAction == ACTION_KEYPRESS)
            addAction(ACTION_KEYPRESS, [(data+"").toLowerCase()], getDelay());
        if(storeAction == ACTION_MORE){
            if(data == KACTION_MOVERELATIVEALL)
                addAction(ACTION_MOVERELATIVEALL, [mpos.x, mpos.y], getDelay());
            if(data == KACTION_DOUBLECLICK)
                addAction(ACTION_DOUBLECLICK, [], getDelay());
            if(data == KACTION_DOUBLERIGHTCLICK)
                addAction(ACTION_DOUBLERIGHTCLICK, [], getDelay());
            if(data == KACTION_REPEAT)
                addAction(ACTION_REPEAT, [currentNumber], getDelay());
            if(data == KACTION_DELAY)
                CURRENT_DELAY = currentNumber;
            if(data == KMORE){
                storeAction = ACTION_MORE2;
                return;
            }
        }
        if(storeAction == ACTION_MORE2){

            if(data == KMORE){
                storeAction = ACTION_MORE3;
                return;
            }
        }
        if(storeAction == ACTION_MORE3){

            if(data == KMORE){
                storeAction = ACTION_MORE4;
                return;
            }
        }
        if(storeAction == ACTION_MORE4){
        }
        // Remove the storedaction.
        storeAction = undefined;
        return;
    }
    if(data == KMORE)
        storeAction = ACTION_MORE;
    if(data == KREPEAT)
        SCRIPT_REPEAT = !SCRIPT_REPEAT;
    if(data == KACTION_MOVE)
        addAction(ACTION_MOVE, [mpos.x, mpos.y], getDelay())
    if(data == KACTION_CLICK)
        addAction(ACTION_CLICK, [], getDelay());
    if(data == KACTION_RIGHTCLICK)
        addAction(ACTION_RIGHTCLICK, [], getDelay());
    if(data == KACTION_KEYPRESS)
        storeAction = ACTION_KEYPRESS;
    if(data == KACTION_MOUSEDRAG)
        addAction(ACTION_MOUSEDRAG, [mpos.x, mpos.y], getDelay())
    if(data == KACTION_COLORCHANGE)
        addAction(ACTION_COLORCHANGE, [mpos.x, mpos.y, getMouseColor()], getDelay())
    if(data == KACTION_COLORCHANGETO)
        addAction(ACTION_COLORCHANGETO, [mpos.x, mpos.y, getMouseColor()], getDelay());
    if(data == KSAVE)
        saveScript("bots.json");    
    if(data == KSTART){
        currentScript = currentNum;
        restartScript();
    }
    if(data == KSTOP)
        stopScript();

    // No number was pressed, reset the current Number variable.
    currentNumber = 0;
});
 
process.stdin.setRawMode(true);
process.stdin.resume();

function getDelay(){
    return CURRENT_DELAY;
}

function getMouseColor(){
    var mpos = robot.getMousePos();
    return robot.getPixelColor(mpos.x, mpos.y);
}
function addAction(a, p, d){
    if(a == ACTION_MOVE || a == ACTION_MOUSEDRAG){
        for(var i=0;i<script.action.length;i++){
            if(script.action[i] == ACTION_MOVERELATIVEALL){
                a = ACTION_MOVERELATIVE;
                p[0] = p[0] - script.params[i][0];
                p[1] = p[1] - script.params[i][1];
                break;
            }
        }
    }

    console.log("Adding action to script: " + a + "-" + stringAction(a) + " with params "+ p +" , after " + d + " mills");

    script.action.push(a);
    script.params.push(p);
    script.delay.push(d);
}

function clearScript(){
    script.action = [];
    script.params = [];
    script.delay = [];
    script.currentStep = 0;
}

function saveScript(fn){
    console.log("Saving script: " + fn);
    fs.writeFile(fn, JSON.stringify(script), (err) =>{
        if(err) throw err;
        console.log("File saved! as " + fn);
    });
}
function loadScript(fn){
    if(script.action.length > 0){
        console.log("Removing previous script...");
        clearScript();
    }
    console.log("Loading script: " + fn);
    fs.readFile(fn, (err, data) =>{
        if(err) throw err;
        try{
            setCurrentScript(data);
        }catch(e){
            console.log("Could not load file: " + e);
        }
        console.log("Script loaded." + data);
    });
}

function restartScript(){
    console.log("Starting script!!");
    if(running !== undefined)
        clearTimeout(running);
    running = undefined;
    script.currentStep = 0;
    runScript();
}
function stopScript(){
    if(running !== undefined)
        clearTimeout(running);
    else
        {
            console.log("Clearing script");
            clearScript();
        }
    running = undefined;

    console.log("Script stopped.");
}

function setCurrentScript(json){
    if(true){ // assume that all scripts are strings from now on.
        console.log("Converting json");
        json = JSON.parse(json);
    }else
        console.log("Setting direct script object.");
    script = json;
    console.log("script set : "+script);
}

function runScript(){

    if(script.currentStep >= script.action.length){
        if(SCRIPT_REPEAT == true)
            script.currentStep = 0;
        else
            return;
        setTimeout(runScript, REPEAT_DELAY);
        return;
    }
    runAction(script.currentStep);
    running = setTimeout(function(){
        script.currentStep++;
        running = undefined;
        runScript();
    }, script.delay[script.currentStep]);
}

function runAction(cs){
    console.log("executing action: " + script.action[cs] + "-"+stringAction(script.action[cs]));
    var mpos = robot.getMousePos();
    switch(script.action[cs]){
        case ACTION_REPEAT:
            if(cs <= 0)
                break;
            for(var i=0;i<script.params[cs][0];i++)
                runAction(cs-1);
            break;
        case ACTION_CLICK:
            robot.mouseClick();
            break;
        case ACTION_RIGHTCLICK:
            robot.mouseClick('right');
            break;
        case ACTION_DOUBLECLICK:
            robot.mouseClick('left', true);
            break;
        case ACTION_DOUBLERIGHTCLICK:
            robot.mouseClick('right', true);
            break;
        case ACTION_KEYPRESS:
            robot.keyTap(script.params[cs][0]);
            break;
        case ACTION_MOVE:
            if(SMOOTH_MOVE){
                robot.moveMouseSmooth(script.params[cs][0], script.params[cs][1]);
            }else
                robot.moveMouse(script.params[cs][0], script.params[cs][1]);
            break;
        case ACTION_MOVERELATIVE:
            if(SMOOTH_MOVE){
                robot.moveMouseSmooth(mpos.x + script.params[cs][0], mpos.y + script.params[cs][1]);
            }else
                robot.moveMouse(mpos.x + script.params[cs][0], mpos.y + script.params[cs][1]);
            break;
        case ACTION_MOUSEDRAG:
            robot.dragMouse(script.params[cs][0], script.params[cs][1]);
            break;
    }
}


// Check if an argument was passed and load the script if so.
if(process.argv.length > 2){
    loadScript(process.argv[2]);
}

if(process.argv.length > 3){
    for(var i=0;i<process.argv.length-3;i++)
        switch(process.argv[i+3]){
            case "--autostart":
                restartScript();
                break;
            case "--norepeat":
                SCRIPT_REPEAT = false;
                break;
        }
}