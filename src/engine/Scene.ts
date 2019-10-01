import { GameEvent, GameEventHandler } from "./GameEvent";
import { SceneObject, Drawable } from "./SceneObject";
import { viewHeight, viewWidth } from "../main";
import { Cell } from "./Cell";
import { emitEvent } from "./EventLoop";
import { drawCell, isPositionBehindTheObject, cellStyle, isCollision, drawObjects } from "./GraphicsEngine";
import { Npc } from "./Npc";
import { Item } from "./Item";

const defaultLightLevelAtNight = 4;

export class Scene implements GameEventHandler {
    objects: SceneObject[] = [];
    weatherType = 'normal';
    weatherTicks: number = 0;
    temperature = 7;  // 0-15 @todo add effects
    isWindy = true;
    timePeriod = 'day';
    lightLayer: number[][] = [];
    weatherLayer: Cell[][] = [];
    dayLightLevel: number = 15;
    globalLightLevel: number = 0;

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(new GameEvent(this, "switch_mode", {from: "scene", to: "dialog"}));
        }
    }
    
    update(ticks: number) {
        this.weatherTicks += ticks;
        // update all enabled objects
        for (const obj of this.objects) {
            if (!obj.enabled) continue;
            obj.update(ticks, this);
        }
        
        const scene = this;
        updateWeather();
        updateLights();
        
        function updateWeather() {
            if (scene.weatherType === 'rain') {
                scene.dayLightLevel = 12;
            } else {
                scene.dayLightLevel = 15;
            }
            if (scene.weatherTicks > 300) {
                scene.weatherTicks = 0;
                scene.weatherLayer = [];
                for (let y = 0; y < viewHeight; y++) {
                    for (let x = 0; x < viewWidth; x++) {
                        createCell(x, y);
                    }
                }
                function addCell(cell: Cell, x: number, y: number) {
                    if (!scene.weatherLayer[y])
                        scene.weatherLayer[y] = [];
                    scene.weatherLayer[y][x] = cell;
                }
                function createCell(x: number, y: number) {
                    if (scene.weatherType === 'rain') {
                        const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                        addCell(new Cell(sym, 'cyan', '#0000'), x, y);
                    }
                    else if (scene.weatherType === 'snow') {
                        const r = (Math.random() * 6 | 0);
                        if (r === 0)
                            addCell(new Cell('❄', 'white', 'transparent'), x, y);
                        else if (r === 1)
                            addCell(new Cell('❅', 'white', 'transparent'), x, y);
                        else if (r === 2)
                            addCell(new Cell('❆', 'white', 'transparent'), x, y);
                    }
                    else if (scene.weatherType === 'rain_and_snow') {
                        const r = Math.random() * 3 | 0;
                        if (r === 1)
                            addCell(new Cell('❄', 'white', 'transparent'), x, y);
                        else if (r === 2)
                            addCell(new Cell('`', 'cyan', 'transparent'), x, y);
                    }
                    else if (scene.weatherType === 'mist') {
                        if ((Math.random() * 2 | 0) === 1)
                            addCell(new Cell('*', 'transparent', '#fff2'), x, y);
                    }
                }
            }
        }

        function updateLights() {
            // clear
            if (scene.timePeriod === 'night') {
                scene.globalLightLevel = defaultLightLevelAtNight;
            } else {
                scene.globalLightLevel = scene.dayLightLevel;
            }
            scene.lightLayer = [];
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (!scene.lightLayer[y])
                        scene.lightLayer[y] = [];
                    if (!scene.lightLayer[y][x])
                        scene.lightLayer[y][x] = scene.globalLightLevel;
                }
            }
            const lightObjects = [
                ...scene.objects, 
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInMainHand)
                    .map((x: Npc) => <Item>x.objectInMainHand),
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInSecondaryHand)
                    .map((x: Npc) => <Item>x.objectInSecondaryHand)
            ];
            for (let obj of lightObjects) {
                for (let line of obj.physics.lights.entries()) {
                    for (let left = 0; left < line[1].length; left++) {
                        const char = line[1][left];
                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + line[0];
                        // console.log('add light', scene.lightLayer);
                        addLight(aleft, atop, lightLevel);
                        spreadPoint(scene.lightLayer, aleft, atop);
                    }
                }
            }

            function spreadPoint(array: number[][], x: number, y: number)
            {
                if (array[y][x] - 2 <= defaultLightLevelAtNight) return;
                for (let i = x - 1; i < x + 2; i++)
                    for (let j = y - 1; j < y + 2; j++)
                        if ((i === x || j === y) && !(i === x && j === y) 
                            && (i >= 0 && i < 20 && j >= 0 && j < 20)
                            && array[j][i] + 1 < array[y][x])
                        {
                            array[j][i] = array[y][x] - 2;
                            spreadPoint(array, i, j);
                        }
            }

            function addLight(left: number, top: number, lightLevel: number) {
                if (scene.lightLayer[top] && typeof scene.lightLayer[top][left] != "undefined") {
                    scene.lightLayer[top][left] = lightLevel;
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // sort objects by origin point
        this.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        // bedrock
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                drawCell(ctx, new Cell(' ', 'transparent', '#331'), x, y);
            }
        }

        drawObjects(ctx, this.objects);

        const scene = this;
        drawWeather();
        drawLights();

        function drawWeather() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                        drawCell(ctx, scene.weatherLayer[y][x], x, y);
                }
            }
        }

        function drawLights() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    const lightLevel = scene.lightLayer[y][x] | 0;
                    drawCell(ctx, new Cell(' ', undefined, `#000${(15 - lightLevel).toString(16)}`), x, y);
                }
            }
        }
    }

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

