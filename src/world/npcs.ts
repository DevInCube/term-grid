import { ObjectSkin } from "../engine/ObjectSkin";
import { SceneObject } from "../engine/SceneObject";
import { ObjectPhysics } from "../engine/ObjectPhysics";

export class Npc extends SceneObject {

    constructor(
        skin: ObjectSkin, 
        position: [number, number] = [0, 0],
        originPoint: [number, number] = [0, 0]) {
        
        super(originPoint, skin, new ObjectPhysics(`.`, `8`), position);
    }
}

export const npcs = [
    new Npc(new ObjectSkin('🐻', `.`, {
        '.': [undefined, 'transparent'],
    }), [4, 4]),
];