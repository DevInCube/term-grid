import { ObjectSkin } from "../../../engine/ObjectSkin";
import { SceneBase } from "../../../engine/Scene";
import { StaticGameObject } from "../../../engine/StaticGameObject";
import { ObjectPhysics } from "../../../engine/ObjectPhysics";
import { distanceTo, clone } from "../../../utils/misc";
import { house, pillar, arc, shop } from "../../objects";
import { GameEvent } from "../../../engine/GameEvent";
import { SceneObject } from "../../../engine/SceneObject";
import { glitch } from "../glitch";
import { viewWidth } from "../../../main";
import { Cell } from "../../../engine/Cell";
import { tiles } from "./tiles";
import { glitchyNpc } from "./npc";
import { lamp } from "../../items";
import { Sheep } from "../../npc/Sheep";
import { hFence, vFence, beehive } from "../../objects/artificial";
import { tree, duck, wheat, flower, bamboo, hotspring, sakura } from "../../objects/natural";
import { bee } from "../../npc/Bee";

const levelWidth = 60;
const levelHeight = 30;

const fences: StaticGameObject[] = [];
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

const extraFences = [
    clone(vFence, { position: [28, 7] }),
    clone(vFence, { position: [29, 7] }),
    clone(vFence, { position: [30, 7] }),
    clone(vFence, { position: [31, 7] }),
]

const trees = [
    { position: [7, 9] },
    { position: [27, 19] },
    { position: [5, 28] },
    { position: [34, 18] },
    { position: [47, 2] },
    { position: [11, 16] },
    { position: [12, 24] },
    { position: [17, 3] },
    { position: [23, 5] },
    { position: [27, 5] },
    { position: [33, 8] },
    { position: [37, 7] },
    { position: [42, 9] },
].map(x => clone(tree, x));

const sakuras = [
    { position: [37, 22] },
    { position: [42, 18] },
    { position: [47, 19] },
    { position: [40, 24] },
    { position: [43, 22] },
    { position: [26, 24] },
    { position: [32, 20] },
].map(x => clone(sakura, x));

const houses = [
    clone(house, { position: [25, 5] }),
    clone(house, { position: [15, 25] }),
    clone(house, { position: [13, 3] }),
    clone(house, { position: [3, 10] }),
]

const lamps = [
    clone(lamp, { position: [27, 5] }),
    clone(lamp, { position: [13, 25] }),
    clone(lamp, { position: [15, 3] }),
    clone(lamp, { position: [1, 10] }),
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

const shops = [
    {position: [18, 10]}
].map(x => clone(shop, x));

const ducks = [
    { position: [40, 10] },
    { position: [38, 12] },
    { position: [44, 25] },
    { position: [40, 26] },
    { position: [7, 28] },
].map(x => clone(duck, x));

const sheep = new Sheep();
const sheepList = [
    { position: [44, 16] },
    { position: [48, 16] },
    { position: [43, 14] },
    { position: [46, 12] },
].map(x => clone(sheep, x));

const wheats = [
    { position: [31, 4] },
    { position: [31, 5] },
    { position: [30, 3] },
    { position: [31, 3] },
    { position: [28, 2] },
    { position: [29, 2] },
    { position: [29, 3] },
    { position: [29, 5] },
    { position: [28, 6] },
].map(x => clone(wheat, x));

const flowers = [
    { position: [7, 4] },
    { position: [37, 5] },
    { position: [46, 4] },
    { position: [44, 7] },
    { position: [34, 3] },
    { position: [37, 3] },
    { position: [38, 1] },
].map(x => clone(flower, x));

const bamboos = [
    { position: [4, 17] },
    { position: [6, 19] },
    { position: [3, 22] },
    { position: [2, 27] },
    { position: [1, 15] },
].map(x => clone(bamboo, x));

const beehives = [
    { position: [34, 2] },
    { position: [36, 2] },
    { position: [34, 4] },
    { position: [36, 4] },
    { position: [38, 2] },
    { position: [38, 4] },
].map(x => clone(beehive, x));

const bees = [
    { position: [35, 2] },
    { position: [34, 5] },
    { position: [40, 3] },
].map(x => clone(bee, x));

const hotsprings = [
    { position: [22, 18] },
    { position: [21, 15] },
    { position: [24, 19] },
].map(x => clone(hotspring, x));

export const level = {
    sceneObjects: [
        ...fences, ...extraFences,
        ...trees, ...sakuras, ...bamboos,
        ...arcs, ...shops, ...houses, ...pillars, ...beehives,
        ...flowers, ...lamps, ...wheats,
        ...hotsprings,
        ...ducks, ...bees, ...sheepList,
    ],
    glitches: [/*glitchyNpc,*/ clone(glitch, { position: [7, 7] })],
    tiles: tiles,
};
