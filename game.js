const sfx = {
    intro: new Howl({ src: ['assets/audio/intro.wav'], loop: true }),
    passo_vuoto: new Howl({ src: ['assets/audio/passo_vuoto.wav'] }),
    passo_dirt: new Howl({ src: ['assets/audio/passo_dirt.wav'] }),
}





/***************************************** */
const LOADING = 0;
const INTRO = 1;
const DEMO = 2;
const STARTING = 3;
const RUNNING = 4;

/**************************************** */

let tick = 0;

const GameLoop = (delta) => {
    //console.log(gamestate);
    switch (gamestate) {
        case INTRO:
            tick++;
            sfondo_titolo.y = 48 - (tick % 16);
            break;
    }
}


const text = [];
let titolo;
let sfondo_titolo;
let gamestate = LOADING;
const header = [];

const app = new PIXI.Application({
    width: 640,
    height: 400
});
document.body.appendChild(app.view);
const container = new PIXI.Container();
const hud = new PIXI.Container();
app.stage.addChild(container);
app.stage.addChild(hud);
app.ticker.maxFPS = 60;

app.ticker.add(GameLoop);




const gameReady = (a, res) => {
    //console.log(res["titolo"].texture);

    titolo = new PIXI.Sprite(res['titolo'].texture);
    sfondo_titolo = new PIXI.Sprite(res['sfondo'].texture);
    let sheet = res['sprites'].spritesheet;
    for (let i = 0; i < 144; i++) {
        const texture = sheet.textures[`tex${i}`];
        text.push(texture);
    }
    //console.log(text);
    container.addChild(sfondo_titolo);
    container.addChild(titolo);
    titolo.y = 32;

    for (let i = 0; i < 20; i++) {
        const c = new PIXI.Sprite(text[132]);
        header.push(c);
        c.x = 32*i;
        c.y = 0;
        hud.addChild(c);
    }

    gamestate = INTRO;
    sfx.intro.play();
}

const loader = PIXI.Loader.shared;
loader.add('sprites', 'assets/img/sheet.json').
    add('titolo', 'assets/img/titolo.png').
    add('sfondo', 'assets/img/sfondo_titolo.png');

loader.load(gameReady);

