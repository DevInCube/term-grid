import { chest, flowers, house, tree, trees, lamps } from "../objects";
import { createTextObject } from "../../utils/misc";
import { emitEvent } from "../../engine/EventLoop";
import { GameEvent } from "../../engine/GameEvent";
import { npcs } from "../npcs";

export const introLevel = [...flowers, house, chest, tree, ...trees, ...lamps, ...npcs];

// scripts
chest.setAction(0, 0, function () {
    emitEvent(new GameEvent(chest, "add_object", { object: createTextObject(`VICTORY!`, 6, 6)}));
});