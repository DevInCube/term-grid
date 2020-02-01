import { Npc } from "../../../engine/Npc";
import { ObjectSkin } from "../../../engine/ObjectSkin";
import { Scene, SceneBase } from "../../../engine/Scene";
import { StaticGameObject } from "../../../engine/StaticGameObject";
import { ObjectPhysics } from "../../../engine/ObjectPhysics";
import { distanceTo, clone } from "../../../utils/misc";
import { tree, house, pillar, arc, duck, flower, bamboo } from "../../objects";
import { GameEvent } from "../../../engine/GameEvent";
import { SceneObject } from "../../../engine/SceneObject";
import { glitch } from "../glitch";
import { viewWidth } from "../../../main";
import { Cell } from "../../../engine/Cell";
import { tiles } from "./tiles";
import { glitchyNpc } from "./npc";

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

const levelWidth = 60;
const levelHeight = 30;

if (true) {  // add fence
    for (let x = 0; x < levelWidth; x++) {
        fences.push(clone(hFence, { position: [x, 0] }));
        fences.push(clone(hFence, { position: [x, levelHeight - 1] }));
    }
    for (let y = 1; y < levelHeight - 1; y++) {
        fences.push(clone(vFence, { position: [0, y] }));
        fences.push(clone(vFence, { position: [levelWidth - 20 + 9, y] }));
    }
}

const trees = [
    clone(tree, { position: [7, 9] }),
    clone(tree, { position: [27, 19] }),
    clone(tree, { position: [5, 28] }),
    clone(tree, { position: [32, 22] }),
    clone(tree, { position: [34, 18] }),
    clone(tree, { position: [47, 2] }),
    clone(tree, { position: [11, 16] }),
    clone(tree, { position: [12, 24] }),
];

const houses = [
    clone(house, { position: [25, 5] }),
    clone(house, { position: [15, 25] }),
]

const pillars = [
    clone(pillar, { position: [7, 21] }),
    clone(pillar, { position: [20, 24] }),
    clone(pillar, { position: [30, 20] }),
];

const arcs = [
    clone(arc, { position: [16, 16] }),
    clone(arc, { position: [32, 25] }),
]

const ducks = [
    clone(duck, { position: [40, 10] }),
    clone(duck, { position: [38, 12] }),
    clone(duck, { position: [44, 25] }),
    clone(duck, { position: [40, 26] }),
    clone(duck, { position: [7, 28] }),
];

const flowers = [
    clone(flower, {position: [7, 4]}),
    clone(flower, {position: [37, 5]}),
    clone(flower, {position: [46, 4]}),
    clone(flower, {position: [44, 7]}),
];

const bamboos = [
    clone(bamboo, {position: [4, 17]}),
    clone(bamboo, {position: [6, 19]}),
    clone(bamboo, {position: [3, 22]}),
    clone(bamboo, {position: [2, 27]}),
    clone(bamboo, {position: [1, 15 ]}),
];

export const level = {
    sceneObjects: [
        ...fences,
        ...trees, ...bamboos,
        ...arcs, ...houses, ...pillars,
        ...ducks, ...flowers],
    glitches: [glitchyNpc, clone(glitch, { position: [7, 7] })],
    tiles: tiles,
};