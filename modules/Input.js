
const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

const Keys = {
    rightPressed: false,
    leftPressed: false,
    downPressed: false,
    upPressed: false,
    shiftPressed: false,
    enterPressed: false,
    escapePressed: false,
    enterFull: false,
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
function keyDownHandler(event) {
    // console.log(event.keyCode);
    switch (event.keyCode) {
        case 39:

            Keys.rightPressed = true;
            break;
        case 37:
            Keys.leftPressed = true;
            break;
        case 40:
            Keys.downPressed = true;
            break;
        case 38:
            Keys.upPressed = true;
            break;
        case 16:
            Keys.shiftPressed = true;
            break;
        case 13:
            Keys.enterPressed = true;
            break;
        case 27:
            Keys.escapePressed = true;
            break;
    }
    //console.log(Keys.;

}
function keyUpHandler(event) {
    switch (event.keyCode) {
        case 39:
            //	console.log("ops");
            Keys.rightPressed = false;
            break;
        case 37:
            Keys.leftPressed = false;
            break;
        case 40:
            Keys.downPressed = false;
            break;
        case 38:
            Keys.upPressed = false;
            break;
        case 16:
            Keys.shiftPressed = false;
            break;
        case 13:
            Keys.enterPressed = false;
            Keys.enterFull = true;
            break;
        case 27:
            Keys.escapePressed = false;
            break;
    }
    //console.log(Keys.;
}

function GetJoystickPos() {

    let joy = {
        direction: NONE
    };

    if (Keys.upPressed) {
        joy.direction = UP;
    }
    if (Keys.downPressed) {
        joy.direction = DOWN;
    }
    if (Keys.leftPressed) {
        joy.direction = LEFT;
    }
    if (Keys.rightPressed) {
        joy.direction = RIGHT;
    }
    if (Keys.shiftPressed) {
        joy.fireButtonDown = true;
    }
    //console.log(joy.direction);
    //vdebug("joy", joy);
    return joy;
}

export { Keys, GetJoystickPos }