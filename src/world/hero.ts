import { Npc } from "../engine/Npc";
import { ObjectSkin } from "../engine/ObjectSkin";
import { lamp } from "./items";
import { Scene } from "../engine/Scene";

export const hero = new class extends Npc{
    type = "human";
    moveSpeed = 10;
    showCursor = true;
    objectInSecondaryHand = lamp;

    constructor() {
        super(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const obj = this;
        obj.moveTick += ticks;
        if(obj.objectInMainHand) {
            obj.objectInMainHand.position = obj.cursorPosition;
        }
        if(obj.objectInSecondaryHand) {
            obj.objectInSecondaryHand.position = [
                obj.position[0] + obj.direction[1],
                obj.position[1] - obj.direction[0],
            ];
        }
    }
};