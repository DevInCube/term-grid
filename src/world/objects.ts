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


class Tree extends StaticGameObject {
    constructor() {
        super([1, 3],
            new ObjectSkin(` ░ 
░░░
░░░
 █`, ` o 
o01
01S
 H`, {
                'o': ['#0c0', '#0a0'],
                '0': ['#0a0', '#080'],
                '1': ['#080', '#060'],
                'S': ['#060', '#040'],
                'H': ['sienna', 'transparent'],
            }),
            new ObjectPhysics(`


 .`, ''), [2, 12]);
    }

    new() { return new Tree(); }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const o = this;
        if (o.ticks > 300) {
            o.ticks = 0;
            if (o.parameters["animate"]) {
                o.parameters["tick"] = !o.parameters["tick"];
                o.skin.characters[0] = o.parameters["tick"] ? ` ░ ` : ` ▒ `;
                o.skin.characters[1] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                o.skin.characters[2] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
            }
        }
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        const o = this;
        if (ev.type === 'wind_changed') {
            o.parameters["animate"] = ev.args["to"];
        } else if (ev.type === 'weather_changed') {
            if (ev.args.to === 'snow') {
                o.skin.raw_colors[0][1][1] = 'white';
                o.skin.raw_colors[1][0][1] = 'white';
                o.skin.raw_colors[1][1][1] = '#ccc';
                o.skin.raw_colors[1][2][1] = '#ccc';
            } else {
                o.skin.raw_colors[0][1][1] = '#0a0';
                o.skin.raw_colors[1][0][1] = '#0a0';
                o.skin.raw_colors[1][1][1] = '#080';
                o.skin.raw_colors[1][2][1] = '#080';
            }
        }
    }
};

export const tree = new Tree();

export const trees: StaticGameObject[] = [];

export const bamboo = new StaticGameObject([0, 4],
    new ObjectSkin(`▄
█
█
█
█
█`, `T
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
    }), new ObjectPhysics(` 
 
 
 
 
.`, ``), [0, 0]);
if (true) {  // random trees
    for (let y = 6; y < 18; y++) {
        const x = (Math.random() * 8 + 1) | 0;
        trees.push(clone(bamboo, { position: [x, y] }));
        const x2 = (Math.random() * 8 + 8) | 0;
        trees.push(clone(bamboo, { position: [x2, y] }));
    }
    for (let tree of trees) {
        tree.setAction(0, 5, (obj) => {
            obj.enabled = false;
            // console.log("Cut tree"); @todo sent event
        });
    }
}

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

export const flower = new StaticGameObject([0, 0], new ObjectSkin(`❁`, `V`, {
    V: ['red', 'transparent'],
}), new ObjectPhysics(` `, 'F'), [2, 10]);

export const flowers: StaticGameObject[] = [];
// for (let i = 0; i < 10; i++) {
//     const fl = clone(flower, {position: [Math.random() * 20 | 0, Math.random() * 20 | 0]});
//     flowers.push(fl);
//     fl.onUpdate((ticks, o, scene) => {
//         if (!o.parameters["inited"]) { 
//             o.parameters["inited"] = true;
//             o.skin.raw_colors[0][0][0] = ['red', 'yellow', 'violet'][(Math.random() * 3) | 0]
//         }
//     })
// }


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

export const duck = new StaticGameObject([0, 0],
    new ObjectSkin(`🦆`, `R`, {
        'R': ['white', 'transparent'],
    }),
    new ObjectPhysics(` `), [0, 0]);

