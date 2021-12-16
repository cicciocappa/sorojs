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
let frame_counter = 0;
let uncover_counter = 0;
let state = LOADING;
let intro_timer = 0;
let demo_mode = false;
let lives;
let cave;
let round;
let sprites;
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
    diamond_point: 0,
    extra_point: 0,
    diamond_needed: 0,
    cave_time: 0,


};

function Parse(layout) {
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
    let tiles = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
        for (let i = 0; i < MAP_WIDTH; i++) {
            let n = j * MAP_WIDTH + i;
            //console.log(rows[j].charAt(i), transl[rows[j].charAt(i)])
            tiles[n] = {
                type: transl[rows[j].charAt(i)].type,
                attribute: transl[rows[j].charAt(i)].attrib,
                covered: true,
                scanned: false
            };

            if (tiles[n].type == INBOX) {
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
    // resettare gli sprites ad inizio gioco?
    sprites = [];
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
            const c = new PIXI.Sprite(Textures.tx[7]);
            c.x = 32 * x;
            c.y = 32 * y;
            c.anchor.set(0);
            Sprites.container.addChild(c);
            sprites.push(c);
        }
    }
}
const SetStartingState = () => {
    tick = 0;
    frame_counter = 0;
    uncover_counter = 0;
    state = STARTING;
    sfx.intro.stop();
    // effetto sonoro start?
    Sprites.WriteLine(`PLAYER 1, ${lives} M${lives > 1 ? 'E' : 'A'}N ${String.fromCharCode(65 + cave)}/${round} `, Sprites.hud, 0);
    let cl = caves[cave].layout.split("\n");
    console.log(cl[0].length, cl.length);
    // inizializzo variabili di livello
    level.tiles = Parse(caves[cave].layout);
    //console.log(level.tiles);
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

    state = RUNNING;
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
    //console.log(state);
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
                
            }
            if (tick%4==0){
                UncoverScreen(uncover_counter);
                uncover_counter++;
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

function UncoverScreen(frame) {
    console.log(frame);
    if (frame < 69) {
        for (let y=0;y<22;y++){
            let x = Math.floor(Math.random()*40);
            level.tiles[y*MAP_WIDTH+x].covered = false;
        }

    }
    if (frame === 69) {
        console.log("UNCOVER")
        for (let i = 0; i < NUM_TILES; i++) {
            //sprites[i].texture = Textures.tx[attributes[level.tiles[i].type].texture];
            level.tiles[i].covered = false;
        }
        SetRunningState();
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
                    ////vdebug("rockford", GetObjectAtPosition(i));
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
                    ////vdebug("cf", cf);
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
                    //vdebug("cf", cf);
                    ct.attribute = cf << 16;
                    if (cf == 24) {
                        PlaceObject(ROCKFORD, 0, i);
                        RockfordLocation.x = i % MAP_WIDTH;
                        RockfordLocation.y = Math.floor(i / MAP_WIDTH);
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

function GetObjectAtPosition(pos) {
    return level.tiles[pos];
}

function PlaceObject(object, attrib, pos) {
    //if (object==2)console.log("imposto ",object, " in posizione ",pos," con attrib ",attrib);
    level.tiles[pos].type = object;
    level.tiles[pos].attribute = attrib;
    level.tiles[pos].scanned = true;
}

function ScanStationaryBoulder(pos, type) {
    //console.log("stat boulder");
    //Local variables
    let NewPosition;
    let theObjectBelow;
    let boulderPosition = pos
    // If the boulder can fall, move it down and mark it as falling.
    // NewPosition = GetRelativePosition(boulderPosition, down1);
    NewPosition = pos + MAP_WIDTH;
    theObjectBelow = GetObjectAtPosition(NewPosition);
    //	theObjectBelow = level.tiles[y+1][x].object;
    if (theObjectBelow.type == SPACE) {
        PlaceObject(type, FALLING, NewPosition);
        PlaceObject(SPACE, NONE, boulderPosition);
        //    RequestSound(boulderSound); // yes, even when it starts falling. This applies to diamonds too (requests diamondSound).
    } else {
        // Failing that, see if the boulder can roll
        if (CanRollOff(theObjectBelow)) {
            //console.log("posso rotolare stat...");
            // Try rolling left
            // NewPosition = GetRelativePosition(boulderPosition, left1);
            NewPosition = pos - 1;
            if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + MAP_WIDTH - 1).type == SPACE)) {
                PlaceObject(type, FALLING | ROLLING_LEFT, NewPosition);
                PlaceObject(SPACE, NONE, boulderPosition);
            } else {
                // Try rolling right
                //NewPosition = GetRelativePosition(boulderPosition, right1);
                NewPosition = pos + 1;
                if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + MAP_WIDTH + 1).type == SPACE)) {
                    PlaceObject(type, FALLING | ROLLING_RIGHT, NewPosition);
                    PlaceObject(SPACE, NONE, boulderPosition);
                }
            }
        }
    }

}

