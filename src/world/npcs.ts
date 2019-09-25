import { ObjectSkin } from "../engine/ObjectSkin";
import { SceneObject } from "../engine/SceneObject";
import { ObjectPhysics } from "../engine/ObjectPhysics";
import { emitEvent } from "../engine/EventLoop";
import { GameEvent } from "../engine/GameEvent";

export class Npc extends SceneObject {

    constructor(
        skin: ObjectSkin, 
        position: [number, number] = [0, 0],
        originPoint: [number, number] = [0, 0]) {
        
        super(originPoint, skin, new ObjectPhysics(`.`, `8`), position);
        this.important = true;
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