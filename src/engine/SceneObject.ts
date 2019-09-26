import { GameEvent, GameEventHandler } from "./GameEvent";
import { ObjectSkin } from "./ObjectSkin";
import { ObjectPhysics } from "./ObjectPhysics";
import { Scene } from "./Scene";

export type GameObjectAction = (obj: SceneObject) => void;
export type UpdateHandler = (obj: SceneObject, scene: Scene) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D) : void;
}

export class SceneObject implements GameEventHandler {
    public enabled = true;
    public important = false;
    public parameters: {[key: string]: any} = {};
    public actions: [[number, number], GameObjectAction][] = [];
    public eventHandlers: GameObjectEventHandler[] = [];
    public updateHandler: UpdateHandler;

    constructor(
        public originPoint: [number, number],
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        public position: [number, number]) {
        
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

    onUpdate(handler: UpdateHandler) {
        this.updateHandler = handler;
    }
}