function ScanFallingBoulder(pos, type) {
    //console.log("falling boulder");
    // in/out magicWallStatusType magicWallStatus
    // Local variables
    let NewPosition;
    let theObjectBelow;
    let boulderPosition = pos;
    // If the boulder can continue to fall, move it down.
    //  NewPosition := GetRelativePosition(boulderPosition, down1);
    NewPosition = pos + MAP_WIDTH;
    theObjectBelow = GetObjectAtPosition(NewPosition);
    //console.log(NewPosition,theObjectBelow);
    if (theObjectBelow.type == SPACE) {

        PlaceObject(type, FALLING, NewPosition);
        PlaceObject(SPACE, NONE, boulderPosition);
        // // ie old position
    }
    // If the object below is a magic wall, we activate it (if it's off), and
    // morph into a diamond two spaces below if it's now active. If the wall
    // is expired, we just disappear (with a sound still though).
    else if (theObjectBelow.type == MAGIC_WALL) {
        if (level.magicWallStatus == MAGIC_WALL_OFF) {
            level.magicWallStatus = MAGIC_WALL_ON;
        }
        if (level.magicWallStatus == MAGIC_WALL_ON) {
            NewPosition = pos + MAP_WIDTH * 2;
            if (GetObjectAtPosition(NewPosition).type == SPACE) {
                PlaceObject(DIAMOND + BOULDER - type, FALLING, NewPosition);
            }
        }
        PlaceObject(SPACE, NONE, boulderPosition);
        //RequestSound(diamondSound); // note: Diamond sound
    }

    // Failing that, we've hit something, so we play a sound and see if we can roll.
    else {
        // RequestSound(boulderSound);
        if (CanRollOff(theObjectBelow)) {
            //console.log("posso rotolare falling...");
            //debugger;
            // Try rolling left
            NewPosition = pos - 1;
            //console.log(GetObjectAtPosition({y: y - 1,x: x - 1}));
            if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + MAP_WIDTH - 1).type == SPACE)) {
                PlaceObject(type, FALLING | ROLLING_LEFT, NewPosition);
                PlaceObject(SPACE, NONE, boulderPosition);
            } else {

                // Try rolling right
                NewPosition = pos + 1;
                if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + MAP_WIDTH + 1).type == SPACE)) {
                    PlaceObject(type, FALLING | ROLLING_RIGHT, NewPosition);
                    PlaceObject(SPACE, NONE, boulderPosition);

                    // The boulder is sitting on an object which it could roll off, but it can't
                    // roll, so it comes to a stop.
                } else {
                    PlaceObject(type, STATIONARY, boulderPosition);
                }
            }

            // Failing all that, we see whether we've hit something explosive
        } else if (ImpactExplosive(theObjectBelow)) {
            Explode(NewPosition, theObjectBelow.type);

            // And lastly, failing everything, the boulder comes to a stop.
        } else {
            PlaceObject(type, STATIONARY, boulderPosition);
        }
    }
}

function Explode(pos, type) {

    let startAnimation = 5;
    if (type == BUTTERFLY) {
        startAnimation = 0;
    }
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++) {
            let newPosition = pos + i + j * MAP_WIDTH;
            ////vdebug("boom pos:",GetObjectAtPosition(newPosition).type==STEEL_WALL);
            if (GetObjectAtPosition(newPosition).type != STEEL_WALL) {
                PlaceObject(EXPLOSION, startAnimation << 16, newPosition);
            }
        }
}

