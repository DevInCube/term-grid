import { Skin } from "./Skin";

export type GameObjectAction = (obj: StaticGameObject) => void;

export class StaticGameObject {

    // @todo add origin point
    public enabled = true;
    public actions: [[number, number], GameObjectAction][];
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
        //
        this.actions = [];
    }
    // add cb params
    setAction(left: number, top: number, action: GameObjectAction) {
        this.actions.push([[left, top], action]);
    }

    static createEmpty() { 
        return new StaticGameObject([0, 0], '', new Skin(), '', '', [0, 0]);
    }

    static clone(o: StaticGameObject, params: {}): StaticGameObject {
        return Object.assign(this.createEmpty(), o, params);
    }
}
