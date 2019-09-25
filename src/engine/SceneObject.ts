import { GameEvent } from "./GameEvent";
import { Skin } from "./Skin";
import { ObjectPhysics } from "./ObjectPhysics";

export type GameObjectAction = (obj: SceneObject) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export class SceneObject {
    public enabled = true;
    public parameters: {[key: string]: any} = {};
    public actions: [[number, number], GameObjectAction][] = [];
    public eventHandlers: GameObjectEventHandler[] = [];
    public updateHandler: GameObjectAction;

    constructor(
        public originPoint: [number, number],
        public skin: Skin,
        public physics: ObjectPhysics,
        public position: number[]) {
        
        //
    }
    // add cb params
    setAction(left: number, top: number, action: GameObjectAction) {
        this.actions.push([[left, top], action]);
    }

    addEventHandler(handler: GameObjectEventHandler) {
        this.eventHandlers.push(handler);
    }

    handleEvent(ev: GameEvent) {
        for (const eh of this.eventHandlers) {
            eh(this, ev);
        }
    }

    onUpdate(handler: GameObjectAction) {
        this.updateHandler = handler;
    }
}