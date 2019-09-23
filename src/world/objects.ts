import { StaticGameObject } from "./../engine/StaticGameObject";
import { Skin } from "./../engine/Skin";

export const house = new StaticGameObject([2, 2], ` /^\\ 
==*==
 ▓ ▓ `, new Skin(` BBB
BBSBB
 WDW`, {
      B: [undefined, 'black'],
      S: [undefined, '#004'],
      W: ["black", "darkred"],
      D: ["black", "saddlebrown"]
  }), `
 ... 
 . .`, '', [5, 10]);


 export const tree = new StaticGameObject([1, 3], ` ░ 
░░░
░░░
 █`, new Skin(` o 
o01
01S
 H`, {
      'o': ['#0c0', '#0a0'],
      '0': ['#0a0', '#080'],
      '1': ['#080', '#060'],
      'S': ['#060', '#040'],
      'H': ['sienna', 'transparent'],
  }), `


 .`, '', [2, 12]);

export const trees: StaticGameObject[] = [
    //{...tree, position: [5, 11]} as StaticGameObject,
    //{...tree, position: [11, 8]} as StaticGameObject,
    //{...tree, position: [10, 10]} as StaticGameObject,
];


const bamboo = new StaticGameObject([0, 4], `▄
█
█
█
█
█`, new Skin(`T
H
L
H
L
D`, {
      // https://colorpalettes.net/color-palette-412/
      'T': ['#99bc20', 'transparent'],
      'L': ['#517201', 'transparent'],
      'H': ['#394902', 'transparent'],
      'D': ['#574512', 'transparent'],
  }), ` 
 
 
 
 
.`, ``, []);
if (true) {  // random trees
    for (let y = 6; y < 18; y++) {
        const x = (Math.random() * 8 + 1) | 0;
        trees.push(Object.assign(StaticGameObject.createEmpty(), bamboo, {position: [x, y]}));
        const x2 = (Math.random() * 8 + 8) | 0;
        trees.push(Object.assign(StaticGameObject.createEmpty(), bamboo, {position: [x2, y]}));
    }
    for (let tree of trees) {
        tree.setAction(0, 5, (obj) => { 
            obj.enabled = false; 
            console.log("Cut tree");
        });
    }
}

const lamp = new StaticGameObject([0, 2], `⬤
█
█`, new Skin(`L
H
H`, {
      'L': ['yellow', 'transparent'],
      'H': ['#666', 'transparent'],
  }), ` 
 
. `, `B`, []);
lamp.parameters["is_on"] = true;
lamp.setAction(0, 2, (o) => {
    o.parameters["is_on"] = !o.parameters["is_on"];
    o.colors[0][0] = [o.parameters["is_on"] ? 'yellow' : 'gray', 'transparent'];
    o.lights[0] = o.parameters["is_on"] ? 'F' : '0';
});
export const lamps: StaticGameObject[] = [
    StaticGameObject.clone(lamp, { position: [2, 5]}),
];

export const chest = new StaticGameObject([0, 0], `S`, new Skin(`V`, {
    V: ['yellow', 'violet'],
}), `.`, '', [2, 10]);