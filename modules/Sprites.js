import { Textures } from './Textures.js';

const CharTexture = (char) => {
    const chars = "0123456789:;=*,/ ABCDEFGHIJKLMNOPQRSTUVWXYZ(^)+_";
    return Textures.tx[104 + chars.indexOf(char)];
}

class Sprites {
    static container = new PIXI.Container();
    static hud = new PIXI.Container();
    static intro = new PIXI.Container();
    static mask = new PIXI.Graphics();
    static sp = {};
    constructor(app) {
        
        Sprites.mask.beginFill(0x000000);
        Sprites.mask.drawRect(0, 0, 640, 32);
        Sprites.mask.endFill();

        app.stage.addChild(Sprites.container);
        app.stage.addChild(Sprites.mask);
        app.stage.addChild(Sprites.hud);
        app.stage.addChild(Sprites.intro);
       
        //Sprites.info.y = 304;


    }
    static Create(sprite, texture) {
        Sprites.sp[sprite] = new PIXI.Sprite(texture);
    }

    static WriteLine = (str, parent, pos, color = 0XFFFFFF) => {
        //;
        for (let i = 0; i < str.length; i++) {
            parent.children[20 * pos + i].texture = CharTexture(str.charAt(i));
            parent.children[20 * pos + i].tint = color;
        }
    }

    static UpdateHud = (str, pos) => {
        for (let i = 0; i < str.length; i++) {
            Sprites.hud.children[pos + i].texture = CharTexture(str.charAt(i));

        }

    }

    static ColorHud = (color, pos, n) => {
        for (let i = 0; i < n; i++) {
            Sprites.hud.children[pos + i].tint = color;

        }
    }
}
export { Sprites };