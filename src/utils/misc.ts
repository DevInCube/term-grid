import { Skin } from "../engine/Skin";
import { StaticGameObject } from "../engine/StaticGameObject";

export function createTextObject(text: string, x: number, y: number) {
    const colors = new Skin(
        ''.padEnd(text.length, '.'), 
        {'.': [undefined, undefined]});
    const t = new StaticGameObject([0, 0], text, colors, '', '', [x, y]);
    return t;
}