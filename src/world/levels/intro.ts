import { chest, house, lamps } from "../objects";
import { createTextObject } from "../../utils/misc";
import { emitEvent } from "../../engine/EventLoop";
import { GameEvent } from "../../engine/GameEvent";
import { npcs } from "../npcs";

export const introLevel = [house, chest, ...lamps, ...npcs];

// scripts
chest.setAction(0, 0, function () {
    emitEvent(new GameEvent(chest, "add_object", { object: createTextObject(`VICTORY!`, 6, 6)}));
});