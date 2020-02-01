import { StaticGameObject } from "./../engine/StaticGameObject";
import { ObjectSkin } from "../engine/ObjectSkin";
import { ObjectPhysics } from "../engine/ObjectPhysics";
import { GameEvent } from "../engine/GameEvent";
import { Scene, SceneBase } from "../engine/Scene";
import { SceneObject } from "../engine/SceneObject";
import { clone } from "../utils/misc";
import { Npc } from "../engine/Npc";
import { glitchySprite } from "./sprites/glitchy";


export const house = new StaticGameObject([2, 2],
    new ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
        B: [undefined, 'black'],
        S: [undefined, '#004'],
        W: ["black", "darkred"],
        D: ["black", "saddlebrown"]
    }),
    new ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]);



const lamp = new StaticGameObject([0, 2],
    new ObjectSkin(`⬤
█
█`, `L
H
H`, {
        'L': ['yellow', 'transparent'],
        'H': ['#666', 'transparent'],
    }),
    new ObjectPhysics(` 
 
. `, `B`), [0, 0]);
lamp.parameters["is_on"] = true;
lamp.setAction(0, 2, (o) => {
    o.parameters["is_on"] = !o.parameters["is_on"];
    o.skin.raw_colors[0][0] = [o.parameters["is_on"] ? 'yellow' : 'gray', 'transparent'];
    o.physics.lights[0] = o.parameters["is_on"] ? 'F' : '0';
});
export const lamps: StaticGameObject[] = [
    clone(lamp, { position: [2, 5] }),
];

export const chest = new StaticGameObject([0, 0], new ObjectSkin(`S`, `V`, {
    V: ['yellow', 'violet'],
}), new ObjectPhysics(`.`, ''), [2, 10]);

export const pillar = new StaticGameObject([0, 3],
    new ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
        'L': ['yellow', 'transparent'],
        'H': ['white', 'transparent'],
        'B': ['#777', 'transparent'],
    }),
    new ObjectPhysics(` 
 
 
. `), [0, 0]);

export const arc = new StaticGameObject([2, 3],
    new ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
        'L': ['orange', 'brown'],
        'H': ['white', 'transparent'],
        'B': ['gray', 'transparent'],
    }),
    new ObjectPhysics(`     
     
     
.   .`), [0, 0]);

export const shop = new StaticGameObject([2, 3],
    new ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
        'L': ['lightgray', 'brown'],
        'H': ['gray', 'transparent'],
        'B': ['brown', 'transparent'],
        'T': ['orange', 'brown'],
    }),
    new ObjectPhysics(`       
       
       
 ..... `), [0, 0]);
