import { SceneObject } from "./SceneObject";
import { ObjectSkin as ObjectSkin } from "./ObjectSkin";
import { ObjectPhysics } from "./ObjectPhysics";

export class StaticGameObject extends SceneObject {

    constructor(
        originPoint: [number, number],
        skin: ObjectSkin,
        physics: ObjectPhysics,
        position: [number, number]) {
        super(originPoint, skin, physics, position);
    }

    new() { return new StaticGameObject([0, 0], new ObjectSkin(), new ObjectPhysics(), [0, 0]); }
}
