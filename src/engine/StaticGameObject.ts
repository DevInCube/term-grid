export class StaticGameObject {
    public actions: [[number, number], () => void][];
    constructor(public skin: string, public colors: (string | undefined)[][][], public collisions: string, public position: number[]) {
        this.actions = [];
    }
    // add cb params
    setAction(left: number, top: number, action: () => void) {
        this.actions.push([[left, top], action]);
    }
}