function CanRollOff(anObjectBelow) {
    // If the specified object is one which a boulder or diamond can roll off,
    // return true otherwise return false.

    // First of all, only objects which have the property of being "rounded" are
    // are ones which things can roll off. Secondly, if the object is a boulder
    // or diamond, the boulder or diamond must be stationary, not falling.

    // We're going to assume that GetObjectProperty() automatically returns "true"
    // for objBoulderStationary, objDiamondStationary, objBrickWall, and returns "false"
    // for everything else (including objBoulderFalling and objDiamondFalling).
    if ((anObjectBelow.type == BOULDER || anObjectBelow.type == DIAMOND) && anObjectBelow.attribute == STATIONARY) {
        return true;
    }
    return attributes[anObjectBelow.type].rounded;
    //return (GetObjectProperty(anObjectBelow, propertyRounded));
}

function ImpactExplosive(anObject) {
    // If the specified object has the property of being something that can
    // explode, return true otherwise return false.
    // ImpactExplosive objects are: Rockford, Firefly, Butterfly.
    return attributes[anObject.type].impactExplosive;
    //	return (GetObjectProperty(anObject, propertyImpactExplosive));  true/false
}

function GetExplosionType(anObject) {
    // Assuming that the specified object is in fact explosive, returns the type
    // of explosion (explodeToSpace or explodeToDiamonds)
    // Explosive objects are: Rockford, Firefly, Butterfly.

    //   ASSERT (Explosive(anObjectBelow));
    return attributes[anObject.type].explosionType;
    //  return (GetObjectProperty(anObject, propertyExplosionType));
}

function UpdateScreen() {
    for (let j = 0; j < level.height; j++) {
        for (let i = 0; i < MAP_WIDTH; i++) {
            let n = j * MAP_WIDTH + i;
            if (level.tiles[n].attribute == FALLING) {
                sprites[n].y = j * TILE_SIZE - 28 + tick * 4;
            }
            if (level.tiles[n].attribute & ROLLING_LEFT) {
                sprites[n].x = i * TILE_SIZE + 28 - tick * 4;
            }
            if (level.tiles[n].attribute & ROLLING_RIGHT) {
                sprites[n].x = i * TILE_SIZE - 28 + tick * 4;
            }
            if (level.tiles[n].attribute & MOVING_LEFT) {
                sprites[n].x = i * TILE_SIZE + 28 - tick * 4;
            }
            if (level.tiles[n].attribute & MOVING_RIGHT) {
                sprites[n].x = i * TILE_SIZE - 28 + tick * 4;
            }
            if (level.tiles[n].attribute & MOVING_DOWN) {
                sprites[n].y = j * TILE_SIZE - 28 + tick * 4;
            }
            if (level.tiles[n].attribute & MOVING_UP) {
                sprites[n].y = j * TILE_SIZE + 28 - tick * 4;
            }
            //sprites[j][i].x = i * TILE_SIZE + dfield[j + py][i + px].dx + odx-48;
            //sprites[j][i].y = j * TILE_SIZE + dfield[j + py][i + px].dy + ody-48;
        }
    }
    if (ContainerLocation.scrollX > 0) {
        ContainerLocation.scrollX -= 4;

    }
    if (ContainerLocation.scrollX < 0) {
        ContainerLocation.scrollX += 4;

    }
    Sprites.container.x = -ContainerLocation.x * TILE_SIZE + ContainerLocation.scrollX;
    if (ContainerLocation.scrollY > 0) {
        ContainerLocation.scrollY -= 4;

    }
    if (ContainerLocation.scrollY < 0) {
        ContainerLocation.scrollY += 4;

    }
    Sprites.container.y = -ContainerLocation.y * TILE_SIZE + ContainerLocation.scrollY + 32;
    /*
    //vdebug("container.x",container.x);
    //vdebug("container.scrollx",ContainerLocation.scrollX);
    //vdebug("rockloc",RockfordLocation.x);
    //vdebug("contloc",ContainerLocation.x);
    //vdebug("delta", RockfordLocation.x - ContainerLocation.x);
     */

}

