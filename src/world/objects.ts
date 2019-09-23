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


 export const tree = new StaticGameObject([1, 3], `   
   
   
  `, new Skin(` o 
o01
01S
 H`, {
      'o': [undefined, '#0a0'],
      '0': [undefined, '#080'],
      '1': [undefined, '#060'],
      'S': [undefined, '#040'],
      'H': [undefined, 'sienna'],
  }), `


 .`, '', [2, 12]);

export const trees: StaticGameObject[] = [
    //{...tree, position: [5, 11]} as StaticGameObject,
    //{...tree, position: [11, 8]} as StaticGameObject,
    //{...tree, position: [10, 10]} as StaticGameObject,
];


const bamboo = new StaticGameObject([0, 4], `▁
▔
▁
▔
▁
▔`, new Skin(`T
H
L
H
L
D`, {
      // https://colorpalettes.net/color-palette-412/
      'T': ['#8f7f53', '#99bc20'],
      'L': ['#8f7f53', '#517201'],
      'H': ['#392b04', '#394902'],
      'D': ['#392b04', '#574512'],
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

const lamp = new StaticGameObject([0, 2], ` 
 
 `, new Skin(`L
H
H`, {
      'L': [undefined, 'yellow'],
      'H': [undefined, '#333'],
  }), ` 
 
. `, `B`, []);
export const lamps: StaticGameObject[] = [
    StaticGameObject.clone(lamp, { position: [2, 5]}),
];

export const chest = new StaticGameObject([0, 0], `S`, new Skin(`V`, {
    V: ['yellow', 'violet'],
}), `.`, '', [2, 10]);