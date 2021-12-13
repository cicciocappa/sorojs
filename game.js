const CharTexture = (char) => {
    const chars = "0123456789:;=*,/ ABCDEFGHIJKLMNOPQRSTUVWXYZ(^)+_";
    return text[104 + chars.indexOf(char)];
}

const WriteLine = (str, parent, pos, color = 0XFFFFFF) => {
    //;
    for (let i = 0; i < str.length; i++) {
        parent.children[20 * pos + i].texture = CharTexture(str.charAt(i));
        parent.children[20 * pos + i].tint = color;
    }
}
/*
// unused for now
const ClearLine = (parent, pos) => {

}
const PutString = (str, parent, x, y, color = 0xFFFFFF) => {

}
*/

const sfx = {
    intro: new Howl({
        src: ['assets/audio/intro.wav'], loop: true, onend: function () {
            intro_timer++;
            if (intro_timer === 2) {
                demo_mode = true;
                SetNewGame();
                SetStartingState();

            }
        }
    }),
    passo_vuoto: new Howl({ src: ['assets/audio/passo_vuoto.wav'] }),
    passo_dirt: new Howl({ src: ['assets/audio/passo_dirt.wav'] }),
}

// GAME STATES
/***************************************** */
const LOADING = 0;
const READY = 1;
const INTRO = 2;
const STARTING = 3;
const RUNNING = 4;
const ENDING = 5;
const DEAD = 6;
const OVER = 7;

/**************************************** */

// GLOBALS
let tick = 0;
let frame_counter = 0;
let demo_mode = false;
let intro_timer = 0;
let lives = 3;
let level = 1;
let cave = 0;

let input = {
    rightPressed: false,
    leftPressed: false,
    downPressed: false,
    upPressed: false,
    shiftPressed: false,
    enterPressed: false,
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
function keyDownHandler(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 39:

            input.rightPressed = true;
            break;
        case 37:
            input.leftPressed = true;
            break;
        case 40:
            input.downPressed = true;
            break;
        case 38:
            input.upPressed = true;
            break;
        case 16:
            input.shiftPressed = true;
            break;
        case 13:
            input.enterPressed = true;
            break;
    }
    //console.log(input);

}
function keyUpHandler(event) {
    switch (event.keyCode) {
        case 39:
            //	console.log("ops");
            input.rightPressed = false;
            break;
        case 37:
            input.leftPressed = false;
            break;
        case 40:
            input.downPressed = false;
            break;
        case 38:
            input.upPressed = false;
            break;
        case 16:
            input.shiftPressed = false;
            break;
        case 13:
            input.enterPressed = false;
            break;
    }
    //console.log(input);
}

function GetJoystickPos() {

    let joy = {
        direction: NONE
    };

    if (input.upPressed) {
        joy.direction = UP;
    }
    if (input.downPressed) {
        joy.direction = DOWN;
    }
    if (input.leftPressed) {
        joy.direction = LEFT;
    }
    if (input.rightPressed) {
        joy.direction = RIGHT;
    }
    if (input.shiftPressed) {
        joy.fireButtonDown = true;
    }
    //console.log(joy.direction);
    //vdebug("joy", joy);
    return joy;
}

const ReadyClicked = () => {
    console.log("ready clicked");
    app.view.removeEventListener("click", ReadyClicked);
    SetIntroState();
}

const SetReadyState = () => {
    //        "01234567890123456789"
    WriteLine("     GAME READY     ", info, 0);
    WriteLine("   CLICK TO START   ", info, 3, 0XCCCCFF);
    gamestate = READY;
    app.view.addEventListener("click", ReadyClicked);
}

