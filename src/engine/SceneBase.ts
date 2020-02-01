import { SceneObject } from "./SceneObject";
import { drawObjects, isCollision } from "./GraphicsEngine";
import { GameEvent, GameEventHandler } from "./GameEvent";

export class SceneBase implements GameEventHandler {
    objects: SceneObject[] = [];

    handleEvent(ev: GameEvent): void {
    }

    update(ticks: number) {
        for (const obj of this.objects) {
            if (!obj.enabled) continue;
            obj.update(ticks, this);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // sort objects by origin point
        this.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        drawObjects(ctx, this.objects);
    }

    // extra
    isPositionBlocked(position: [number, number]) {
        for (let object of this.objects) {
            if (!object.enabled) continue;
            const pleft = position[0] - object.position[0] + object.originPoint[0];
            const ptop = position[1] - object.position[1] + object.originPoint[1];
            if (isCollision(object, pleft, ptop)) {
                return true;
            }
        }
        return false;
    }
}