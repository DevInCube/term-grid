import { GameEvent } from "../../../engine/GameEvent";
import { SceneBase } from "../../../engine/SceneBase";
import { glitchySprite } from "../../sprites/glitchy";
import { Npc } from "../../../engine/Npc";

export const glitchyNpc = new class extends Npc {
    type = "glitchy";
    moveSpeed = 4;

    constructor() {
        super(glitchySprite.frames["move right"][0], [20, 15]);
    }

    update(ticks: number, scene: SceneBase) {
        super.update(ticks, scene);
        //
        const self = this;
        self.direction = [0, 0];
        //
        const prayList = getPrayNearby(this, 6);
        if (!self.parameters["target"] && prayList.length) {
            self.parameters["target"] = prayList[0];
        }
        const target = self.parameters["target"];
        if (target) {
            if (self.distanceTo(target) <= 1) {
                self.attack(target);
            }
            self.approach(scene, target);
        }

        function getPrayNearby(self: Npc, radius: number) {
            const enemies = [];
            for (const object of scene.objects) {
                if (!object.enabled) continue;
                if (object === self) continue;  // self check
                if (object instanceof Npc && object.type === "sheep") {
                    if (self.distanceTo(object) < radius) {
                        enemies.push(object);
                    }
                }
            }
            return enemies;
        }
    }

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
            this.parameters["target"] = null;
        }
    }
}
