import { GameEvent, GameEventHandler } from "./GameEvent";

const events: GameEvent[] = [];

export function eventLoop(handlers: GameEventHandler[]) {
    while (events.length > 0) {
        const ev = events.shift();
        if (ev) {
            for (const obj of handlers) {
                obj.handleEvent(ev);
            }
        }
    }
}

export function emitEvent(ev: GameEvent) {
    events.push(ev);
    console.log("event: ", ev);
}
