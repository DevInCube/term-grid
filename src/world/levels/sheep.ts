import { Npc } from "../npcs";
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
                    runAway();
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
                        runAway();
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

            function runAway() {
                // let directionToRun = [0, 0];
                // for (const e of enemiesNearby) {
                //     directionToRun[0] += sheep.position[0] - e.position[0]
                //     directionToRun[1] += sheep.position[1] - e.position[1];
                // }
                // for (const fs of fearedSheeps) {
                //     directionToRun[0] += sheep.position[0] - fs.position[0]
                //     directionToRun[1] += sheep.position[1] - fs.position[1];
                // }
                // directionToRun[0] = (directionToRun[0] | 0);
                // directionToRun[1] = (directionToRun[1] | 0);
                // // console.log(directionToRun);

                // // normalize direction
                // sheep.direction[0] = directionToRun[0] !== 0 ? directionToRun[0] / Math.abs(directionToRun[0]) : 0;
                // sheep.direction[1] = directionToRun[1] !== 0 ? directionToRun[1] / Math.abs(directionToRun[1]) : 0;
            }

            function getEnemiesNearby(radius: number) {
                const enemies = [];
                for (const object of scene.objects) {
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

const tree2 = StaticGameObject.clone(tree, {position: [7, 9]});
export const sheepLevel = [...sheeps, ...fences, tree2];