import { Sprites } from './Sprites.js';
import { Textures } from './Textures.js';
import { DOM } from './DOM.js';
import * as Input from './Input.js';
import { caves } from './Caves.js';

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

const LOADING = 0;
const READY = 1;
const INTRO = 2;
const STARTING = 3;
const RUNNING = 4;
const ENDING = 5;
const DEAD = 6;
const OVER = 7;

// attributes
const NONE = 0;
const STATIONARY = 0;
const FALLING = 1;
const ROLLING_LEFT = 2;
const ROLLING_RIGHT = 4;
const MOVING_LEFT = 16;
const MOVING_RIGHT = 64;
const MOVING_UP = 8;
const MOVING_DOWN = 32;
const DIRECTION_UP = 256;
const DIRECTION_LEFT = 512;
const DIRECTION_DOWN = 768;
const DIRECTION_RIGHT = 1024;

// level attributes
const MAGIC_WALL_OFF = 0;
const MAGIC_WALL_ON = 1;
const MAGIC_WALL_EXPIRED = 2;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 22;
const NUM_TILES = MAP_WIDTH * MAP_HEIGHT;



const FACING_LEFT = 0;
const FACING_RIGHT = 1;
const TILE_SIZE = 32;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

// object
const SPACE = 0;
const DIRT = 1;
const BOULDER = 2;
const DIAMOND = 3;
const EXPANDING_WALL = 4;
const ROCKFORD = 5;
const FIREFLY = 6;
const BUTTERFLY = 7;
const AMOEBA = 8;
const BRICK_WALL = 9;
const STEEL_WALL = 10;
const MAGIC_WALL = 11;
const INBOX = 12;
const OUTBOX = 13;
const SLIME = 14;
const EXPLOSION = 15;

// animations
const animazioniEsplosione = [3, 4, 5, 6, 0, 20, 21, 20, 19];
const animazioneInbox = [7, 17, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 19, 20, 21, 9];

let attributes = [];

attributes[SPACE] = {
    rounded: false,
    texture: 16
};
attributes[DIRT] = {
    rounded: false,
    texture: 11
};
attributes[BOULDER] = {
    rounded: true,
    texture: 10
};
attributes[DIAMOND] = {
    rounded: true,
    texture: 40,
    animated: true
};
attributes[BRICK_WALL] = {
    rounded: true,
    texture: 1
};
attributes[STEEL_WALL] = {
    rounded: false,
    texture: 7
};
attributes[ROCKFORD] = {
    rounded: false,
    texture: 9,
    impactExplosive: true
};
attributes[FIREFLY] = {
    rounded: false,
    texture: 32,
    animated: true,
    impactExplosive: true
};
attributes[BUTTERFLY] = {
    rounded: false,
    texture: 48,
    animated: true,
    impactExplosive: true
};
attributes[EXPLOSION] = {
    rounded: false,
    texture: 2
};
attributes[AMOEBA] = {
    rounded: false,
    animated: true,
    texture: 24
};
attributes[INBOX] = {
    rounded: false,
    texture: 2
};
attributes[OUTBOX] = {
    rounded: false,
    texture: 7
};
attributes[MAGIC_WALL] = {
    rounded: false,
    texture: 1
}

let tick = 0;
let state = LOADING;
let intro_timer = 0;
let demo_mode = false;
let lives;
let cave;
let round;
let RockfordLocation = {
    x: 0,
    y: 0
};

let ContainerLocation = {
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0
};

let numRoundsSinceRockfordSeenAlive = 0;
let RockfordAnimationFacingDirection = NONE;
let RockfordMoving = false;
let RockfordMovement = NONE;
let RockfordSprite = 9;
let RockfordFrame = 0;
let Tapping = false;
let Blinking = false;

