import { Npc } from "../engine/Npc";
import { ObjectSkin } from "../engine/ObjectSkin";
import { lamp, sword } from "./items";
import { Scene } from "../engine/Scene";
import { Item } from "../engine/Item";

export const hero = new class extends Npc{
    type = "human";
    moveSpeed = 10;
    showCursor = true;
    objectInMainHand: Item | null = sword;
    objectInSecondaryHand: Item | null = lamp;

    constructor() {
        super(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const obj = this;
        obj.moveTick += ticks;
    }
};