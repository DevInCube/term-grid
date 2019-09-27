import { ObjectSkin } from "../engine/ObjectSkin";
import { emitEvent } from "../engine/EventLoop";
import { GameEvent } from "../engine/GameEvent";
import { Npc } from "../engine/Npc";

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