 


// SETUP

const app = new PIXI.Application({
    width: 640,
    height: 400
});
document.body.appendChild(app.view);
const container = new PIXI.Container();
const hud = new PIXI.Container();
app.stage.addChild(container);
app.stage.addChild(hud);

//TEST
const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0x0);
graphics.drawRect(0, 0, 640, 40);
graphics.endFill();
hud.addChild(graphics);

//

app.stop();
const text = [];
//app.loader.add('spritesheet', 'assets/output.json?v=3').load(onAssetsLoaded);
const baseTexture = PIXI.Texture.from('assets/download.png?v=1');
let data = {
    "meta": {
        "image": "textures.png",
        "format": "RGBA8888",
        "size": {
            "w": 256,
            "h": 512
        },
        "scale": "1"
    },
    "frames": {}
}

for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 8; j++) {
        data.frames[`tex${i * 8 + j}`] = {
            frame: {
                x: j * 32,
                y: i * 32,
                w: 32,
                h: 32
            },
            rotated: false,
            trimmed: true,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: 32,
                h: 32
            },
            sourceSize: {
                w: 32,
                h: 32
            }
        }
    }
}
for (let i = 13; i < 19; i++) {
    for (let j = 0; j < 8; j++) {
        data.frames[`tex${i * 8 + j}`] = {
            frame: {
                x: j * 32,
                y: i * 16+13*16,
                w: 32,
                h: 16,
            },
            rotated: false,
            trimmed: true,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: 32,
                h: 16
            },
            sourceSize: {
                w: 32,
                h: 16
            }
        }
    }
}

var sheet = new PIXI.Spritesheet(baseTexture, data);
sheet.parse(onAssetsLoaded);

function onAssetsLoaded() {
    // create an array to store the textures

    let i;

    for (i = 0; i < 128; i++) {
        const texture = PIXI.Texture.from(`tex${i}`);
        text.push(texture);
    }

    app.start();
}

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

const animazioniEsplosione = [3, 4, 5, 6, 0, 20, 21, 20, 19];
const animazioneInbox = [7, 17, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 17, 7, 19, 20, 21, 9];

/*text[SPACE] = PIXI.Texture.from('assets/empty.png');
text[STEEL_WALL] = PIXI.Texture.from('assets/steelwall.png');
text[DIRT] = PIXI.Texture.from('assets/dirt.png');
text[BRICK_WALL] = PIXI.Texture.from('assets/brickwall.png');
text[ROCKFORD] = PIXI.Texture.from('assets/rockford.png');
text[BOULDER] = PIXI.Texture.from('assets/boulder.png');
 */
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

// game attributes
// STATES:
const INTRO = 0;
const DEMO = 1;
const STARTING = 2;
const RUNNING = 3;
const OVER = 4;
const CLEARED = 5;

const FACING_LEFT = 0;
const FACING_RIGHT = 1;
const TILE_SIZE = 32;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

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