function UpdateSprites() {
    //console.log(level.tiles[0]);
    for (let i = 0; i < NUM_TILES; i++) {
        if (level.tiles[i].covered) {
            sprites[i].texture = Textures.tx[100 + ((tick>>1) % 4)];
        } else {
            if (attributes[level.tiles[i].type].animated) {
                sprites[i].texture = Textures.tx[attributes[level.tiles[i].type].texture + frame_counter];
            } else {
                switch (level.tiles[i].type) {
                    case MAGIC_WALL:
                        if (level.magicWallStatus === MAGIC_WALL_ON) {
                            sprites[i].texture = Textures.tx[96 + (frame_counter % 4)];
                        } else {
                            sprites[i].texture = Textures.tx[1];
                        }
                        break;

                    case ROCKFORD:

                        sprites[i].texture = Textures.tx[RockfordSprite];
                        break;
                    case INBOX:
                        //console.log(animazioneInbox[level.tiles[i].attribute >> 16]);
                        sprites[i].texture = Textures.tx[animazioneInbox[level.tiles[i].attribute >> 16]];
                        break;
                    case EXPLOSION:
                        sprites[i].texture = Textures.tx[animazioniEsplosione[level.tiles[i].attribute >> 16]];
                        break;
                    default:
                        sprites[i].texture = Textures.tx[attributes[level.tiles[i].type].texture];
                        break;
                }
            }
        }
    }

}

function ScanRockford(pos) {
    // We have come across Rockford during the scan routine. Read the joystick or
    // demo data to find out where Rockford wants to go, and call a subroutine to
    // actually do it.

    //    ASSERT(numRoundsSinceRockfordSeenAlive >= 0);

    // Local variables
    let JoyPos;

    // If we're in demo mode, we get our joystick movements from the demo data
    if (demo_mode) {
        JoyPos = GetNextDemoMovement();
    } else {
        // Otherwise if we're in a real game, we get our joystick movements from
        // the current player's input device (joystick, keyboard, whatever).
        JoyPos = Input.GetJoystickPos();
    }

    // Call a subroutine to actually deal with the joystick movement.
    MoveRockfordStage1(pos, JoyPos);

    // Rockford has been seen alive, so reset the counter indicating the number
    // of rounds since Rockford was last seen alive.
    numRoundsSinceRockfordSeenAlive = 0;
}

function MoveRockfordStage1(pos, JoyPos) {
    // Note: in this routine, if the user presses diagonally, the horizontal movement takes
    // precedence over the vertical movement; ie Rockford moves horizontally.

    // Local variables
    let ActuallyMoved;
    let NewPosition;

    // Determine Rockford's new location if he actually moves there (ie he isn't
    // blocked by a wall or something, and isn't holding the fire button down).
    switch (JoyPos.direction) {
        case DOWN:
            RockfordMoving = true;
            RockfordMovement = MOVING_DOWN;
            NewPosition = pos + MAP_WIDTH;
            break;
        case UP:
            RockfordMoving = true;
            RockfordMovement = MOVING_UP;
            NewPosition = pos - MAP_WIDTH;
            break;
        case RIGHT:
            //console.log("RIGHT");
            RockfordMoving = true;
            RockfordMovement = MOVING_RIGHT;
            RockfordAnimationFacingDirection = FACING_RIGHT;
            NewPosition = pos + 1;
            break;
        case LEFT:
            RockfordMoving = true;
            RockfordMovement = MOVING_LEFT;
            RockfordAnimationFacingDirection = FACING_LEFT;
            NewPosition = pos - 1;
            break;
        default:
            RockfordMoving = false;
            level.tiles[pos].attribute = NONE;
            break;
    }
    //vdebug("RockfordMoving", RockfordMoving);
    if (RockfordMoving) {
        // Call a subroutine to actually deal with this further.
        ActuallyMoved = MoveRockfordStage2(pos, NewPosition, JoyPos);

        // If Rockford did in fact physically move, we update our record of Rockford's
        // position (used by the screen scrolling algorithm to know where to scroll).
        if (ActuallyMoved) {
            RockfordLocation.x = NewPosition % MAP_WIDTH;
            RockfordLocation.y = Math.floor(NewPosition / MAP_WIDTH);

            if (RockfordLocation.x - ContainerLocation.x > 15) {
                if (ContainerLocation.x < MAP_WIDTH - 20) {
                    ContainerLocation.scrollX = +32;
                    ContainerLocation.x++;
                }
            }
            if (RockfordLocation.x - ContainerLocation.x < 4) {
                if (ContainerLocation.x > 0) {
                    ContainerLocation.scrollX = -32;
                    ContainerLocation.x--;
                }
            }
            if (RockfordLocation.y - ContainerLocation.y > 9) {
                if (ContainerLocation.y < level.height - 12) {
                    ContainerLocation.scrollY = +32;
                    ContainerLocation.y++;
                }
            }
            if (RockfordLocation.y - ContainerLocation.y < 4) {
                if (ContainerLocation.y > 0) {
                    ContainerLocation.scrollY = -32;
                    ContainerLocation.y--;
                }
            }

        } else {
            level.tiles[pos].attribute = NONE;
        }

    }
}

