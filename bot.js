// Get mouse coordinates, used for designing scripts.

var robot = require("robotjs");
var keypress = require('keypress');
var fs = require("fs");
var gkm = require('gkm');
var script = {
    action: [],
    params: [],
    delay: [],
    currentStep: 0
};


/*/ Listen to all mouse events (click, pressed, released, moved, dragged)
gkm.events.on('mouse.*', function(data) {
	console.log(this.event + ' ' + data);
});*/

var SMOOTH_MOVE = true;

var SCRIPT_REPEAT = true;
var REPEAT_DELAY = 0;

var ACTION_MOVE = 0;
var ACTION_CLICK = 1;
var ACTION_KEYPRESS = 2;
var ACTION_RIGHTCLICK = 3;
var ACTION_COLORCHANGE = 4;
var ACTION_COLORCHANGETO = 5;
var ACTION_MOUSEDRAG = 6;
var ACTION_DOUBLECLICK = 7;
var ACTION_DOUBLERIGHTCLICK = 8;

// Must press CTRL in conjunction with this key.
var KACTION_QUIT = 'c';

var KACTION_MOVE = 'F1';
var KACTION_CLICK = 'F2';
var KACTION_KEYPRESS = 'F3';
var KACTION_RIGHTCLICK = 'F4';
var KACTION_COLORCHANGE = 'F5';
var KACTION_COLORCHANGETO = 'F6';
var KACTION_MOUSEDRAG = 'F7';
var KACTION_DOUBLECLICK = 'F8';
var KACTION_DOUBLERIGHTCLICK = 'F9';
var KSAVE = 'F10';
var KSTART = 'F11';
var KSTOP = 'F12';

var running = undefined;

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

    if(storeAction !== undefined){
        if(storeAction == ACTION_KEYPRESS)
            addAction(ACTION_KEYPRESS, [(data+"").toLowerCase()], getDelay());
        storeAction = undefined;
        return;
    }

    var mpos = robot.getMousePos();
    if(data == KACTION_MOVE)
        addAction(ACTION_MOVE, [mpos.x, mpos.y], getDelay())
    if(data == KACTION_CLICK)
        addAction(ACTION_CLICK, [], getDelay());
    if(data == KACTION_RIGHTCLICK)
        addAction(ACTION_RIGHTCLICK, [], getDelay());
    if(data == KACTION_KEYPRESS)
        storeAction = ACTION_KEYPRESS;
    if(data == KACTION_DOUBLECLICK)
        addAction(ACTION_DOUBLECLICK, [], getDelay());
    if(data == KACTION_DOUBLERIGHTCLICK)
        addAction(ACTION_DOUBLERIGHTCLICK, [], getDelay());
    if(data == KACTION_MOUSEDRAG)
        addAction(ACTION_MOUSEDRAG, [mpos.x, mpos.y], getDelay())
    if(data == KACTION_COLORCHANGE)
        addAction(ACTION_COLORCHANGE, [mpos.x, mpos.y, getMouseColor()], getDelay())
    if(data == KACTION_COLORCHANGETO)
        addAction(ACTION_COLORCHANGETO, [mpos.x, mpos.y, getMouseColor()], getDelay());
    if(data == KSAVE)
        saveScript("bots.js");    
    if(data == KSTART)
        restartScript();
    if(data == KSTOP)
        stopScript();
});
 
process.stdin.setRawMode(true);
process.stdin.resume();

function getDelay(){
    return 100;
}

function getMouseColor(){
    var mpos = robot.getMousePos();
    return robot.getPixelColor(mpos.x, mpos.y);
}


function addAction(a, p, d){
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

    switch(script.action[script.currentStep]){
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
            robot.keyTap(script.params[script.currentStep][0]);
            break;
        case ACTION_MOVE:
            if(SMOOTH_MOVE){
                robot.moveMouseSmooth(script.params[script.currentStep][0], script.params[script.currentStep][1]);
            }else
                robot.moveMouse(script.params[script.currentStep][0], script.params[script.currentStep][1]);
            break;
        case ACTION_MOUSEDRAG:
            robot.dragMouse(script.params[script.currentStep][0], script.params[script.currentStep][1]);
            break;
        case ACTION_COLORCHANGE:
            if(robot.getPixelColor(script.params[script.currentStep][0], script.params[script.currentStep][1]) != script.params[script.currentStep][2])
            {
                if(script.params[script.currentStep][3] !== undefined)
                    script.currentStep = script.params[script.currentStep][3] - 1;
            }else
                script.currentStep --;
            break;
        case ACTION_COLORCHANGETO:
            if(robot.getPixelColor(script.params[script.currentStep][0], script.params[script.currentStep][1]) == script.params[script.currentStep][2])
            {
                if(script.params[script.currentStep][3] !== undefined)
                    script.currentStep = script.params[script.currentStep][3] - 1;
            }else
                script.currentStep --;
            break;
    }

    running = setTimeout(function(){
        script.currentStep++;
        running = undefined;
        runScript();
    }, script.delay[script.currentStep]);
}

// Check if an argument was passed and load the script if so.
if(process.argv.length > 2){
    loadScript(process.argv[2]);
}