let numberOfAmoebaFoundThisFrame = 0;
let totalAmoebaFoundLastFrame = 0;
let amoebaSuffocatedLastFrame = false;
let atLeastOneAmoebaFoundThisFrameWhichCanGrow = false;
let anAmoebaRandomFactor = 0.25;
let magicWallStatus = MAGIC_WALL_OFF;

const CurrentPlayerData = {
    score: 0,
    currentDiamondValue: 20,
    diamondsCollected: 0,
    gotEnoughDiamonds: false
}

const level = {
    tiles: [],
    magicWallMillingTime: 0,
    diamond_point:0,
    extra_point:0,
    diamond_needed:0,
    cave_time:0,


};

function Parse(layout){
    const transl = {
        " ": {
            type: SPACE,
            attrib: NONE
        },
        "W": {
            type: STEEL_WALL,
            attrib: NONE
        },
        ".": {
            type: DIRT,
            attrib: NONE
        },
        "w": {
            type: BRICK_WALL,
            attrib: NONE
        },
        "R": {
            type: ROCKFORD,
            attrib: NONE
        },
        "r": {
            type: BOULDER,
            attrib: STATIONARY
        },
        "d": {
            type: DIAMOND,
            attrib: STATIONARY
        },
        "F": {
            type: FIREFLY,
            attrib: DIRECTION_LEFT
        },
        "B": {
            type: BUTTERFLY,
            attrib: DIRECTION_DOWN
        },
        "A": {
            type: AMOEBA,
            attrib: NONE
        },
        "X": {
            type: INBOX,
            attrib: NONE
        },
        "P": {
            type: OUTBOX,
            attrib: NONE
        },
        "G": {
            type: MAGIC_WALL,
            attrib: NONE
        }
    };
    
    let rows = layout.split("\n");
    let tiles=[];
    for (let j = 0; j < MAP_HEIGHT; j++) {
        for (let i = 0; i < MAP_WIDTH; i++) {
            let n = j * MAP_WIDTH + i;
           // console.log(testmap[j].charAt(i), transl[testmap[j].charAt(i)])
            tiles[n] = {
                type: transl[rows[j].charAt(i)].type,
                attribute: transl[rows[j].charAt(i)].attrib,
                scanned: false
            };
            
            if (level.tiles[n].type == INBOX) {
                RockfordLocation.x = i;
                RockfordLocation.y = j;
            }
    
        }
    }
    return tiles;
    
}

function Ready() {
    const res = Textures.loader.resources;

    Sprites.Create('titolo', res['titolo'].texture);
    Sprites.Create('sfondo_titolo', res['sfondo'].texture);
    let sheet = res['sprites'].spritesheet;
    for (let i = 0; i < 152; i++) {
        const texture = sheet.textures[`tex${i}`];
        Textures.tx.push(texture);
    }

    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 20; i++) {

            const c = new PIXI.Sprite(Textures.tx[120]);

            c.x = 32 * i;
            c.y = 16 * j;
            Sprites.hud.addChild(c);
        }
    }

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 20; i++) {
            const c = new PIXI.Sprite(Textures.tx[120]);

            c.x = 32 * i;
            c.y = 16 * j;
            Sprites.info.addChild(c)
        }

    }

    SetReadyState();
}

function SetReadyState() {
    //        "01234567890123456789"
    Sprites.WriteLine("     GAME READY     ", Sprites.info, 0);
    Sprites.WriteLine("   CLICK TO START   ", Sprites.info, 3, 0XCCCCFF);
    state = READY;
    DOM.view.addEventListener("click", ReadyClicked);
}

function ReadyClicked() {
    console.log("ready clicked");
    DOM.view.removeEventListener("click", ReadyClicked);
    SetIntroState();
}

