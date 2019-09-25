import { SceneObject } from "./SceneObject";

export class GameEvent {

    constructor(
        public sender: GameEventHandler | string | null,
        public type: string, 
        public args: {[key: string]: any},
    ) {

    }
}

export interface GameEventHandler {
    handleEvent(ev: GameEvent) : void;
}