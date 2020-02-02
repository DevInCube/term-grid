import {StaticGameObject} from "../../engine/StaticGameObject";
import {ObjectSkin} from "../../engine/ObjectSkin";
import {ObjectPhysics} from "../../engine/ObjectPhysics";
import {Scene} from "../../engine/Scene";
import {GameEvent} from "../../engine/GameEvent";
import {hero} from "../hero";

type Frame = Array<Array<{ c: string, f: string, b: string }>>;
type FrameAnimation = { [key: number]: Frame };

export class SimpleGlitch extends StaticGameObject {

    isDestroyed = false;

    constructor(
        public hiddenFrames: FrameAnimation,
        public idleFrames: FrameAnimation,
        public clickFrames: FrameAnimation,
        public trigger: { x: number, y: number },
        public button: { x: number, y: number },
    ) {
        super([0, 0],
            new ObjectSkin(`AA
 A`, `aa
 a`, {
                'a': ['#f0f', '#0fff'],
            }),
            new ObjectPhysics(`.`, ''), [0, 0]);
        this.parameters["animate"] = true;
    }

    frames: FrameAnimation;

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
            if (hero.position[0] === this.trigger.x
                && hero.position[1] === this.trigger.y
            ) {
                return this.clickFrames;
            }
            if (hero.position[0] >= this.trigger.x - 2
                && hero.position[0] <= this.trigger.x + 2
                && hero.position[1] >= this.trigger.y - 2
                && hero.position[1] <= this.trigger.y + 2
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
            if (this.frames === this.clickFrames
                && ev.args.x === this.button.x && ev.args.y === this.button.y
            ) {
                this.isDestroyed = true;
            }
        }
    }
}

export const glitch1 = new class Glitch1 extends SimpleGlitch {
    constructor() {
        super(
            {
                450: [
                    [{c: ' ', f: '#0000', b: '#0000'}, {c: ' ', f: '#0000', b: '#0000'}],
                    [{c: ' ', f: '#0000', b: '#0000'}, {c: ' ', f: '#0000', b: '#0000'}]
                ],
            } as { [key: number]: { c: string, f: string, b: string }[][] },
            {
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
            } as { [key: number]: { c: string, f: string, b: string }[][] },
            {
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
            } as { [key: number]: { c: string, f: string, b: string }[][] },
            { x: 37, y: 3 },
            { x: 8, y: 7 },
        );
    }

    new() {
        return new Glitch1();
    }
};

