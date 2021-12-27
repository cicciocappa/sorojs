const BLACK = { r: 0, g: 0, b: 0, a: 0 };
const WHITE = { r: 1, g: 1, b: 1, a: 1 };
const ORANGE = { r: 0.54, g: 0.32, b: 0.16, a: 1 };
const BROWN = { r: 0.34, g: 0.26, b: 0, a: 1 };
const GREY = { r: 0.47, g: 0.47, b: 0.47, a: 1 };
const PURPLE = { r: 0.54, g: 0.25, b: 0.59, a: 1 };
const LIGHT_RED = { r: 0.72, g: 0.41, b: 0.38, a: 1 };
const LIGHT_BLUE = { r: 0.47, g: 0.41, b: 0.77, a: 1 };
const LIGHT_GREEN = { r: 0.58, g: 0.88, b: 0.54, a: 1 };
const RED = { r: 0.53, g: 0.22, b: 0.2, a: 1 };

const caves = [
    {
        amoeba_wall_time: 20,
        diamond_point: 10,
        extra_point: 15,
        diamond_needed: [12, 12, 12, 12, 12],
        cave_time: [150, 110, 70, 40, 30],
        colors: [BLACK, GREY, ORANGE, WHITE],

        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W...... ..d.r .....r.r....... ....r....W
W.rXr...... .........rd..r.... ..... ..W
W.......... ..r.....r.r..r........r....W
Wr.rr.........r......r..r....r...r.....W
Wr. r......... r..r........r......r.rr.W
W... ..r........r.....r. r........r.rr.W
Wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww...r..r.W
W. ...r..d. ..r.r..........d.rd...... .W
W..d.....r..... ........rr r..r....r...W
W...r..r.r..............r .r..r........W
W.r.....r........rrr.......r.. .d....r.W
W.d.. ..r.  .....r.rd..d....r...r..d. .W
W. r..............r r..r........d.....rW
W........wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwW
W r.........r...d....r.....r...r.......W
W r......... r..r........r......r.rr..PW
W. ..r........r.....r.  ....d...r.rr...W
W....rd..r........r......r.rd......r...W
W... ..r. ..r.rr.........r.rd...... ..rW
W.d.... ..... ......... .r..r....r...r.W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 20,
        diamond_point: 20,
        extra_point: 50,
        diamond_needed: [10, 12, 9, 13, 10],
        cave_time: [150, 110, 70, 70, 70],
        colors: [BLACK, PURPLE, LIGHT_RED, WHITE],

        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W.r..r..w.r...d.w... .r.wr......w..rr..W
W.......w......rwrr. ...w ..d...w....r.W
W                                      W
Wd......w.r....rw.r. .. w..r..d.w..r.r.W
W.......w.r....rw.r. r..w.....r.w... ..W
Wwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwW
W....rr.w..r....w... ..rw....r..w.....rW
W.......w.. ....w... ...w....r. w.....rW
W                                      W
Wr..r...w....r..w..r ...w......dwr.....W
Wr....r.w..r..r.w... . rw.......wr...r.W
W.r.....w...r...w... . rw.......w r..r.W
Wwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwW
Wr.  q..w....r.rw... ...w.rd..r.w......W
W.....r.wr......w..d ...w ..r...w.r.rr.W
W                                      W
Wd.. .r.wr....r.w.r. ..rw.r.r...w......W
W.....r.wr..d...w... r..w..r....w...rr W
W.d... rw..r....w.Xd r..w. .....w...rr W
W.r.... w.. ..r.w.P. ...w....r.rw.... .W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 0,
        diamond_point: 15,
        extra_point: 0,
        diamond_needed: [14, 23, 24, 23, 21],
        cave_time: [150, 110, 70, 70, 70],
        colors: [BLACK, BROWN, ORANGE, WHITE],

        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
Wr.ww.wrr.w...rwr..r....w...r.....rw.d.W
W..Xw.d.r.w...www..w.r....r..r.r...w.wrW
W....w..rd..r....w.....r.wwr.......w.wwW
Wd.w..wrwr..r....w...r......r.rr......wW
Wr.w...w..r.ww..r.wwd.......r.rr......wW
Wrr..r....w...r......r.rr......r..dww..W
W..r.ww..r.rr...w....r.rr......w..r.w.rW
W..w...d......d.r..wwr..r.w.wr..wr..d.rW
Wr.r....w.ww..d.r..wwr..r..d.w...w..r.wW
W.r.ww.....rrwr..d.w.wr..wr...wr..d.r..W
Ww.ww......rrwr..r.w.ww...w..r.ww..r.wwW
W.w.r.r.w...wwr..r....w...r.....ww.r.wwW
W.w.r.r.w.d.w.wr..wr....r..r.rr....w...W
Ww..wrwr..r....w...d...w.rw......w.ww.dW
Ww...wwr..w.d...wr..r.r...r.wr......w..W
Ww.d....r.ww..r.wwr.......r.wr......w..W
W..r....w...r......r.rr......w..r.w...wW
Wr.ww..r.ww...w....r.rr......w..rd..r..P
Ww...r......r.rd......r...ww..wr..d.w..W
Wrr...w.....r.rd......w..r.wd.d.rw.r...W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },


    {
        amoeba_wall_time: 20,
        diamond_point: 5,
        extra_point: 20,
        diamond_needed: [36, 36, 36, 36, 36],
        cave_time: [120, 100, 80, 60, 50],
        colors: [BLACK, ORANGE, PURPLE, WHITE],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WX.....r....................r........r.W
W.....r..............r.................W
W........r..r..........................W
Wr.....................................W
W...................r..................W
W.r.....................r.........r....W
W..r.....r...........r..r.............rW
W......r......r.....................r..W
W........ B...r.. B...... B...... B....W
W........  ...r..  ......  ......  .r..W
W......................................W
W...r..............................r...W
W...r.....r............................W
W......r...........r..................rW
W...........r.......r..................W
W..r..............r....................W
W.....................r.........r......W
W................................r..r..W
W....r......r.rr..................r....W
W...........r.rr.........r..r.r.......PW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 20,
        diamond_point: 50,
        extra_point: 90,
        diamond_needed: [4, 5, 6, 7, 8],
        cave_time: [150, 120, 90, 60, 30],
        colors: [BLACK, LIGHT_RED, BROWN, WHITE],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WX.....................................W
W......................................W
W......................................W
W......................................W
W......................................W
W......................................W
W......................................W
W.......  q.....  q.....  q.....  q....W
W.......   .....   .....   .....   ....W
W....... d ..... d ..... d ..... d ....W
W......................................W
W......................................W
W......................................W
W.......  q.....  q.....  q.....  q....W
W.......   .....   .....   .....   ....W
W....... d ..... d ..... d ..... d ....W
W......................................W
W......................................W
W......................................W
W......................................P
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 20,
        diamond_point: 40,
        extra_point: 60,
        diamond_needed: [4, 6, 7, 8, 8],
        cave_time: [150, 120, 100, 90, 80],
        colors: [BLACK, LIGHT_RED, LIGHT_BLUE, WHITE],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
Wwwwwwwwww....r.r..r........r.wwwwwwwwwW
W         ...........r....r...         W
W  dq     ..r..........r...r..     qd  W
Wwwwwwwwww..r........r......r.wwwwwwwwwW
W         ......r...r.......r.         W
W  dq     ....r......r.rr.....     qd  W
Wwwwwwwwww.rr........r.rr.....wwwwwwwwwW
W         ....r.r....r..r.....         W
W  dq     ....r.r....r..r..r..     qd  W
Wwwwwwwwww.rr.r..r....r...r...wwwwwwwwwW
W         .rr.r..r............         W
W  dq     ....r..r........r...     qd  W
Wwwwwwwwww.....r...r....r..r..wwwwwwwwwW
W....r.r..r........r.....r............rW
W......r....r....r..r.r...r..r.........W
W..r....r.....r...r.......r..r.........W
W..r........r......r.rr.........r......W
Wr.X...r...........r.rr.........rr..r.PW
W....r......r.rr......r........r..r....W
Wrr.........r.rr.........r..r.r.r..r...W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 75,
        diamond_point: 10,
        extra_point: 20,
        diamond_needed: [15, 20, 25, 25, 25],
        cave_time: [120, 120, 120, 120],
        colors: [BLACK, LIGHT_RED, BROWN, LIGHT_GREEN],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W. .. .rr..... ..r. X.... rr r..r. .  .W
W ..r. .. .  .... .r.r. ...  r..r.d.. .W
Wr.....  .q.  ... .r.r. ... wwwwwwwwwwwW
W.r.d... .  ...... ..rr..r.... . ... . W
Wwwwwwwwwwwww.r. ..   r.. .... ...r....P
Wr. r...... ..r. ... ..r.  ..r.  q.....W
Wr. r...... .. r..r.... ...r......r.rr.W
W... ..r  ... ..r.  ..r.  ... ....r.rr.W
W... ..r. .r.... ...q......r.r..  r..r.W
W  .. r.... ..r.r.... .  .......  d.. .W
W. ... .. .  .. .  .....rr r..r. . r.. W
W.. d..r.r.... .  ......r  r..r. .  ...W
W.r.  ..r.  ... .r.r. ...  r.. .... ...W
W....  .r.  ... .r.r. .r. . r.. r.... .W
W.  .... ....  .. r r..r.... ...r... .rW
W..... .  .rr. ...  r.. .r... r..r.r...W
W r...... ..r. .r.... .  ..r.  r.......W
W r...... .. r..r.... ...r......r.rr...W
W. ..r. ... ..r.  .aa.  ... ....r.rr...W
W. .drq..r.... ...r......r.rq.....dr...W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    },
    {
        amoeba_wall_time: 20,
        diamond_point: 10,
        extra_point: 20,
        diamond_needed: [10, 15, 20, 20, 20],
        cave_time: [120, 110, 100, 90, 80],
        colors: [BLACK, LIGHT_BLUE, RED, LIGHT_GREEN],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W . r.. . .. ..r. ..X ..r.  ..r. r... .W
W.r.rr...... ..r...r.... ...r.....dr.r.W
P r..r...  ...r..r. ..r.r...wwwwwwwwwwwW
W...d ..r. q.....r..... ........rr r..rW
Wwwwwwwwwwwww..r.r.... .  ......r  r..rW
W.  ... ..r.  ..r.  .... rrr.....  r.. W
W... r... q.. ..r.  .....r.rr..r. . r..W
W..r. ..r. r.... ..... ...r r..r.... ..W
W.....r ...... .  qrr. ...  r.. .r....rW
Wr.r... . r...... ..r...r....r....dr.  W
W......r. r......... r..r...wwwwwwwwwwwW
W.rr...... ..r. ... ..r.  ..r.  ... r..W
Wwwwwwwwwwwwwr........ ...r......r.rr..W
W..r...  ...d..r. ..r.rr.........r.rr..W
W.. ..r. .r...mmmmmmmm.........  r..r..W
Wr.. r....r..r r...d .. .......  r..r..W
W ... ..r. ...r.  .....rrrr..r. . r.. rW
W. r..q.r.... .  ......rr r..r...  ...rW
Wr.  ..r.  .....r.r. ...  r..r.... ...rW
W...  .r.r .....r.r.....   .. .r....r..W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    }

    ,
    {
        amoeba_wall_time: 20,
        diamond_point: 5,
        extra_point: 10,
        diamond_needed: [ 75, 75, 80, 85, 90 ],
        cave_time: [150, 150, 130, 130, 120],
        colors: [BLACK, PURPLE, ORANGE, WHITE],
        layout: `WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
Wdddrrddrddr.rrrrdrdd.ddrddrddddrrdrdrrW
Wdrrdddrrrdrddrrrrrrdrrd.drdrrrrdrddrrdW
Wddrrrrrrrdrddrr.rrrdrrdddrdr.rrdrrrddrW
Wrrdrddrrrrrrdrrddd..ddrrdrddrrdrdd.rrdW
Wrrdrddrrrrrrdrrd.drdrrrrdrdrdrrddrrdrdW
Wdddrrdrd.ddrrddrrdddrrdrdrrr.drddrrdrdW
Wrrrrrdrrdddd..rrrdrdd.rdrddr.rrddddddrW
Wdrddwwwwwww.wwwwwdrrrrdrwwwwww.wwwwwwrW
Wd.ddw           wrddrrrdw           wrW
Wdrdrw XP        wrddrrrdw           wrW
Wdrrdw           wr.rrddrw           wrW
Wdrrdw           wddddrdrw           wdW
Wrdddw           wdrrd.drw           wdW
Wrrrrw           wdrrddrrw           wrW
Wdrddw           w.rdrrdrw           wrW
Wdrddw           wwwwwwwww           wrW
Wrrrdw                               wrW
Wrrrdw           wdd.rdrdw           wrW
Wddrrw           wrrrdrddw           wrW
Wdd..wwwwwwwwwwwwwdrrrdddwwwwwwwwwwwwwdW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW`
    }





];

export { caves };