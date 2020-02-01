import { drawCell, drawObjects, drawObjectAt, CanvasContext } from "../engine/GraphicsEngine";
import { Cell } from "../engine/Cell";
import { viewWidth, viewHeight } from "../main";
import { Npc } from "../engine/Npc";
import { createTextObject } from "../utils/misc";
import { SceneObject, Drawable } from "../engine/SceneObject";
import { Scene } from "../engine/Scene";

const uiBackground = new Cell(' ', 'white', '#003');

export class PlayerUi implements Drawable {
    objectUnderCursor: SceneObject | null = null;

    constructor(public npc: Npc) {
    }

    draw(ctx: CanvasContext) {
        const uiHeight = viewHeight;
        const uiWidth = 10;
        const left = viewWidth - uiWidth;
        const top = 0;
        for (let i = 0; i < uiHeight; i++)
            for (let j = 0; j < uiWidth; j++) {
                drawCell(ctx, uiBackground, left + j, top + i);
            }
        for (let i = 0; i < this.npc.maxHealth; i++) {
            drawCell(ctx, new Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent'), left + i, top + 0);
        }
        if (this.objectUnderCursor) {
            if (this.objectUnderCursor instanceof Npc) {
                drawObjectAt(ctx, this.objectUnderCursor, [viewWidth - 1, 0]);
                for (let i = 0; i < this.objectUnderCursor.maxHealth; i++) {
                    drawCell(ctx, new Cell(`♥`, i <= this.objectUnderCursor.health ? 'red' : 'gray', 'transparent'), viewWidth - this.objectUnderCursor.maxHealth + i - 1, 0);
                }
            }
        }
    }

    update(ticks: number, scene: Scene) {
        this.objectUnderCursor = null;
        for (let o of scene.objects) {
            if (!o.enabled) continue;
            if (o instanceof Npc) {
                if (o.position[0] === this.npc.cursorPosition[0]
                    && o.position[1] === this.npc.cursorPosition[1]) {
                    this.objectUnderCursor = o;
                    break;
                }
            }
        }
    }
}