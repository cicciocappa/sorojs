const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: 0x000000, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from('assets/dirt.png');
const baseTexture = PIXI.Texture.from('assets/download.png');
//PIXI.Loader.shared.add("assets/output.json").load(setup);
let data =  {
	"meta":{ 
	"image": "test.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1"
	},
	"frames":{
		"tex0":{
			frame:{x:0,y:0,w:32,h:32},
			rotated:false,
			trimmed:true,
			spriteSourceSize:{x:0,y:0,w:32,h:32},
			sourceSize:{w:32,h:32}
			},
	"tex1":{
			frame:{x:32,y:0,w:32,h:32},
			rotated:false,
			trimmed:true,
			spriteSourceSize:{x:0,y:0,w:32,h:32},
			sourceSize:{w:32,h:32}
			}		
			}
			};

var sheet1 = new PIXI.Spritesheet(baseTexture,data);
sheet1.parse(setup);
 console.log(sheet1.textures);
function setup() {
  
  console.log(sheet1);
}

// Create a 5x5 grid of bunnies
for (let i = 0; i < 81; i++) {
    const bunny = new PIXI.Sprite(sheet1.textures["tex1"]);
    bunny.anchor.set(0.5);
    bunny.x = (i % 9) * 32;
    bunny.y = Math.floor(i / 9) * 32;
    container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;
let n=0;
// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    if (n<100)
	{
	container.x += 4;
	}
	if (n>300)
	{
		container.x -= 4;
	}
	if (n>500)
	{n=0;}
n++;
});