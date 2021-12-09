const Jimp = require('jimp');
const fs = require('fs');

let componi=["boulder","dirt","brickwall","steelwall","rockford"];
let count = 1;
let j = {
	meta:{ 
	"image": "test.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1"
	},
	frames:{
		"tex0":{
			frame:{x:0,y:0,w:32,h:32},
			rotated:false,
			trimmed:true,
			spriteSourceSize:{x:0,y:0,w:32,h:32},
			sourceSize:{w:32,h:32}
			}
			}
			};

async function main() {
  const image = await Jimp.read('sheet.png');
  const sp=[];
  for (let i=0;i<componi.length;i++)
  {
	sp[i] = await Jimp.read(componi[i]+".png");
  }
  let posx = 32;
  let posy = 0;
  for (let i=0;i<componi.length;i++)
  {
	image.blit(sp[i], posx, posy);	
	j.frames["tex"+count]={frame:{x:posx,y:posy,w:32,h:32},rotated:false,trimmed:true,spriteSourceSize:{x:0,y:0,w:32,h:32},sourceSize:{w:32,h:32}};
	posx+=32;
	if (posx>255)
	{
		posx=0;
		posy+=32;
	}
	count++;
  }
  const diamanti = await Jimp.read('diamond.png');
  for (let i=0;i<8;i++)
  {
	  image.blit(diamanti,posx,posy,48*i,0,32,32);
	  j.frames["tex"+count]={frame:{x:posx,y:posy,w:32,h:32},rotated:false,trimmed:true,spriteSourceSize:{x:0,y:0,w:32,h:32},sourceSize:{w:32,h:32}};
	  posx+=32;
	  if (posx>255)
	{
		posx=0;
		posy+=32;
	}
	  count++;
  }
   const firefly = await Jimp.read('firefly.png');
  for (let i=0;i<8;i++)
  {
	  image.blit(firefly,posx,posy,48*i,0,32,32);
	  j.frames["tex"+count]={frame:{x:posx,y:posy,w:32,h:32},rotated:false,trimmed:true,spriteSourceSize:{x:0,y:0,w:32,h:32},sourceSize:{w:32,h:32}};
	  posx+=32;
	  if (posx>255)
	{
		posx=0;
		posy+=32;
	}
	  count++;
  }
  image.write("test.png");
  fs.writeFileSync("output.json",JSON.stringify(j));
}

main();

 