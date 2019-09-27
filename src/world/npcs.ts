import { ObjectSkin } from "../engine/ObjectSkin";
import { SceneObject } from "../engine/SceneObject";
import { ObjectPhysics } from "../engine/ObjectPhysics";
import { emitEvent } from "../engine/EventLoop";
import { GameEvent } from "../engine/GameEvent";
import { deepCopy, distanceTo } from "../utils/misc";

export class Npc extends SceneObject {
    type: string = "undefined";
    direction: [number, number] = [0, 0];
    moveSpeed: number = 2;  // cells per second
    moveTick: number = 0;

    get cursorPosition(): [number, number] {
        return [
            this.position[0] + this.direction[0], 
            this.position[1] + this.direction[1]
        ];
    }

    constructor(
        skin: ObjectSkin = new ObjectSkin(), 
        position: [number, number] = [0, 0],
        originPoint: [number, number] = [0, 0]) {
        
        super(originPoint, skin, new ObjectPhysics(`.`, `8`), position);
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

const ulan = new Npc(new ObjectSkin('🐻', `.`, {
    '.': [undefined, 'transparent'],
}), [4, 4]);
ulan.setAction(0, 0, (o) => {
    emitEvent(new GameEvent(o, "user_action", {
        subtype: "npc_talk",
        object: o,
    }));
});

export const npcs = [
    ulan,
];