export class StaticGameObject {

    public enabled = true;
    public actions: [[number, number], (obj: StaticGameObject) => void][];

    constructor(
        public skin: string, 
        public colors: (string | undefined)[][][], 
        public collisions: string, 
        public position: number[]) {

        this.actions = [];
    }
    // add cb params
    setAction(left: number, top: number, action: (obj: StaticGameObject) => void) {
        this.actions.push([[left, top], action]);
    }

    static createEmpty() { 
        return new StaticGameObject('', [[[]]], '', []);
    }
}
