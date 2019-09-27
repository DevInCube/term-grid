import { Npc } from "./npcs";
import { ObjectSkin } from "../engine/ObjectSkin";

export const hero = new Npc(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
hero.moveSpeed = 10;
hero.showCursor = true;
hero.onUpdate((ticks, o, scene) => {
    const obj = <Npc>o;
    obj.moveTick += ticks;
});