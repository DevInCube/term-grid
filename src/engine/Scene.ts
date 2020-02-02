import { GameEvent } from "./GameEvent";
import { viewHeight, viewWidth } from "../main";
import { Cell } from "./Cell";
import { emitEvent } from "./EventLoop";
import { drawCell, CanvasContext } from "./GraphicsEngine";
import { Npc } from "./Npc";
import { Item } from "./Item";
import { SceneBase } from "./SceneBase";

const defaultLightLevelAtNight = 4;
const bedrockCell = new Cell(' ', 'transparent', '#331');

export class Scene extends SceneBase {

    weatherType = 'normal';
    weatherTicks: number = 0;
    temperature = 7;  // 0-15 @todo add effects
    isWindy = true;
    timePeriod = 'day';
    tiles: (Cell | null)[][] = [];
    lightLayer: number[][] = [];
    weatherLayer: Cell[][] = [];
    dayLightLevel: number = 15;
    globalLightLevel: number = 0;

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(new GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
        }
    }

    update(ticks: number) {
        this.weatherTicks += ticks;
        // update all enabled objects
        super.update(ticks);

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

            function spreadPoint(array: number[][], x: number, y: number) {
                if (array[y][x] - 2 <= defaultLightLevelAtNight) return;
                for (let i = x - 1; i < x + 2; i++)
                    for (let j = y - 1; j < y + 2; j++)
                        if ((i === x || j === y) && !(i === x && j === y)
                            && (i >= 0 && i < 20 && j >= 0 && j < 20)
                            && array[j][i] + 1 < array[y][x]) {
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

    draw(ctx: CanvasContext) {

        // tiles
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                var cell = this.tiles[y] ? this.tiles[y][x] : null;
                drawCell(ctx, cell ? cell : bedrockCell, x, y);
            }
        }

        super.draw(ctx);

        const scene = this;
        drawWeather();
        //drawLights();

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


}

