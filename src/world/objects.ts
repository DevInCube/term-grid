import { StaticGameObject } from "./../engine/StaticGameObject";
import { Skin } from "./../engine/Skin";

export const house = new StaticGameObject(` /^\\ 
==*==
 [#] `, new Skin(` BBB
BBSBB
 WDW`, {
      B: [undefined, 'black'],
      S: [undefined, 'darkblue'],
      W: ["black", "darkred"],
      D: ["black", "saddlebrown"]
  }).getRawColors(), `
 ... 
 . .`, [5, 10]);


 export const tree = new StaticGameObject(` o 
  o
o  
  `, new Skin(` 0 
0H0
0H0
 H`, {
      '0': [undefined, 'green'],
      'H': [undefined, 'sienna'],
  }).getRawColors(), `


 .`, [1, 9]);

export const trees = [
    {...tree, position: [5, 11]} as StaticGameObject,
    {...tree, position: [11, 8]} as StaticGameObject,
    {...tree, position: [10, 10]} as StaticGameObject,
];

export const chest = new StaticGameObject(`S`, new Skin(`V`, {
    V: ['yellow', 'violet'],
}).getRawColors(), `.`, [2, 10]);