const SetIntroState = () => {
    //console.log(text);

    // testo("CICCIOCAPPA PRESENTS".charAt(i))
    WriteLine("CICCIOCAPPA PRESENTS", hud, 0, 0XFFFF33);
    container.addChild(sfondo_titolo);
    container.addChild(titolo);
    titolo.y = 32;

    const introtext = ["   BY PETER LIEPA   ",
        "   WITH CHRIS GRAY  ",
        "PRESS BUTTON TO PLAY",
        "1 PLAYER  1 JOYSTICK",
        " CAVE: A  LEVEL: 1  "
    ]

    for (let i = 0; i < introtext.length; i++) {
        WriteLine(introtext[i], info, i);
    }

    info.children[60].tint = 0xFF00FF;
    info.children[70].tint = 0xFF00FF;
    info.children[87].tint = 0xFF00FF;
    info.children[97].tint = 0xFF00FF;


    intro_timer = 0;
    sfx.intro.play();
    gamestate = INTRO;
}
const SetNewGame = () => {
    lives = 3;
    level = 1;
    cave = 0;
    container.removeChild(titolo);
    container.removeChild(sfondo_titolo);
    app.stage.removeChild(info);
    container.y = 32;
    // creiamo gli sprites per il livello qui?
    // Sì, solo quelli visualizzati però!
    // ne vengono visualizzati 21x12
    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 21; x++) {
            const c = new PIXI.Sprite(text[7 + x + y]);
            c.x = 32 * x;
            c.y = 32 * y;
            c.anchor.set(0);
            container.addChild(c);
        }
    }
}
const SetStartingState = () => {
    tick = 0;
    gamestate = STARTING;
    sfx.intro.stop();
    // effetto sonoro start?
    WriteLine(`PLAYER 1, ${lives} M${lives > 1 ? 'E' : 'A'}N ${String.fromCharCode(65 + cave)}/${level} `, hud, 0);


}

const SetRunningState = () => {

    gamestate = RUNNING;
}

const UncoverScreen = (frame) => {
    if (frame < 69) {

    }
    if (frame === 69) {

    }
    /*
    loop 69 times
    foreach line in 1..22
        randomly choose a horizontal position on that line
        uncover that position
    end foreach 
    end loop 
    uncover entire screen
    */
}

const DemoMove = () => {
    /*
    This is the raw data used to play the "demo" that starts up after a certain amount of idle time on the splash screen. It's a recorded demo; Rockford makes the same moves on the same cave (Cave A, 1).
The format of the demo data is as follows. The low nybble of each byte indicates the direction that Rockford is to move ($0 = end of demo, $7 = Right, $B = Left, $D = Down, $E = Up, $F = no movement). The high nybble indicates the number of spaces (number of frames) to apply that movement. The demo finishes when it hits $00. So for example, $FF means no movement for 15 turns, $1E means move up one space, $77 means move right 7 spaces, etc.

FF FF 1E 77 2D 97 4F 2D 47 3E 1B 4F 1E B7 1D 27 
4F 6D 17 4D 3B 4F 1D 1B 47 3B 4F 4E 5B 3E 5B 4D 
3B 5F 3E AB 1E 3B 1D 6B 4D 17 4F 3D 47 4D 4B 2E 
27 3E A7 A7 1D 47 1D 47 2D 5F 57 4E 57 6F 1D 00
*/
}

const IncTick = () => {
    tick++;
    if (tick == 8) {
        tick = 0;
        frame_counter++;
        if (frame_counter == 8) {
            frame_counter = 0;
        }
    }
}

const GameLoop = (delta) => {
    //console.log(gamestate);
    switch (gamestate) {
        case INTRO:
            tick++;
            sfondo_titolo.y = 48 - (tick % 16);
            if (input.enterPressed) {
                demo_mode = false;
                SetNewGame();
                SetStartingState();
            }
            break;
        case STARTING:
            if (tick == 0) {
                Scan();
                UncoverScreen();
            }
            UpdateSprites();
            UpdateScreen();
            IncTick();
            break;
        case RUNNING:

            if (tick == 0) {
                Scan();
            }
            AnimateRockford();
            UpdateSprites();
            UpdateScreen();

            IncTick();

            break;
    }
}

// tile textures 
const text = [];
// game title sprite
let titolo;
// title background sprite
let sfondo_titolo;
// game state
let gamestate = LOADING;

// main PIXI app
const app = new PIXI.Application({
    width: 640,
    height: 400
});
document.body.appendChild(app.view);

