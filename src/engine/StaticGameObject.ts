import { Skin } from "./Skin";
import { GameEvent } from "./GameEvent";

export type GameObjectAction = (obj: StaticGameObject) => void;
export type GameObjectEventHandler = (obj: StaticGameObject, ev: GameEvent) => void;

export class StaticGameObject {
    public enabled = true;
    public actions: [[number, number], GameObjectAction][] = [];
    public eventHandlers: GameObjectEventHandler[] = [];
    public updateHandler: GameObjectAction;
    //
    public characters: (string)[];
    public colors: (string | undefined)[][][];
    public collisions: (string)[];
    public lights: (string)[];
    // 
    public parameters: {[key: string]: any} = {};

    constructor(
        public originPoint: [number, number],
        charSkin: string, 
        colorSkin: Skin,
        collisionsMask: string, 
        lightMask: string,
        public position: number[]) {
        
        this.characters = charSkin.split('\n');
        this.colors = colorSkin.getRawColors();
        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
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

    static createEmpty() { 
        return new StaticGameObject([0, 0], '', new Skin(), '', '', [0, 0]);
    }

    static clone(o: StaticGameObject, params: {}): StaticGameObject {
        return Object.assign(this.createEmpty(), o, params);
    }
}
