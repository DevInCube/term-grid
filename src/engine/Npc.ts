import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "./ObjectSkin";
import { ObjectPhysics } from "./ObjectPhysics";
import { distanceTo } from "../utils/misc";
import { Item } from "./Item";
import { emitEvent } from "./EventLoop";
import { GameEvent } from "./GameEvent";
import { Scene, SceneBase } from "./Scene";

export class Npc extends SceneObject {
    type: string = "undefined";
    direction: [number, number] = [0, 1];
    showCursor: boolean = false;
    moveSpeed: number = 2; // cells per second
    moveTick: number = 0;
    objectInMainHand: Item | null = null;
    objectInSecondaryHand: Item | null = null;
    health: number = 1;
    maxHealth: number = 3;
    basicAttack: number = 1;
    attackTick: number = 0;
    attackSpeed: number = 1; // atk per second

    get attackValue(): number {
        return this.basicAttack;  // @todo
    }

    get cursorPosition(): [number, number] {
        return [
            this.position[0] + this.direction[0],
            this.position[1] + this.direction[1]
        ];
    }

    constructor(skin: ObjectSkin = new ObjectSkin(), position: [number, number] = [0, 0], originPoint: [number, number] = [0, 0]) {
        super(originPoint, skin, new ObjectPhysics(`.`, ``), position);
        this.important = true;
    }

    new() { return new Npc(); }

    update(ticks: number, scene: SceneBase) {
        super.update(ticks, scene);
        this.moveTick += ticks;
        this.attackTick += ticks;
        //
        const obj = this;
        if(obj.objectInMainHand) {
            obj.objectInMainHand.position = [
                obj.cursorPosition[0],
                obj.cursorPosition[1],
            ];
        }
        if(obj.objectInSecondaryHand) {
            obj.objectInSecondaryHand.position = [
                obj.position[0] + obj.direction[1],
                obj.position[1] - obj.direction[0],
            ];
        }
    }

    move(): void {
        const obj = this;
        if (obj.moveTick >= 1000 / obj.moveSpeed) {
            obj.position[0] += obj.direction[0];
            obj.position[1] += obj.direction[1];
            //
            obj.moveTick = 0;
        }
    }

    attack(target: Npc): void {
        if (this.attackTick > 1000 / this.attackSpeed) {
            this.attackTick = 0;
            emitEvent(new GameEvent(this, "attack", {
                object: this,
                subject: target,
            }));
        }
    }

    distanceTo(other: Npc): number {
        return distanceTo(this.position, other.position);
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        if (ev.type === "attack" && ev.args.subject === this) {
            const damage = ev.args.object.attackValue;
            this.health -= damage;
            emitEvent(new GameEvent(ev.args.object, "damage", Object.create(ev.args)));
            if (this.health <= 0) {
                // @todo add death cause to this event
                this.enabled = false;
                emitEvent(new GameEvent(this, "death", { object: this }));
            }
        }
    }

    runAway(scene: Scene, enemiesNearby: Npc[]) {
        const possibleDirs: { direction: [number, number], available?: boolean, distance?: number }[] = [
            { direction: [-1, 0] },
            { direction: [+1, 0] },
            { direction: [0, -1] },
            { direction: [0, +1] },
        ];
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            pd.available = !scene.isPositionBlocked(position);
            if (enemiesNearby.length)
                pd.distance = distanceTo(position, enemiesNearby[0].position);
        }
        const direction = possibleDirs.filter(x => x.available);
        direction.sort((x, y) => <number>y.distance - <number>x.distance);
        if (direction.length) {
            this.direction = direction[0].direction;
            this.move();
        }
    }

    approach(scene: SceneBase, target: SceneObject) {
        const possibleDirs: { direction: [number, number], available?: boolean, distance?: number }[] = [
            { direction: [-1, 0] },
            { direction: [+1, 0] },
            { direction: [0, -1] },
            { direction: [0, +1] },
        ];
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            pd.available = !scene.isPositionBlocked(position);
            pd.distance = distanceTo(position, target.position);
        }
        const direction = possibleDirs.filter(x => x.available);
        direction.sort((x, y) => <number>x.distance - <number>y.distance);
        if (direction.length) {
            this.direction = direction[0].direction;
            this.move();
        }
    }

    moveRandomly() {
        if ((Math.random() * 100 | 0) === 0) {
            this.direction[0] = (Math.random() * 3 | 0) - 1;
            if (this.direction[0] === 0) {
                this.direction[1] = (Math.random() * 3 | 0) - 1;
            }
        }
    }

    getMobsNearby(scene: Scene, radius: number, callback: (o: Npc) => boolean): Npc[] {
        const enemies = [];
        for (const object of scene.objects) {
            if (!object.enabled) continue;
            if (object === this) continue;  // self check
            if (object instanceof Npc && callback(object)) {
                if (this.distanceTo(object) < radius) {
                    enemies.push(object);
                }
            }
        }
        return enemies;
    }
}