let input = {
    rightPressed: false,
    leftPressed: false,
    downPressed: false,
    upPressed: false,
    shiftPressed: false,
    returnPressed: false,
};
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
function keyDownHandler(event) {
    switch (event.keyCode) {
        case 39:
            //	console.log("ops");
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
    vdebug("joy", joy);
    return joy;
}
let frame_counter = 0;
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

let CurrentPlayerData = {
    score: 0,
    currentDiamondValue: 20,
    diamondsCollected: 0,
    gotEnoughDiamonds: false
}

let tick = 0;
let level = {
    width: testmap[0].length,
    height: testmap.length,
    magicWallStatus: MAGIC_WALL_OFF,
    magicWallMillingTime: 100,
    diamondsNeeded: 10,
    extraDiamondValue: 50,
    tiles: []
};
level.totalTiles = level.width * level.height;
level.tooManyAmoeba = Math.floor(level.totalTiles * .22);

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

var sprites = [];

for (let j = 0; j < level.height; j++) {
    for (let i = 0; i < level.width; i++) {
        let n = j * level.width + i;
       // console.log(testmap[j].charAt(i), transl[testmap[j].charAt(i)])
        level.tiles[n] = {
            type: transl[testmap[j].charAt(i)].type,
            attribute: transl[testmap[j].charAt(i)].attrib,
            scanned: false
        };
        sprites[n] = new PIXI.Sprite(text[level.tiles[n].type]);
        sprites[n].anchor.set(0);
        sprites[n].x = i * TILE_SIZE;
        sprites[n].y = j * TILE_SIZE;
        container.addChild(sprites[n]);

        if (level.tiles[n].type == INBOX) {
            RockfordLocation.x = i;
            RockfordLocation.y = j;
        }

    }
}

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

function GameLoop() {

    switch (gamestate) {
        case RUNNING:

            if (tick == 0) {
                Scan();
            }
            AnimateRockford();
            UpdateSprites();
            UpdateScreen();

            tick++;
            if (tick == 8) {
                tick = 0;
                frame_counter++;
                if (frame_counter == 8) {
                    frame_counter = 0;
                }
            }

            break;
    }
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
    NewPosition = pos + level.width;
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
            if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + level.width - 1).type == SPACE)) {
                PlaceObject(type, FALLING | ROLLING_LEFT, NewPosition);
                PlaceObject(SPACE, NONE, boulderPosition);
            } else {
                // Try rolling right
                //NewPosition = GetRelativePosition(boulderPosition, right1);
                NewPosition = pos + 1;
                if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + level.width + 1).type == SPACE)) {
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
    NewPosition = pos + level.width;
    theObjectBelow = GetObjectAtPosition(NewPosition);

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
            NewPosition = pos + level.width * 2;
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
            if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + level.width - 1).type == SPACE)) {
                PlaceObject(type, FALLING | ROLLING_LEFT, NewPosition);
                PlaceObject(SPACE, NONE, boulderPosition);
            } else {

                // Try rolling right
                NewPosition = pos + 1;
                if ((GetObjectAtPosition(NewPosition).type == SPACE) && (GetObjectAtPosition(pos + level.width + 1).type == SPACE)) {
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
            let newPosition = pos + i + j * level.width;
            //vdebug("boom pos:",GetObjectAtPosition(newPosition).type==STEEL_WALL);
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
        for (let i = 0; i < level.width; i++) {
            let n = j * level.width + i;
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
    container.x = -ContainerLocation.x * TILE_SIZE + ContainerLocation.scrollX;
    if (ContainerLocation.scrollY > 0) {
        ContainerLocation.scrollY -= 4;

    }
    if (ContainerLocation.scrollY < 0) {
        ContainerLocation.scrollY += 4;

    }
    container.y = -ContainerLocation.y * TILE_SIZE + ContainerLocation.scrollY + 32;
    /*
    vdebug("container.x",container.x);
    vdebug("container.scrollx",ContainerLocation.scrollX);
    vdebug("rockloc",RockfordLocation.x);
    vdebug("contloc",ContainerLocation.x);
    vdebug("delta", RockfordLocation.x - ContainerLocation.x);
     */

}

function UpdateSprites() {
    for (let i = 0; i < level.totalTiles; i++) {
        if (attributes[level.tiles[i].type].animated) {
            sprites[i].texture = text[attributes[level.tiles[i].type].texture + frame_counter];
        } else {
            switch (level.tiles[i].type) {
                case MAGIC_WALL:
                    if (level.magicWallStatus === MAGIC_WALL_ON) {
                        sprites[i].texture = text[96 + (frame_counter % 4)];
                    } else {
                        sprites[i].texture = text[1];
                    }
                    break;

                case ROCKFORD:

                    sprites[i].texture = text[RockfordSprite];
                    break;
                case INBOX:
                    //console.log(animazioneInbox[level.tiles[i].attribute >> 16]);
                    sprites[i].texture = text[animazioneInbox[level.tiles[i].attribute >> 16]];
                    break;
                case EXPLOSION:
                    sprites[i].texture = text[animazioniEsplosione[level.tiles[i].attribute >> 16]];
                    break;
                default:
                    sprites[i].texture = text[attributes[level.tiles[i].type].texture];
                    break;
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
    if (gamestate == DEMO) {
        JoyPos = GetNextDemoMovement();
    } else {
        // Otherwise if we're in a real game, we get our joystick movements from
        // the current player's input device (joystick, keyboard, whatever).
        JoyPos = GetJoystickPos();
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
            NewPosition = pos + level.width;
            break;
        case UP:
            RockfordMoving = true;
            RockfordMovement = MOVING_UP;
            NewPosition = pos - level.width;
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
    vdebug("RockfordMoving", RockfordMoving);
    if (RockfordMoving) {
        // Call a subroutine to actually deal with this further.
        ActuallyMoved = MoveRockfordStage2(pos, NewPosition, JoyPos);

        // If Rockford did in fact physically move, we update our record of Rockford's
        // position (used by the screen scrolling algorithm to know where to scroll).
        if (ActuallyMoved) {
            RockfordLocation.x = NewPosition % level.width;
            RockfordLocation.y = Math.floor(NewPosition / level.width);

            if (RockfordLocation.x - ContainerLocation.x > 15) {
                if (ContainerLocation.x < level.width - 20) {
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
function RequestFlash(){console.log("lampeggia schermo")}

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
    ExplodedYet = CheckFlyExplode(aPosition - level.width);
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition - 1);
    }
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition + 1);
    }
    if (!ExplodedYet) {
        ExplodedYet = CheckFlyExplode(aPosition + level.width);
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
            newPosition = currentPosition - level.width;
            break;
        case 2:
            newPosition = currentPosition - 1;
            break;
        case 3:
            newPosition = currentPosition + level.width;
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
        return level.width;
    }
    return -level.width;
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
    type = GetObjectAtPosition(pos + level.width).type;
    if (type == SPACE || type == DIRT) {
        return true;
    }
    type = GetObjectAtPosition(pos - level.width).type;
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

gamestate = RUNNING;

app.ticker.maxFPS = 60;

app.ticker.add((delta) => {

    GameLoop();

});

function vdebug(q, val) {
    if (!document.getElementById(q)) {
        var newpanel = document.createElement('div');
        newpanel.id = q;
        newpanel.className = "dbgp";
        newpanel.innerHTML = '<b>' + q + ':</b> <span id="val' + q + '"><span>';
        document.getElementById("dbgpan").appendChild(newpanel);
    }
    document.getElementById("val" + q).textContent = JSON.stringify(val);

}
