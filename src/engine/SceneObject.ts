import { GameEvent, GameEventHandler } from "./GameEvent";
import { ObjectSkin } from "./ObjectSkin";
import { ObjectPhysics } from "./ObjectPhysics";
import { SceneBase } from "./SceneBase";

export type GameObjectAction = (obj: SceneObject) => void;
export type UpdateHandler = (ticks: number, obj: SceneObject, scene: SceneBase) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D) : void;
}

export class SceneObject implements GameEventHandler {
    public enabled = true;
    public important = false;
    public parameters: {[key: string]: any} = {};
    public actions: [[number, number], GameObjectAction][] = [];
    ticks: number = 0;

    constructor(
        public originPoint: [number, number],
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        public position: [number, number]) {
        
        //
    }

    new() { return new SceneObject([0, 0], new ObjectSkin(), new ObjectPhysics(), [0, 0]); }

    // add cb params
    setAction(left: number, top: number, action: GameObjectAction) {
        this.actions.push([[left, top], action]);
    }

    handleEvent(ev: GameEvent) { }

    update(ticks: number, scene: SceneBase) { 
        this.ticks += ticks;
    }
}
