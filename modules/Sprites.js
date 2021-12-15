import  {Textures}  from './Textures.js';

const CharTexture = (char) => {
    const chars = "0123456789:;=*,/ ABCDEFGHIJKLMNOPQRSTUVWXYZ(^)+_";
    return Textures.tx[104 + chars.indexOf(char)];
}

class Sprites {
    static container = new PIXI.Container();
    static hud = new PIXI.Container();;
    static info = new PIXI.Container();;
    static sp = {};
    constructor(app) {
        app.stage.addChild(Sprites.container);
        app.stage.addChild(Sprites.hud);
        app.stage.addChild(Sprites.info);
        Sprites.info.y = 304;
        

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


}
export { Sprites };