function MoveRockfordStage2(pos, newPosition, JoyPos) {

    // Part of the Move Rockford routine. Call MoveRockfordStage3 to do all the work.
    // All this routine does is check to see if the fire button was down, and
    // so either move Rockford to his new position or put a space where he would
    // have moved. Returns true if Rockford really did physically move.

    // Local variables
    let ActuallyMoved;

    // Call a subroutine to move Rockford. It returns true if the movement was
    // successful (without regard to the fire button).
    ActuallyMoved = MoveRockfordStage3(newPosition, JoyPos);

    // If the movement was successful, we check the fire button to determine
    // whether Rockford actually physically moves to the new positon or not.
    if (ActuallyMoved) {
        if (JoyPos.fireButtonDown) {
            //PlaceSpace(newPosition);
            PlaceObject(SPACE, NONE, newPosition);
            ActuallyMoved = false;
        } else {
            PlaceObject(ROCKFORD, RockfordMovement, newPosition);
            PlaceObject(SPACE, NONE, pos);
            //PlaceRockford(newPosition);
            //PlaceSpace(originalPosition);
        }
    }

    // Tell our caller whether or not Rockford physically moved to a new position.
    return ActuallyMoved;
}

function MoveRockfordStage3(newPosition, JoyPos) {

    // See what object is in the space where Rockford is moving and deal with it
    // appropriately. Returns true if the movement was successful, false otherwise.

    // Local Variables
    let movementSuccessful;
    let theObject;
    let NewBoulderPosition;

    // Determine what object is in the place where Rockford is moving.
    movementSuccessful = false;
    theObject = GetObjectAtPosition(newPosition);
    switch (theObject.type) {
        // Space: move there, and play a sound (lower pitch white noise)
        case SPACE:
            movementSuccessful = true;
            //RequestRockfordMovementSound(movingThroughSpace);
            break;
        // Dirt: move there, and play a sound (higher pitch white noise)
        case DIRT:
            movementSuccessful = true;
            //RequestRockfordMovementSound(movingThroughDirt);
            break;
        // Diamond: pick it up
        case DIAMOND:
            if (theObject.attribute == STATIONARY) {
                movementSuccessful = true;
                PickUpDiamond();
            }
            break;
        // OutBox: flag that we've got out of the cave
        case OUTBOX:
            movementSuccessful = true;
            FlagThatWeAreExitingTheCave("and that we got out alive");
            break;
        // Boulder: push it
        case BOULDER:
            if (theObject.attribute == STATIONARY) {
                if (JoyPos.direction == LEFT) {
                    NewBoulderPosition = newPosition - 1;
                    if (GetObjectAtPosition(NewBoulderPosition).type == SPACE) {
                        movementSuccessful = PushBoulder(NewBoulderPosition, ROLLING_LEFT);
                    }
                } else if (JoyPos.direction == RIGHT) {
                    NewBoulderPosition = newPosition + 1;
                    if (GetObjectAtPosition(NewBoulderPosition).type == SPACE) {
                        movementSuccessful = PushBoulder(NewBoulderPosition, ROLLING_RIGHT);
                    }
                }

            }
            break;
    }

    // Return an indication of whether we were successful in moving.
    return movementSuccessful;
}
function PushBoulder(newBoulderPosition, move) {
    // There is a 12.5% (1 in 8) than Rockford will succeed in pushing the boulder.
    // Return true if boulder successfully pushed, false if not.

    // Local variables
    let pushSuccessful;

    pushSuccessful = (Math.random() < .125);
    if (pushSuccessful) {
        // RequestSound(boulderSound);
        //PlaceBoulder(newBoulderPosition);
        PlaceObject(BOULDER, move | FALLING, newBoulderPosition);
    }

    return pushSuccessful;
}

////

function PickUpDiamond() {
    // Player has picked up a diamond. Increase their score, increase their number
    // of diamonds collected, and check whether they have enough diamonds now.

    //RequestSound(pickedUpDiamondSound);
    CurrentPlayerData.score += CurrentPlayerData.currentDiamondValue;
    CheckForBonusLife();
    CurrentPlayerData.diamondsCollected++;
    CheckEnoughDiamonds();
}

////

