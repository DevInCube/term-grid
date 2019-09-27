import { sheepLevel } from "./world/levels/sheep";
import { Npc } from "./world/npcs";
import { GameEvent, GameEventHandler } from "./engine/GameEvent";
import { GameObjectAction, SceneObject } from "./engine/SceneObject";
import { emitEvent, eventLoop } from "./engine/EventLoop";
import { Scene } from "./engine/Scene";
import { Cell } from "./engine/Cell";
import { drawCell } from "./engine/GraphicsEngine";
import { ObjectSkin } from "./engine/ObjectSkin";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

class Game implements GameEventHandler {

    mode: string = "scene";  // "dialog", "inventory", ...

    handleEvent(ev: GameEvent): void {
        if (ev.type === "switch_mode") {
            this.mode = ev.args.to;
        } else if (ev.type === "add_object") {
            scene.objects.push(ev.args.object);
            // @todo send new event
        }
    }

    draw() {
        scene.draw(ctx);
        if (this.mode === "dialog") {
            drawDialog();
        }
    }

    update(ticks: number) {
        if (this.mode === "scene")
            scene.update(ticks);
    }
}

const game = new Game();

const scene = new Scene();
scene.objects = sheepLevel;

export const viewWidth = 20;
export const viewHeight = 20;


export const hero = new Npc(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
hero.moveSpeed = 4;
hero.onUpdate((ticks, o, scene) => {
    const obj = <Npc>o;
    obj.moveTick += ticks;
});
scene.objects.push(hero);

document.addEventListener("keydown", function(ev) {
    // const raw_key = ev.key.toLowerCase();
    const key_code = ev.code;
    if (game.mode === 'scene') {
        // onSceneInput();
    } else if (game.mode === 'dialog') {
        if (key_code === "Escape") {
            emitEvent(new GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
        }
    }
});

document.addEventListener("keypress", function (code) {
    const raw_key = code.key.toLowerCase();
    const key_code = code.code;
    // console.log(raw_key, key_code);
    if (game.mode === 'scene') {
        onSceneInput();
    } else if (game.mode === 'dialog') {
        //
    }
    
    onInterval();

    function onSceneInput() {
        if (raw_key === 'w') {
            hero.direction = [0, -1];
        } else if (raw_key === 's') {
            hero.direction = [0, +1];
        } else if (raw_key === 'a') {
            hero.direction = [-1, 0];
        } else if (raw_key === 'd') {
            hero.direction = [+1, 0];
        } else if (raw_key === ' ') {
            const actionData = getActionUnderCursor();
            if (actionData) {
                actionData.action(actionData.object);
            }
            onInterval();
            return;
        } else {
            // debug keys
            const oldWeatherType = scene.weatherType;
            if (raw_key === '1') {  // debug
                scene.weatherType = 'normal';
            } else if (raw_key === '2') {  // debug
                scene.weatherType = 'rain';
            } else if (raw_key === '3') {  // debug
                scene.weatherType = 'snow';
            } else if (raw_key === '4') {  // debug
                scene.weatherType = 'rain_and_snow';
            } else if (raw_key === '5') {  // debug
                scene.weatherType = 'mist';
            } 
            if (oldWeatherType !== scene.weatherType) {
                emitEvent(new GameEvent(
                    "system", 
                    "weather_changed", 
                    {
                        from: oldWeatherType,
                        to: scene.weatherType,
                    }));
            }
            // wind
            if (raw_key === 'e') {
                scene.isWindy = !scene.isWindy;
                emitEvent(new GameEvent(
                    "system", 
                    "wind_changed", 
                    {
                        from: !scene.isWindy,
                        to: scene.isWindy,
                    }));
            }
            //
            if (raw_key === 'q') {  // debug
                scene.timePeriod = scene.timePeriod === 'day' ? 'night' : 'day';
                //
                emitEvent(new GameEvent(
                    "system", 
                    "time_changed", 
                    {
                        from: scene.timePeriod === 'day' ? 'night' : 'day',
                        to: scene.timePeriod,
                    }));
            }
            return;  // skip
        }
        if (!code.shiftKey) {
            if (!scene.isPositionBlocked(hero.cursorPosition)) {
                hero.move();
            }
        }
    }
});

function getActionUnderCursor(): {object: SceneObject, action: GameObjectAction} | undefined {
    const npc = hero;
    for (let object of scene.objects) {
        const left = npc.position[0] + npc.direction[0];
        const top = npc.position[1] + npc.direction[1];
        //
        const pleft = left - object.position[0] + object.originPoint[0];
        const ptop = top - object.position[1] + object.originPoint[1];
        for (let action of object.actions) {
            if (action[0][0] === pleft && action[0][1] === ptop) {
                const actionFunc = action[1];
                return {object, action: actionFunc};
            }
        }
    }
    return undefined;
}

function drawDialog() {
    // background
    const dialogWidth = viewWidth;
    const dialogHeight = viewHeight / 2 - 3;
    for (let y = 0; y < dialogHeight; y++) {
        for (let x = 0; x < dialogWidth; x++) {
            if (x === 0 || x === dialogWidth - 1 || y === 0 || y === dialogHeight - 1)
                drawCell(ctx, new Cell(' ', 'black', '#555'), x, viewHeight - dialogHeight + y);
            else 
                drawCell(ctx, new Cell(' ', 'white', '#333'), x, viewHeight - dialogHeight + y);
        }
    }
}

const ticksPerStep = 33;

function onInterval() {
    game.update(ticksPerStep);
    eventLoop([game, scene, ...scene.objects]);
    game.draw();
}

// initial events
emitEvent(new GameEvent("system", "weather_changed", {from: scene.weatherType, to: scene.weatherType}));
emitEvent(new GameEvent("system", "wind_changed", {from: scene.isWindy, to: scene.isWindy}));
emitEvent(new GameEvent("system", "time_changed", {from: scene.timePeriod, to: scene.timePeriod}));
//
onInterval(); // initial run
setInterval(onInterval, ticksPerStep);

