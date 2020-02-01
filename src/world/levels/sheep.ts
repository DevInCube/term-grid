import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene, SceneBase } from "../../engine/Scene";
import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { distanceTo, clone } from "../../utils/misc";
import { tree } from "../objects";
import { GameEvent } from "../../engine/GameEvent";
import { SceneObject } from "../../engine/SceneObject";
import { sprite } from "../sprites/glitchy";
import {glitch} from "./glitch";

const vFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);
const hFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);

const fences: StaticGameObject[] = [];



class Sheep extends Npc {
    type = "glitch";
    maxHealth = 1;
    health = 1;

    constructor() {
        super(new ObjectSkin(`🐑`, `.`, {
            '.': [undefined, 'transparent'],
        }), [0, 0]);
    }

    new() {
        return new Sheep();
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const sheep = this;
        const state = sheep.parameters["state"];
        if (!state) {
            //sheep.parameters["state"] = (Math.random() * 2 | 0) === 0 ? "wandering" : "still";
        }
        sheep.direction = [0, 0];
        //
        let enemiesNearby = this.getMobsNearby(scene, 5, x => x.type !== 'sheep');
        const fearedSheeps = this.getMobsNearby(scene, 2, x => x.type === "sheep" && (x.parameters["stress"] | 0) > 0);
        if (enemiesNearby.length || fearedSheeps.length) {
            if (enemiesNearby.length) {
                sheep.parameters["state"] = "feared";
                sheep.parameters["stress"] = 3;
                sheep.parameters["enemies"] = enemiesNearby;
            } else {  // if (fearedSheeps.length)
                const sheepsStress = Math.max(...fearedSheeps.map(x => x.parameters["stress"] | 0));
                //console.log(sheepsStress);
                sheep.parameters["stress"] = sheepsStress - 1;
                if (sheep.parameters["stress"] === 0) {
                    sheep.parameters["state"] = "still";
                    sheep.parameters["enemies"] = [];
                } else {
                    sheep.parameters["state"] = "feared_2";
                    sheep.parameters["enemies"] = fearedSheeps[0].parameters["enemies"];
                    enemiesNearby = fearedSheeps[0].parameters["enemies"];
                }
            }

        } else {
            sheep.parameters["state"] = "wandering";
            sheep.parameters["stress"] = 0;
            sheep.parameters["enemies"] = [];
        }

        if (state === "wandering") {
            this.moveRandomly();
        }

        if (!scene.isPositionBlocked(sheep.cursorPosition)) {
            sheep.move();
        } else if (sheep.parameters["stress"] > 0) {
            this.runAway(scene, enemiesNearby);
        }

        if (sheep.parameters["state"] === "feared") {
            sheep.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (sheep.parameters["stress"] > 1) {
            sheep.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
        } else if (sheep.parameters["stress"] > 0) {
            sheep.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }
}

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(clone(hFence, { position: [x, 1] }));
        fences.push(clone(hFence, { position: [x, 18] }));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(clone(vFence, { position: [1, y] }));
        fences.push(clone(vFence, { position: [18, y] }));
    }
}

const tree2 = clone(tree, { position: [7, 9] });

const glitchySprite = sprite;

const glitchy = new class extends Npc {
    type = "glitchy";
    moveSpeed = 4;

    constructor() {
        super(glitchySprite.frames["move right"][0], [20, 15]);
    }

    update(ticks: number, scene: SceneBase) {
        super.update(ticks, scene);
        //
        const self = this;
        self.direction = [0, 0];
        //
        const prayList = getPrayNearby(this, 6);
        if (!self.parameters["target"] && prayList.length) {
            self.parameters["target"] = prayList[0];
        }
        const target = self.parameters["target"];
        if (target) {
            if (self.distanceTo(target) <= 1) {
                self.attack(target);
            }
            self.approach(scene, target);
        }

        function getPrayNearby(self: Npc, radius: number) {
            const enemies = [];
            for (const object of scene.objects) {
                if (!object.enabled) continue;
                if (object === self) continue;  // self check
                if (object instanceof Npc && object.type === "sheep") {
                    if (self.distanceTo(object) < radius) {
                        enemies.push(object);
                    }
                }
            }
            return enemies;
        }
    }

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
            this.parameters["target"] = null;
        }
    }
};

export const level = {
    sceneObjects: [...fences, tree2],
    glitches: [glitchy, clone(glitch, { position: [7, 7] })],
};