function SetIntroState() {
    //console.log(text);

    // testo("CICCIOCAPPA PRESENTS".charAt(i))
    Sprites.WriteLine("CICCIOCAPPA PRESENTS", Sprites.hud, 0, 0XFFFF33);
    Sprites.container.addChild(Sprites.sp["sfondo_titolo"]);
    Sprites.container.addChild(Sprites.sp["titolo"]);
    Sprites.sp["titolo"].y = 32;

    const introtext = ["   BY PETER LIEPA   ",
        "   WITH CHRIS GRAY  ",
        "PRESS BUTTON TO PLAY",
        "1 PLAYER  1 JOYSTICK",
        " CAVE: A  LEVEL: 1  "
    ]

    for (let i = 0; i < introtext.length; i++) {
        Sprites.WriteLine(introtext[i], Sprites.info, i);
    }

    Sprites.info.children[60].tint = 0xFF00FF;
    Sprites.info.children[70].tint = 0xFF00FF;
    Sprites.info.children[87].tint = 0xFF00FF;
    Sprites.info.children[97].tint = 0xFF00FF;


    intro_timer = 0;
    sfx.intro.play();
    state = INTRO;
}

const SetNewGame = () => {
    lives = 3;
    round = 1;
    cave = 0;
    Sprites.container.removeChild(Sprites.sp["titolo"]);
    Sprites.container.removeChild(Sprites.sp["sfondo_titolo"]);
    DOM.stage.removeChild(Sprites.info);
    Sprites.container.y = 32;
    // creiamo gli sprites per il livello qui?
    // Sì, solo quelli visualizzati però!
    // ne vengono visualizzati 21x12
    for (let y = 0; y < 22; y++) {
        for (let x = 0; x < 40; x++) {
            const c = new PIXI.Sprite(Textures.tx[7 + x + y]);
            c.x = 32 * x;
            c.y = 32 * y;
            c.anchor.set(0);
            Sprites.container.addChild(c);
        }
    }
}
const SetStartingState = () => {
    tick = 0;
    state = STARTING;
    sfx.intro.stop();
    // effetto sonoro start?
    Sprites.WriteLine(`PLAYER 1, ${lives} M${lives > 1 ? 'E' : 'A'}N ${String.fromCharCode(65 + cave)}/${round} `, Sprites.hud, 0);
    let cl = caves[cave].layout.split("\n");
    console.log(cl[0].length, cl.length);
    // inizializzo variabili di livello
    level.tiles = Parse(caves[cave].layout);
    level.magicWallMillingTime = caves[cave].amoeba_wall_time;
    level.diamond_point = caves[cave].diamond_point;
    level.extra_point = caves[cave].extra_point;
    level.diamond_needed = caves[cave].diamond_needed[round - 1];
    level.cave_time = caves[cave].cave_time[round - 1];
    // inizializzo variabili di gioco
    numberOfAmoebaFoundThisFrame = 0;
    totalAmoebaFoundLastFrame = 0;
    amoebaSuffocatedLastFrame = false;
    atLeastOneAmoebaFoundThisFrameWhichCanGrow = false;
    anAmoebaRandomFactor = 0.25;
    magicWallStatus = MAGIC_WALL_OFF;


}

const SetRunningState = () => {

    gamestate = RUNNING;
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

const Loop = (delta) => {
    //console.log(gamestate);
    switch (state) {
        case INTRO:
            tick++;
            Sprites.sp["sfondo_titolo"].y = 48 - (tick % 16);
            if (Input.Keys.enterPressed) {
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


function Scan() {
    //console.log("scanning...");
    let i;

    for (i = 0; i < NUM_TILES; i++) {

        level.tiles[i].scanned = false;

    }
    // SPOSTARE IN UNA FUNZIONE UpdateGameStatus ?
    if (magicWallStatus === MAGIC_WALL_ON) {
        level.magicWallMillingTime--;
        if (level.magicWallMillingTime === 0) {
            magicWallStatus = MAGIC_WALL_EXPIRED;
        }
    }
    numberOfAmoebaFoundThisFrame = 0;
    atLeastOneAmoebaFoundThisFrameWhichCanGrow = false;
    let cf;
    for (i = 0; i < NUM_TILES; i++) {

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

export { Ready, Loop };