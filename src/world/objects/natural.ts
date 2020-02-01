import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { GameEvent } from "../../engine/GameEvent";
import { SceneBase } from "../../engine/Scene";

export const flower = new StaticGameObject([0, 0], new ObjectSkin(`❁`, `V`, {
    V: ['red', 'transparent'],
}), new ObjectPhysics(` `, 'F'), [2, 10]);

export const wheat = new StaticGameObject([0, 0],
    new ObjectSkin(`♈`, `R`, {
        'R': ['yellow', 'transparent'],
    }),
    new ObjectPhysics(` `), [0, 0]);

export const hotspring = new StaticGameObject([0, 0],
    new ObjectSkin(`♨`, `R`, {
        'R': ['black', 'transparent'],
    }),
    new ObjectPhysics(` `), [0, 0]);

export const duck = new StaticGameObject([0, 0],
    new ObjectSkin(`🦆`, `R`, {
        'R': ['white', 'transparent'],
    }),
    new ObjectPhysics(` `), [0, 0]);


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

    update(ticks: number, scene: SceneBase) {
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