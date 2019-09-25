import { createTextObject } from "./utils/misc";
import { house, chest, tree, trees, lamps, flowers } from "./world/objects";
import { npcs } from "./world/npcs";
import { GameEvent, GameEventHandler } from "./engine/GameEvent";
import { GameObjectAction, SceneObject } from "./engine/SceneObject";
import { emitEvent, eventLoop } from "./engine/EventLoop";
import { Scene } from "./engine/Scene";
import { Cell } from "./engine/Cell";
import { drawCell } from "./engine/GraphicsEngine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

class Game implements GameEventHandler {

    mode: string = "scene";  // "dialog", "inventory", ...

    handleEvent(ev: GameEvent): void {
        if (ev.type === "switch_mode") {
            this.mode = ev.args.to;
        }
    }

    draw() {
        if (this.mode === "scene")
            scene.draw(ctx);
        else if (this.mode === "dialog") {
            drawDialog();
        }
    }

    update() {
        if (this.mode === "scene")
            scene.update();
    }
}

const game = new Game();

const scene = new Scene();
scene.objects = [...flowers, house, chest, tree, ...trees, ...lamps, ...npcs];

export const viewWidth = 20;
export const viewHeight = 20;

export let heroLeft = 9;
export let heroTop = 9;
export let heroDir = [0, 0];

function drawDialog() {
    // background
    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {
            drawCell(ctx, new Cell('.', 'white', '#333'), x, y);
        }
    }
}

function onInterval() {
    game.update();
    eventLoop([game, scene, ...scene.objects]);
    game.draw();
}


// initial events
emitEvent(new GameEvent("system", "weather_changed", {from: scene.weatherType, to: scene.weatherType}));
emitEvent(new GameEvent("system", "wind_changed", {from: scene.isWindy, to: scene.isWindy}));
emitEvent(new GameEvent("system", "time_changed", {from: scene.timePeriod, to: scene.timePeriod}));
//
onInterval(); // initial run
setInterval(onInterval, 500);


document.addEventListener("keypress", function (code) {
    const raw_key = code.key.toLowerCase();
    if (raw_key === 'w') {
        heroDir = [0, -1];
    } else if (raw_key === 's') {
        heroDir = [0, +1];
    } else if (raw_key === 'a') {
        heroDir = [-1, 0];
    } else if (raw_key === 'd') {
        heroDir = [+1, 0];
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
        console.log(scene.weatherType, scene.timePeriod);
        return;  // skip
    }
    if (!code.shiftKey) {
        if (!scene.isPositionBlocked(heroLeft + heroDir[0], heroTop + heroDir[1])) {
            heroLeft += heroDir[0];
            heroTop += heroDir[1];
        }
    }

    onInterval();
});

function getActionUnderCursor(): {object: SceneObject, action: GameObjectAction} | undefined {

    for (let object of scene.objects) {
        const left = heroLeft + heroDir[0];
        const top = heroTop + heroDir[1];
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

// scripts
chest.setAction(0, 0, function () {
    scene.objects.push(createTextObject(`VICTORY!`, 6, 6));
    onInterval();
});