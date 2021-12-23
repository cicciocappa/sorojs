
import {Textures}  from './modules/Textures.js';
import * as Game  from './modules/Game.js';
import {Sprites}  from './modules/Sprites.js';
import {DOM}  from './modules/DOM.js';
// main PIXI app
const app = new PIXI.Application({
    width: 640,
    height: 400
});
document.body.appendChild(app.view);
DOM.view = app.view;
DOM.stage = app.stage;
DOM.renderer = app.renderer;
new Sprites(app);
new Textures(sheetdata,Game.Ready);
app.ticker.maxFPS = 60;
app.ticker.add(Game.Loop);
