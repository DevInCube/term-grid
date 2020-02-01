import { drawCell, drawObjects, drawObjectAt } from "../engine/GraphicsEngine";
import { Cell } from "../engine/Cell";
import { viewWidth, viewHeight } from "../main";
import { Npc } from "../engine/Npc";
import { createTextObject } from "../utils/misc";
import { SceneObject } from "../engine/SceneObject";
import { SceneBase } from "../engine/Scene";

export class GlitchField extends SceneBase {

    constructor() {
        super();
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < viewHeight; i++)
            for (let j = 0; j < viewWidth; j++)
                drawCell(ctx, new Cell(' ', 'white', '#a001'), j, i);
        super.draw(ctx);
    }

    update(ticks: number) {
        super.update(ticks);
    }
}