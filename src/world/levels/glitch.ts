import {StaticGameObject} from "../../engine/StaticGameObject";
import {ObjectSkin} from "../../engine/ObjectSkin";
import {ObjectPhysics} from "../../engine/ObjectPhysics";
import {Scene} from "../../engine/Scene";
import {GameEvent} from "../../engine/GameEvent";
import {hero} from "../hero";

export class Glitch extends StaticGameObject {

    isDestroyed = false;

    hiddenFrames = {
        450: [
            [{c: ' ', f: '#0000', b: '#0000'}, {c: ' ', f: '#0000', b: '#0000'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: ' ', f: '#0000', b: '#0000'}]
        ],
    } as { [key: number]: {c: string, f: string, b: string}[][] };

    idleFrames = {
        450: [
            [{c: '$', f: '#0f0', b: '#f0f'}, {c: '@', f: '#0f0', b: '#f0f'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
        500: [
            [{c: 'z', f: '#f0f', b: '#0ff'}, {c: '@', f: '#0f0', b: '#f0f'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
        530: [
            [{c: 'z', f: '#0f0', b: '#f0f'}, {c: '@', f: '#0f0', b: '#f0f'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: 'x', f: '#0f0', b: '#f0f'}]
        ],
        950: [
            [{c: 's', f: '#0f0', b: '#f0f'}, {c: '@', f: '#0f0', b: '#f0f'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
    } as { [key: number]: {c: string, f: string, b: string}[][] };


    clickFrames = {
        450: [
            [{c: '$', f: '#0f0', b: '#f0f'}, {c: '+', f: '#0f0', b: '#f0a'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
        500: [
            [{c: 'z', f: '#f0f', b: '#0ff'}, {c: '+', f: '#0f0', b: '#f0a'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
        530: [
            [{c: 'z', f: '#0f0', b: '#f0f'}, {c: '+', f: '#0f0', b: '#f0a'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: 'x', f: '#0f0', b: '#f0f'}]
        ],
        950: [
            [{c: 's', f: '#0f0', b: '#f0f'}, {c: '+', f: '#0f0', b: '#f0a'}],
            [{c: ' ', f: '#0000', b: '#0000'}, {c: '@', f: '#0f0', b: '#f0f'}]
        ],
    } as { [key: number]: {c: string, f: string, b: string}[][] };

    frames = this.clickFrames;

    constructor() {
        super([0, 0],
            new ObjectSkin(`AA
 A`, `aa
 a`, {
                'a': ['#f0f', '#0fff'],
            }),
            new ObjectPhysics(`.`, ''), [0, 0]);
        this.parameters["animate"] = true;
    }

    new() {
        return new Glitch();
    }

    getFrame() {
        const keys = Object.keys(this.frames).map(k => Number(k)).sort();

        const frameKey = (() => {
            while (true) {
                const key = keys.find(k => k > this.ticks);
                if ("undefined" === typeof key) {
                    this.ticks -= keys[keys.length - 1];
                } else {
                    return key;
                }
            }
        })();

        return this.frames[frameKey];
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        this.frames = (() => {
            if (this.isDestroyed) {
                return this.hiddenFrames;
            }
            if (hero.position[0] === 10 && hero.position[1] === 10) {
                return this.clickFrames;
            }
            if (hero.position[0] >= 10 - 2 && hero.position[0] <= 10 + 2
                && hero.position[1] >= 10 - 2 && hero.position[1] <= 10 + 2
            ) {
                return this.idleFrames;
            }
            return this.hiddenFrames;
        })();



        const frame = this.getFrame();
        const o = this;

        for (let x = 0; x < frame.length; x++) {
            o.skin.characters[x] = frame[x].map(s => s.c).join("");
            for (let y = 0; y < frame[x].length; y++) {
                o.skin.raw_colors[x][y][0] = frame[x][y].f;
                o.skin.raw_colors[x][y][1] = frame[x][y].b;
            }
        }
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        if (ev.type === "click") {
            if (this.frames === this.clickFrames && ev.args.x === 8 && ev.args.y === 7) {
                this.isDestroyed = true;
            }
        }
    }
}

export const glitch = new Glitch();

