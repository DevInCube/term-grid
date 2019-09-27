import { Npc } from "../engine/Npc";
import { ObjectSkin } from "../engine/ObjectSkin";
import { lamp } from "./items";

export const hero = new Npc(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
hero.moveSpeed = 10;
hero.showCursor = true;
hero.objectInMainHand = lamp;
hero.onUpdate((ticks, o, scene) => {
    const obj = <Npc>o;
    obj.moveTick += ticks;
    if(obj.objectInMainHand) {
        obj.objectInMainHand.position = obj.cursorPosition;
    }
});