function CheckEnoughDiamonds() {
    if (CurrentPlayerData.diamondsCollected == level.diamondsNeeded) {
        CurrentPlayerData.gotEnoughDiamonds = true;
        CurrentPlayerData.currentDiamondValue = level.extraDiamondValue;
        UpdateStatusbar();
        // RequestSound(crackSound);
        RequestFlash();
    }
}

function CheckForBonusLife() { }
function UpdateStatusbar() { console.log("status bar [abbastanza diamanti]") }
function RequestFlash() { console.log("lampeggia schermo") }

////

function AnimateRockford() {
    // Called by the animation routine every animation frame

    // If Rockford is currently moving, we display the right-moving or left-moving animation
    // sequence.
    let RockfordFrame1 = RockfordFrame >> 1;
    if (RockfordMoving) {

        // Can't tap or blink while moving
        Tapping = false;
        Blinking = false;

        // Set up animation left or right as appropriate
        if (RockfordAnimationFacingDirection == FACING_RIGHT) {
            ////doing right-facing Rockford animation sequence
            RockfordSprite = 64 + RockfordFrame1;
        }
        else {
            RockfordSprite = 56 + RockfordFrame1;
        }


    } else {
        if (RockfordFrame == 0) {
            Blinking = Math.random() < 0.25;
            if (Math.random() < 0.125) Tapping = !Tapping;
        }
        if (Blinking && Tapping) {
            RockfordSprite = 72 + RockfordFrame1;
        } else if (Blinking) {
            RockfordSprite = 80 + RockfordFrame1;
        } else if (Tapping) {
            RockfordSprite = 88 + RockfordFrame1;
        } else {
            RockfordSprite = 9;
        }

    }
    RockfordFrame++;
    if (RockfordFrame == 16) {
        RockfordFrame = 0;
    }
}
function ScanFirefly(positionOfFirefly, directionOfFirefly, type) {
    //debugger;
    // Local variables
    let NewPosition;
    let NewDirection;
    let preferred = type == BUTTERFLY ? -1 : 1;

    // First check whether the firefly will explode by being next to Rockford,
    // Rockford-scanned-this-frame or amoeba but not amoeba-scanned-this-frame.
    if (FlyWillExplode(positionOfFirefly)) {
        Explode(positionOfFirefly, type);
    } else {

        // Failing that, attempt to move turn left and move there if possible
        NewPosition = GetNextFlyPosition(positionOfFirefly, directionOfFirefly, preferred);
        if (GetObjectAtPosition(NewPosition).type == SPACE) {
            NewDirection = GetNewDirection(directionOfFirefly, preferred);
            PlaceObject(type, setMoveFromDir(NewDirection), NewPosition);
            PlaceObject(SPACE, NONE, positionOfFirefly); // ie old position
        } else {

            // Failing that, attempt to move straight ahead
            NewPosition = GetNextFlyPosition(positionOfFirefly, directionOfFirefly, 0);
            if (GetObjectAtPosition(NewPosition).type == SPACE) {
                PlaceObject(type, setMoveFromDir(directionOfFirefly << 8), NewPosition); // ie keep same direction
                PlaceObject(SPACE, NONE, positionOfFirefly); // ie old position
            } else {

                // Failing that, turn to the right but do not move
                NewDirection = GetNewDirection(directionOfFirefly, -preferred);
                PlaceObject(type, NewDirection, positionOfFirefly); // old position, new direction
            }
        }
    }
}

function setMoveFromDir(dir) {
    let result;
    switch (dir) {
        case DIRECTION_UP:
            result = DIRECTION_UP | MOVING_UP;
            break;
        case DIRECTION_LEFT:
            result = DIRECTION_LEFT | MOVING_LEFT;
            break;
        case DIRECTION_DOWN:
            result = DIRECTION_DOWN | MOVING_DOWN;
            break;
        case DIRECTION_RIGHT:
            result = DIRECTION_RIGHT | MOVING_RIGHT;
            break;
    }
    return result;
}

function GetNewDirection(directionOfFirefly, turnDirection) {

    let nd = directionOfFirefly + turnDirection;
    if (nd > 4) {
        nd -= 4;
    }
    if (nd < 1) {
        nd += 4;
    }
    return nd << 8;
}

