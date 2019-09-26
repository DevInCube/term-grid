import { GameEvent, GameEventHandler } from "./GameEvent";
import { SceneObject, Drawable } from "./SceneObject";
import { viewHeight, viewWidth, hero } from "../main";
import { Cell } from "./Cell";
import { emitEvent } from "./EventLoop";
import { drawCell, isPositionBehindTheObject, cellStyle, isCollision, drawObjects } from "./GraphicsEngine";

const defaultLightLevelAtNight = 4;

export class Scene implements GameEventHandler {
    objects: SceneObject[] = [];
    weatherType = 'normal';
    temperature = 7;  // 0-15 @todo add effects
    isWindy = true;
    timePeriod = 'day';
    lightLayer: number[][] = [];
    weatherLayer: Cell[][] = [];

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(new GameEvent(this, "switch_mode", {from: "scene", to: "dialog"}));
        }
    }
    
    update() {
        for (const obj of this.objects) {
            if (obj.updateHandler) {
                obj.updateHandler(obj, this);
            }
        }
        
        const scene = this;
        updateWeather();
        
        function updateWeather() {
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
                    addCell(new Cell(sym, 'cyan', '#0003'), x, y);
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

    draw(ctx: CanvasRenderingContext2D) {
        // sort objects by origin point
        this.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        // bedrock
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                drawCell(ctx, new Cell(' ', 'transparent', '#331'), x, y);
            }
        }

        // hero shadow behind objects
        for (let object of this.objects) {
            if (!object.enabled)
                continue;
            if (isPositionBehindTheObject(object, hero.position[0], hero.position[1])) {
                ctx.fillStyle = 'black';
                const left = hero.position[0] * cellStyle.size.width;
                const top = hero.position[1] * cellStyle.size.height;
                ctx.globalAlpha = 0.5;
                ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
                break;
            }
        }
        drawObjects(ctx, this.objects);

        // hero direction (cursor)
        if (hero.direction[0] || hero.direction[1]) {
            drawHeroCursor();
        }

        const scene = this;
        updateLights();
        
        function updateLights() {
            // clear
            scene.lightLayer = [];
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (!scene.lightLayer[y])
                        scene.lightLayer[y] = [];
                    if (!scene.lightLayer[y][x])
                        scene.lightLayer[y][x] = 0;
                    // hero light
                    if (Math.abs(x - hero.position[0]) + Math.abs(y - hero.position[1]) <= 2)
                        scene.lightLayer[y][x] = 15;
                }
            }
            for (let obj of scene.objects) {
                for (let line of obj.physics.lights.entries()) {
                    for (let left = 0; left < line[1].length; left++) {
                        const char = line[1][left];
                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + line[0];
                        if (scene.lightLayer[atop] && scene.lightLayer[atop][aleft])
                            scene.lightLayer[atop][aleft] += lightLevel;
                        // halo light
                        const newLightLevel = lightLevel - 1;
                        if (newLightLevel > 0) {
                            if (atop - 1 >= 0 && scene.lightLayer[atop - 1] && scene.lightLayer[atop - 1][aleft])
                                scene.lightLayer[atop - 1][aleft] += newLightLevel;
                            if (atop + 1 < viewHeight && scene.lightLayer[atop + 1] && scene.lightLayer[atop + 1][aleft])
                                scene.lightLayer[atop + 1][aleft] += newLightLevel;
                            if (aleft - 1 >= 0 && scene.lightLayer[atop] && scene.lightLayer[atop][aleft - 1])
                                scene.lightLayer[atop][aleft - 1] += newLightLevel;
                            if (aleft + 1 < viewWidth && scene.lightLayer[atop] && scene.lightLayer[atop][aleft + 1])
                                scene.lightLayer[atop][aleft + 1] += newLightLevel;
                        }
                    }
                }
            }
        }
        drawWeather();
        function drawHeroCursor() {
            const leftPos = hero.position[0] + hero.direction[0];
            const topPos = hero.position[1] + hero.direction[1];
            drawCell(ctx, new Cell('.', 'black', 'yellow'), leftPos, topPos, true);
            // palette borders
            const left = leftPos * cellStyle.size.width;
            const top = topPos * cellStyle.size.height;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(left, top, cellStyle.size.width, cellStyle.size.height);
        }
        function drawWeather() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                        drawCell(ctx, scene.weatherLayer[y][x], x, y);
                }
            }
            if (scene.timePeriod === 'night') {
                for (let y = 0; y < viewHeight; y++) {
                    for (let x = 0; x < viewWidth; x++) {
                        const lightLevel = (scene.lightLayer[y] && scene.lightLayer[y][x])
                            ? scene.lightLayer[y][x]
                            : defaultLightLevelAtNight;
                        drawCell(ctx, new Cell(' ', 'transparent', `#000${(15 - lightLevel).toString(16)}`), x, y);
                    }
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

