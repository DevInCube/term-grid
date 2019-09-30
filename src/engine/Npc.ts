import { ObjectSkin } from "./ObjectSkin";
import { SceneObject } from "./SceneObject";
import { ObjectPhysics } from "./ObjectPhysics";
import { deepCopy, distanceTo } from "../utils/misc";
import { Item } from "./Item";

export class Npc extends SceneObject {
    type: string = "undefined";
    direction: [number, number] = [0, 1];
    showCursor: boolean = false;
    moveSpeed: number = 2; // cells per second
    moveTick: number = 0;
    objectInMainHand: Item | null = null;
    objectInSecondaryHand: Item | null = null;
    health: number = 1;
    maxHealth: number = 3;

    get cursorPosition(): [number, number] {
        return [
            this.position[0] + this.direction[0],
            this.position[1] + this.direction[1]
        ];
    }
    constructor(skin: ObjectSkin = new ObjectSkin(), position: [number, number] = [0, 0], originPoint: [number, number] = [0, 0]) {
        super(originPoint, skin, new ObjectPhysics(`.`, ``), position);
        this.important = true;
    }
    move(): void {
        const obj = this;
        if (obj.moveTick >= 1000 / obj.moveSpeed) {
            obj.position[0] += obj.direction[0];
            obj.position[1] += obj.direction[1];
            //
            obj.moveTick = 0;
        }
    }
    distanceTo(other: Npc): number {
        return distanceTo(this.position, other.position);
    }
    static createEmpty() {
        return new Npc();
    }
    static clone(o: Npc, params: {}): Npc {
        return Object.assign(this.createEmpty(), deepCopy(o), params);
    }
}
