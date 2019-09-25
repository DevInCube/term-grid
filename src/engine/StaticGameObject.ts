import { ObjectSkin as ObjectSkin } from "./ObjectSkin";
import { deepCopy } from "../utils/misc";
import { SceneObject } from "./SceneObject";
import { ObjectPhysics } from "./ObjectPhysics";

export class StaticGameObject extends SceneObject {

    constructor(
        originPoint: [number, number],
        skin: ObjectSkin,
        physics: ObjectPhysics,
        position: [number, number]) {
        super(originPoint, skin, physics, position);
    }

    static createEmpty() { 
        return new StaticGameObject([0, 0], new ObjectSkin(), new ObjectPhysics(), [0, 0]);
    }

    static clone(o: StaticGameObject, params: {}): StaticGameObject {
        return Object.assign(this.createEmpty(), deepCopy(o), params);
    }
}
