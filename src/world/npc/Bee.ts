import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";

class Bee extends Npc {
    type = "bee";
    maxHealth = 1;
    health = 1;
    constructor() {
        super(new ObjectSkin(`🐝`, `.`, {
            '.': ['yellow', 'transparent'],
        }), [0, 0]);
    }
    new() {
        return new Bee();
    }
    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const self = this;
        self.direction = [0, 0];
        //
        this.moveRandomly();
        if (!scene.isPositionBlocked(self.cursorPosition)) {
            self.move();
        }
    }
}

export const bee = new Bee();