// tiles container
const container = new PIXI.Container();
// header container
const hud = new PIXI.Container();
// info panel container
const info = new PIXI.Container();

app.stage.addChild(container);
app.stage.addChild(hud);
app.stage.addChild(info);
info.y = 320;

app.ticker.maxFPS = 60;

app.ticker.add(GameLoop);




const gameReady = (a, res) => {
    //console.log(res["titolo"].texture);

    titolo = new PIXI.Sprite(res['titolo'].texture);
    sfondo_titolo = new PIXI.Sprite(res['sfondo'].texture);
    let sheet = res['sprites'].spritesheet;
    for (let i = 0; i < 152; i++) {
        const texture = sheet.textures[`tex${i}`];
        text.push(texture);
    }

    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 20; i++) {

            const c = new PIXI.Sprite(text[120]);

            c.x = 32 * i;
            c.y = 16 * j;
            hud.addChild(c);
        }
    }

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 20; i++) {
            const c = new PIXI.Sprite(text[120]);

            c.x = 32 * i;
            c.y = 16 * j;
            info.addChild(c)
        }

    }

    SetReadyState();
}



const loader = PIXI.Loader.shared;
loader.add('sprites', 'assets/img/sheet.json').
    add('titolo', 'assets/img/titolo.png').
    add('sfondo', 'assets/img/sfondo_titolo.png');

loader.load(gameReady);

function Scan() {
    //console.log("scanning...");
    let i;

    for (i = 0; i < level.totalTiles; i++) {

        level.tiles[i].scanned = false;

    }
    // SPOSTARE IN UNA FUNZIONE UpdateGameStatus ?
    if (level.magicWallStatus === MAGIC_WALL_ON) {
        level.magicWallMillingTime--;
        if (level.magicWallMillingTime === 0) {
            level.magicWallStatus = MAGIC_WALL_EXPIRED;
        }
    }
    numberOfAmoebaFoundThisFrame = 0;
    atLeastOneAmoebaFoundThisFrameWhichCanGrow = false;
    let cf;
    for (i = 0; i < level.totalTiles; i++) {

        let ct = level.tiles[i];
        if (!ct.scanned) {
            //console.log(ct.object);
            switch (ct.type) {
                case BOULDER:
                case DIAMOND:
                    if (ct.attribute & FALLING) {
                        ScanFallingBoulder(i, ct.type);
                    } else {
                        ScanStationaryBoulder(i, ct.type);
                    }
                    break;
                case DIAMOND:
                    break;
                case EXPANDING_WALL:
                    break;
                case ROCKFORD:
                    //vdebug("rockford", GetObjectAtPosition(i));
                    ScanRockford(i);
                    break;
                case FIREFLY:
                    ScanFirefly(i, ct.attribute >> 8, FIREFLY);
                    break;
                case BUTTERFLY:
                    ScanFirefly(i, ct.attribute >> 8, BUTTERFLY);
                    break;
                case AMOEBA:
                    ScanAmoeba(i);
                    break;
                case EXPLOSION:
                    cf = ct.attribute >> 16;
                    cf++;
                    //vdebug("cf", cf);
                    ct.attribute = cf << 16;
                    if (cf == 4) {
                        PlaceObject(DIAMOND, STATIONARY, i);
                    }
                    if (cf == 9) {
                        PlaceObject(SPACE, 0, i);
                    }
                    break;
                case INBOX:
                    cf = ct.attribute >> 16;
                    cf++;
                    vdebug("cf", cf);
                    ct.attribute = cf << 16;
                    if (cf == 24) {
                        PlaceObject(ROCKFORD, 0, i);
                        RockfordLocation.x = i % level.width;
                        RockfordLocation.y = Math.floor(i / level.width);
                    }
                    break;
            }
            // probabilmente inutile
            ct.scanned = true;
        }

    }
    if (!atLeastOneAmoebaFoundThisFrameWhichCanGrow) {
        amoebaSuffocatedLastFrame = true;
    }
    totalAmoebaFoundLastFrame = numberOfAmoebaFoundThisFrame;
}
