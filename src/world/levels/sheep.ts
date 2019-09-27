import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { SceneObject } from "../../engine/SceneObject";
import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { distanceTo } from "../../utils/misc";
import { tree } from "../objects";

const vFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', {'.': ['Sienna', 'transparent']}),
    new ObjectPhysics('.'),
    [0, 0]);
const hFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', {'.': ['Sienna', 'transparent']}),
    new ObjectPhysics('.'),
    [0, 0]);

const sheeps: Npc[] = [];
const wolves: Npc[] = [];
const fences: StaticGameObject[] = [];

const sheep = new Npc(new ObjectSkin(`🐑`, `.`, {
      '.': [undefined, 'transparent'],
  }), [0, 0]);
sheep.type = "sheep";

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(StaticGameObject.clone(hFence, {position: [x, 1]}));
        fences.push(StaticGameObject.clone(hFence, {position: [x, 18]}));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(StaticGameObject.clone(vFence, {position: [1, y]}));
        fences.push(StaticGameObject.clone(vFence, {position: [18, y]}));
    }
}

if (true) {  // random sheeps
    for (let y = 2; y < 17; y++) {
        const parts = 4;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            sheeps.push(Npc.clone(sheep, {position: [x, y]}));
        }
    }
    for (let sheep1 of sheeps) {
        sheep1.setAction(0, 5, (obj) => { 
            //
        });
        sheep1.onUpdate((ticks: number, obj: SceneObject, scene: Scene) => {
            const sheep = <Npc>obj;
            if (!sheep.enabled) return;
            sheep.moveTick += ticks;
            const state = sheep.parameters["state"];
            if (!state) {
                //sheep.parameters["state"] = (Math.random() * 2 | 0) === 0 ? "wandering" : "still";
            }
            sheep.direction = [0, 0];
            //
            let enemiesNearby = getEnemiesNearby(5);
            const fearedSheeps = getFearedSheepNearby(2);
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
                sheep.parameters["state"] = "still";
                sheep.parameters["stress"] = 0;
                sheep.parameters["enemies"] = [];
            }
            
            if (state === "wandering") {
                if ((Math.random() * 3 | 0) === 0) {
                    moveRandomly()
                }
            }

            if (!scene.isPositionBlocked(sheep.cursorPosition)) {
                sheep.move();
            } else if (sheep.parameters["stress"] > 0) {
                const possibleDirs: {direction: [number, number], available?: boolean, distance?: number}[] = [
                    { direction: [-1, 0] },
                    { direction: [+1, 0] },
                    { direction: [0, -1] },
                    { direction: [0, +1] },
                ];
                for (let pd of possibleDirs) {
                    const position: [number, number] = [
                        sheep.position[0] + pd.direction[0],
                        sheep.position[1] + pd.direction[1],
                    ];
                    pd.available = !scene.isPositionBlocked(position);
                    if (enemiesNearby.length)
                        pd.distance = distanceTo(position, enemiesNearby[0].position); 
                }
                const direction = possibleDirs.filter(x => x.available);
                direction.sort((x, y) => <number>y.distance - <number>x.distance);
                if (direction.length) {
                    sheep.direction = direction[0].direction;
                    sheep.move();
                }
            }

            if (sheep.parameters["state"] === "feared") {
                sheep.skin.raw_colors[0][0] = [undefined, "OrangeRed"];
            } else if (sheep.parameters["stress"] > 1) {
                sheep.skin.raw_colors[0][0] = [undefined, "Coral"];
            } else if (sheep.parameters["stress"] > 0) {
                sheep.skin.raw_colors[0][0] = [undefined, "Orange"];
            } else {
                sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
            }

            function moveRandomly() {
                sheep.direction[0] = (Math.random() * 3 | 0) - 1;
                sheep.direction[1] = (Math.random() * 3 | 0) - 1;
            }

            function getEnemiesNearby(radius: number) {
                const enemies = [];
                for (const object of scene.objects) {
                    if (!object.enabled) continue;
                    if (object === sheep) continue;  // self check
                    if (object instanceof Npc && object.type !== "sheep") {
                        if (sheep.distanceTo(object) < radius) {
                            enemies.push(object);
                        }
                    }
                }
                return enemies;
            }

            function getFearedSheepNearby(radius: number) {
                const sheepsNearby = [];
                for (const object of scene.objects) {
                    if (!object.enabled) continue;
                    if (object === sheep) continue;  // self check
                    if (object instanceof Npc && object.type === "sheep") {
                        if (sheep.distanceTo(object) < radius 
                            && (object.parameters["stress"] | 0) > 0) {
                            sheepsNearby.push(object);
                        }
                    }
                }
                return sheepsNearby;
            }
        });
    }
}

const wolf = new Npc(new ObjectSkin(`🐺`, `.`, {
    '.': [undefined, 'transparent'],
}), [15, 15]);
wolf.type = "wolf";
wolf.moveSpeed = 4;
wolf.onUpdate((ticks: number, obj: SceneObject, scene: Scene) => {
    const wolf = <Npc>obj;
    wolf.moveTick += ticks;
    wolf.direction = [0, 0];
    //
    const prayList = getPrayNearby(6);
    if (prayList.length) {
        wolf.parameters["target"] = prayList[0];
    }
    const target = wolf.parameters["target"];
    if (target) {
        if (wolf.distanceTo(target) <= 1) {
            target.enabled = false;  // eat prey
            console.log("Wolf ate sheep");
            wolf.parameters["target"] = null;
        }
        const possibleDirs: {direction: [number, number], available?: boolean, distance?: number}[] = [
            { direction: [-1, 0] },
            { direction: [+1, 0] },
            { direction: [0, -1] },
            { direction: [0, +1] },
        ];
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                wolf.position[0] + pd.direction[0],
                wolf.position[1] + pd.direction[1],
            ];
            pd.available = !scene.isPositionBlocked(position);
            pd.distance = distanceTo(position, target.position);
        }
        const direction = possibleDirs.filter(x => x.available);
        direction.sort((x, y) => <number>x.distance - <number>y.distance);
        if (direction.length) {
            wolf.direction = direction[0].direction;
            wolf.move();
        }
    }

    function getPrayNearby(radius: number) {
        const enemies = [];
        for (const object of scene.objects) {
            if (!object.enabled) continue;
            if (object === wolf) continue;  // self check
            if (object instanceof Npc && object.type === "sheep") {
                if (wolf.distanceTo(object) < radius) {
                    enemies.push(object);
                }
            }
        }
        return enemies;
    }
});
wolves.push(wolf);

const tree2 = StaticGameObject.clone(tree, {position: [7, 9]});
export const sheepLevel = [...sheeps, ...wolves, ...fences, tree2];