import { StaticGameObject } from "./StaticGameObject";

export class GameEvent {

    constructor(
        public sender: StaticGameObject | string | null,
        public type: string, 
        public args: {[key: string]: any},
    ) {

    }
}
