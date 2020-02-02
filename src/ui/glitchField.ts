import { drawCell, drawObjects, drawObjectAt, CanvasContext } from "../engine/GraphicsEngine";
import { Cell } from "../engine/Cell";
import { viewWidth, viewHeight } from "../main";
import { Npc } from "../engine/Npc";
import { createTextObject } from "../utils/misc";
import { SceneObject } from "../engine/SceneObject";
import { SceneBase } from "../engine/SceneBase";

const glitchFieldDefault = new Cell(' ', 'white', '#a001');

export class GlitchField extends SceneBase {

    constructor() {
        super();
    }

    draw(ctx: CanvasContext) {
        for (let i = 0; i < viewHeight; i++)
            for (let j = 0; j < viewWidth; j++)
                drawCell(ctx, glitchFieldDefault, j, i);
        super.draw(ctx);
    }

    update(ticks: number) {
        super.update(ticks);
    }
}