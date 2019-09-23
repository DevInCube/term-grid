import { StaticGameObject } from "./../engine/StaticGameObject";
import { Skin } from "./../engine/Skin";

export const house = new StaticGameObject(` /^\\ 
==*==
 [ ] `, new Skin(` BBB
BBSBB
 WDW`, {
      B: [undefined, 'black'],
      S: [undefined, '#004'],
      W: ["black", "darkred"],
      D: ["black", "saddlebrown"]
  }), `
 ... 
 . .`, [5, 10]);


 export const tree = new StaticGameObject(`   
   
   
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


 .`, [1, 9]);

export let trees: StaticGameObject[] = [
    //{...tree, position: [5, 11]} as StaticGameObject,
    //{...tree, position: [11, 8]} as StaticGameObject,
    //{...tree, position: [10, 10]} as StaticGameObject,
];
if (true) {  // random trees
    for (let y = 4; y < 16; y++) {
        const x = (Math.random() * 8 + 1) | 0;
        trees.push(Object.assign(StaticGameObject.createEmpty(), tree, {position: [x, y]}));
        const x2 = (Math.random() * 8 + 8) | 0;
        trees.push(Object.assign(StaticGameObject.createEmpty(), tree, {position: [x2, y]}));
    }
    for (let tree of trees) {
        tree.setAction(1, 3, (obj) => { 
            obj.enabled = false; 
            console.log("Cut tree");
        });
    }
}

export const chest = new StaticGameObject(`S`, new Skin(`V`, {
    V: ['yellow', 'violet'],
}), `.`, [2, 10]);