function FlyWillExplode(aPosition) {
    // Check the four directions around a fly at a given position to see whether
    // it will explode. Returns true if so, false if not.

    // Local variables
    let ExplodedYet;

    // Check the four directions to see whether the fly will explode
    ExplodedYet = CheckFlyExplode(aPosition - MAP_WIDTH);
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition - 1);
    }
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition + 1);
    }
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition + MAP_WIDTH);
    }

    // Return function result
    return ExplodedYet;
}

////

function CheckFlyExplode(aPosition) {
    // Check the given position to see whether it contains an object which a
    // fly will explode if it is in contact with (ie Rockford or Amoeba).
    // Returns true if so, false if not.
    let altro = GetObjectAtPosition(aPosition).type;
    return (altro == ROCKFORD || altro == AMOEBA);
}

function GetNextFlyPosition(currentPosition, directionOfFirefly, turnDirection) {
    let newPosition;
    // costruiamo una matrice 4x3

    let nd = directionOfFirefly + turnDirection;
    if (nd > 4) {
        nd -= 4;
    }
    if (nd < 1) {
        nd += 4;
    }
    switch (nd) {
        case 1:
            newPosition = currentPosition - MAP_WIDTH;
            break;
        case 2:
            newPosition = currentPosition - 1;
            break;
        case 3:
            newPosition = currentPosition + MAP_WIDTH;
            break;
        case 4:
            newPosition = currentPosition + 1;
            break;
    }
    return newPosition;

}

function ScanAmoeba(positionOfAmoeba) {
    // Local variables
    let direction;
    let NewPosition;

    //ASSERT(anAmoebaRandomFactor > 0);
    //ASSERT(totalAmoebaFoundLastFrame > 0);
    //ASSERT(numberOfAmoebaFoundThisFrame > 0);
    numberOfAmoebaFoundThisFrame++;

    // If the amoeba grew too big last frame, morph into a boulder.
    // kTooManyAmoeba = 200 for original Boulder Dash.
    if (totalAmoebaFoundLastFrame >= level.tooManyAmoeba) {
        PlaceObject(BOULDER, STATIONARY, positionOfAmoeba);
    }
    //debugger;
    // If the amoeba suffocated last frame, morph into a diamond
    if (amoebaSuffocatedLastFrame) {
        PlaceObject(DIAMOND, STATIONARY, positionOfAmoeba);
    } else

        // If we haven't yet found any amoeba this frame which can grow, we check to
        // see whether this particular amoeba can grow.
        if (!atLeastOneAmoebaFoundThisFrameWhichCanGrow) {
            if (AmoebaInThisPosCanGrow(positionOfAmoeba)) {
                atLeastOneAmoebaFoundThisFrameWhichCanGrow = true;
            }

        }

    // If this amoeba decides to attempt to grow, it randomly chooses a direction,
    // and if it can grow in that direction, does so.
    if (AmoebaRandomlyDecidesToGrow(anAmoebaRandomFactor)) {
        direction = GetRandomDirection();
        NewPosition = positionOfAmoeba + direction;
        let type = GetObjectAtPosition(NewPosition).type;
        if (type == SPACE || type == DIRT) {
            PlaceObject(AMOEBA, NONE, NewPosition);
        }
    }
}
function GetRandomDirection() {
    let r = Math.random();
    if (r < .25) {
        return -1;

    }
    if (r < .5) {
        return 1;
    }
    if (r < .75) {
        return MAP_WIDTH;
    }
    return -MAP_WIDTH;
}
function AmoebaInThisPosCanGrow(pos) {
    let type = GetObjectAtPosition(pos + 1).type;
    if (type == SPACE || type == DIRT) {
        return true;
    }
    type = GetObjectAtPosition(pos + 1).type;
    if (type == SPACE || type == DIRT) {
        return true;
    }
    type = GetObjectAtPosition(pos + MAP_WIDTH).type;
    if (type == SPACE || type == DIRT) {
        return true;
    }
    type = GetObjectAtPosition(pos - MAP_WIDTH).type;
    if (type == SPACE || type == DIRT) {
        return true;
    }
    return false;
}

function AmoebaRandomlyDecidesToGrow(anAmoebaRandomFactor) {
    // Randomly decide whether this amoeba is going to attempt to grow or not.
    // anAmoebaRandomFactor should normally be 127 (slow growth) but sometimes is
    // changed to 15 (fast growth) if the amoeba has been alive too long.
    //   ASSERT(anAmoebaRandomFactor in {15, 127});
    return (Math.random() < anAmoebaRandomFactor);
}





export { Ready, Loop };