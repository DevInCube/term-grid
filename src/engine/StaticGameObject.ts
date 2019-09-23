import { Skin } from "./Skin";

export type GameObjectAction = (obj: StaticGameObject) => void;

export class StaticGameObject {

    public enabled = true;
    public actions: [[number, number], GameObjectAction][];
    //
    public characters: (string)[];
    public colors: (string | undefined)[][][];
    public collisions: (string)[];

    constructor(
        charSkin: string, 
        colorSkin: Skin,
        collisionsMask: string, 
        public position: number[]) {
        
        this.characters = charSkin.split('\n');
        this.colors = colorSkin.getRawColors();
        this.collisions = collisionsMask.split('\n');
        //
        this.actions = [];
    }
    // add cb params
    setAction(left: number, top: number, action: GameObjectAction) {
        this.actions.push([[left, top], action]);
    }

    static createEmpty() { 
        return new StaticGameObject('', new Skin(), '', []);
    }
}
