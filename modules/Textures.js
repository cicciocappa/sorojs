class Textures {
    static tx = [];
    static loader = PIXI.Loader.shared;
    constructor(callback) {

        Textures.loader.add('sprites', 'assets/img/sheet.json').
            add('titolo', 'assets/img/titolo.png').
            add('sfondo', 'assets/img/sfondo_titolo.png');

        Textures.loader.load(callback);

    }
}


export { Textures };