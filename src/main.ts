import { createTextObject } from "./utils/misc";
import { StaticGameObject } from "./engine/StaticGameObject";
import { house, chest, tree, trees, lamps, flowers } from "./world/objects";
import { npcs } from "./world/npcs";
import { GameEvent } from "./engine/GameEvent";
import { GameObjectAction } from "./engine/SceneObject";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const cellStyle = {
    borderColor: "#111f",
    borderWidth: 0.5,
    default: {
        textColor: '#fff',
        backgroundColor: '#335'
    },
    size: {
        width: 32,
        height: 32,
    },
};

const defaultLightLevelAtNight = 4;

class Cell {
    constructor(public character: string = ' ',
        public textColor: string = cellStyle.default.textColor,
        public backgroundColor: string = cellStyle.default.backgroundColor) {}
}

function drawCell(
    cell: Cell, 
    leftPos: number, 
    topPos: number, 
    transparent: boolean = false,
    border: boolean[] = [false, false, false, false]) { 
        
    const left = leftPos * cellStyle.size.width;
    const top = topPos * cellStyle.size.height;
    //
    ctx.globalAlpha = transparent ? 0.2 : 1;
    ctx.strokeStyle = cellStyle.borderColor;
    ctx.fillStyle = cell.backgroundColor;
    ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
    ctx.font = "26px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.globalAlpha = 1;
    ctx.fillStyle = cell.textColor;
    ctx.fillText(cell.character, left + cellStyle.size.width / 2, top + cellStyle.size.height / 2 + 2);
    if (cellStyle.borderWidth > 0) {
        ctx.lineWidth = cellStyle.borderWidth;
        // palette borders
        ctx.strokeRect(left - cellStyle.borderWidth / 2, top - cellStyle.borderWidth / 2, cellStyle.size.width, cellStyle.size.height);
    }
    // cell borders
    // addObjectBorders();

    function addObjectBorders() {
        const borderWidth = 1.5;
        ctx.lineWidth = borderWidth;
        ctx.globalAlpha = transparent ? 0.4 : 0.7;
        if (border[0]) ctx.strokeRect(left, top, cellStyle.size.width, borderWidth);
        if (border[1]) ctx.strokeRect(left + cellStyle.size.width, top, borderWidth, cellStyle.size.height);
        if (border[2]) ctx.strokeRect(left, top + cellStyle.size.height, cellStyle.size.width, borderWidth);
        if (border[3]) ctx.strokeRect(left, top, borderWidth, cellStyle.size.height);
    }
}

const viewWidth = 20;
const viewHeight = 20;

let heroLeft = 9;
let heroTop = 9;
let heroDir = [0, 0];
let heroActionEnabled = false;

function drawObject(obj: StaticGameObject) {
    let showOnlyCollisions: boolean = isPositionBehindTheObject(obj, heroLeft, heroTop);
    if (heroActionEnabled && isPositionBehindTheObject(obj, heroLeft + heroDir[0], heroTop + heroDir[1])) {
        showOnlyCollisions = true;
    }
    for (let y = 0; y < obj.skin.characters.length; y++) {
        for (let x = 0; x < obj.skin.characters[y].length; x++) {
            const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) ? obj.skin.raw_colors[y][x] : ['', ''];
            const char = obj.skin.characters[y][x] || ' ';
            const cell = new Cell(char, cellColor[0], cellColor[1]);
            const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
            if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                drawCell(cell, obj.position[0] - obj.originPoint[0] + x, obj.position[1] - obj.originPoint[1] + y, transparent, [
                    isEmptyCell(obj, x + 0, y - 1),  // top
                    isEmptyCell(obj, x + 1, y + 0),
                    isEmptyCell(obj, x + 0, y + 1),
                    isEmptyCell(obj, x - 1, y + 0),
                ]);
            }
                
        }
    }
}

function isEmptyCell(obj: StaticGameObject, x: number, y: number) {
    const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) 
        ? obj.skin.raw_colors[y][x] 
        : ['', ''];
    return cellColor[0] === '' && cellColor[1] === '';
}

let weatherType = 'normal';
let temperature = 7;  // 0-15 @todo add effects
let isWindy = true;
let timePeriod = 'day';
// createTextObject("Term Adventures!", 2, 2)
const sceneObjects = [...flowers, house, chest, tree, ...trees, ...lamps];  // @todo sort by origin point
let lightLayer: number[][] = [];
let weatherLayer: Cell[][] = [];

function drawScene() {
    // sort objects by origin point
    sceneObjects.sort((a: StaticGameObject, b: StaticGameObject) => a.position[1]  - b.position[1]);
    // bedrock
    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {
            drawCell(new Cell(' ', 'transparent', '#331'), x, y);
        }
    }

    // hero
    drawCell(new Cell('🐱', 'yellow', 'transparent'), heroLeft, heroTop);
    // hero shadow behind objects
    for (let object of sceneObjects) {
        if (!object.enabled) continue;
        if (isPositionBehindTheObject(object, heroLeft, heroTop)) {
            ctx.fillStyle = 'black';
            const left = heroLeft * cellStyle.size.width;
            const top = heroTop * cellStyle.size.height;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
            break;
        } 
    }
    for (let object of sceneObjects) {
        if (!object.enabled) continue;
        drawObject(object);
    }
    // hero direction (cursor)
    if (heroDir[0] || heroDir[1]) {
        drawHeroCursor();
    }

    updateLights();

    function updateLights() {
        // clear
        lightLayer = [];
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                if (!lightLayer[y]) lightLayer[y] = [];
                if (!lightLayer[y][x]) lightLayer[y][x] = 0;
                // hero
                if (Math.abs(x - heroLeft) + Math.abs(y - heroTop) <= 2)
                    lightLayer[y][x] = 15;
            }
        }
        for (let obj of sceneObjects) {
            for (let line of obj.lights.entries()) {
                for (let left = 0; left < line[1].length; left++)
                {
                    const char = line[1][left];
                    const lightLevel = Number.parseInt(char, 16);
                    const aleft = obj.position[0] - obj.originPoint[0] + left;
                    const atop = obj.position[1] - obj.originPoint[1] + line[0];
                    lightLayer[atop][aleft] += lightLevel;
                    // halo light
                    const newLightLevel = lightLevel - 1;
                    if (newLightLevel > 0) {
                        if (atop - 1 >= 0) lightLayer[atop - 1][aleft] += newLightLevel;
                        if (atop + 1 < viewHeight) lightLayer[atop + 1][aleft] += newLightLevel;
                        if (aleft - 1 >= 0) lightLayer[atop][aleft - 1] += newLightLevel;
                        if (aleft + 1 < viewWidth) lightLayer[atop][aleft + 1] += newLightLevel;
                    }
                }
            }
        }
    }
    drawWeather();

    function drawHeroCursor() {
        const leftPos = heroLeft + heroDir[0];
        const topPos = heroTop + heroDir[1];
        drawCell(new Cell('.', 'black', 'yellow'), leftPos, topPos, true);
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
                if (weatherLayer[y] && weatherLayer[y][x])
                    drawCell(weatherLayer[y][x], x, y);
            }
        }
        if (timePeriod === 'night') {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    const lightLevel = (lightLayer[y] && lightLayer[y][x])
                        ? lightLayer[y][x]
                        : defaultLightLevelAtNight;
                    drawCell(new Cell(' ', 'transparent', `#000${(15 - lightLevel).toString(16)}`), x, y);
                }
            }
        }
    }
}

function update() {
    for (const obj of sceneObjects) {
        if (obj.updateHandler) {
            obj.updateHandler(obj);
        }
    }
    updateWeather();

    function updateWeather() {
        weatherLayer = [];
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                createCell(x, y);
            }
        }

        function addCell(cell: Cell, x: number, y: number) {
            if (!weatherLayer[y]) weatherLayer[y] = [];
            weatherLayer[y][x] = cell;
        }
        
        function createCell(x: number, y: number) {
            if (weatherType === 'rain') {
                const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                addCell(new Cell(sym, 'cyan', '#0003'), x, y);
            } else if (weatherType === 'snow') {
                const r = (Math.random() * 6 | 0)
                if (r === 0)
                    addCell(new Cell('❄', 'white', 'transparent'), x, y);
                else if (r === 1)
                    addCell(new Cell('❅', 'white', 'transparent'), x, y);
                else if (r === 2)
                    addCell(new Cell('❆', 'white', 'transparent'), x, y);
            } else if (weatherType === 'rain_and_snow') {
                const r = Math.random() * 3 | 0;
                if (r === 1)
                    addCell(new Cell('❄', 'white', 'transparent'), x, y);
                else if (r === 2)
                    addCell(new Cell('`', 'cyan', 'transparent'), x, y);
            } else if (weatherType === 'mist') {
                if ((Math.random() * 2 | 0) === 1)
                    addCell(new Cell('*', 'transparent', '#fff2'), x, y);
            }
        }
    }
}

const events: GameEvent[] = [];
function onInterval() {
    update();

    while (events.length > 0) {
        const ev = events.shift();
        if (ev) {
            for (const obj of sceneObjects) {
                obj.handleEvent(ev);
            }
        }
    }
    drawScene();
}

// initial events
emitEvent(new GameEvent("system", "weather_changed", {from: weatherType, to: weatherType}));
emitEvent(new GameEvent("system", "wind_changed", {from: isWindy, to: isWindy}));
emitEvent(new GameEvent("system", "time_changed", {from: timePeriod, to: timePeriod}));
//
onInterval(); // initial run
setInterval(onInterval, 500);

function emitEvent(ev: GameEvent) {
    events.push(ev);
    console.log("event: ", ev);
}

const emptyCollisionChar = ' ';

function isCollision(object: StaticGameObject, left: number, top: number) {
    const cchar = object.physics.collisions[top] && object.physics.collisions[top][left] 
        ? object.physics.collisions[top][left] 
        : emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

function isPositionBlocked(left: number, top: number) {
    for (let object of sceneObjects) {
        if (!object.enabled) continue;
        const pleft = left - object.position[0] + object.originPoint[0];
        const ptop = top - object.position[1] + object.originPoint[1];
        if (isCollision(object, pleft, ptop)) { 
            return true;
        }
    }
    return false;
}

function isPositionBehindTheObject(object: StaticGameObject, left: number, top: number): boolean {
    const pleft = left - object.position[0] + object.originPoint[0];
    const ptop = top - object.position[1] + object.originPoint[1];
    // check collisions
    if (isCollision(object, ptop, pleft)) return false;
    // check characters skin
    const cchar = object.skin.characters[ptop] && object.skin.characters[ptop][pleft] 
        ? object.skin.characters[ptop][pleft] 
        : emptyCollisionChar;
    // check color skin
    const color = object.skin.raw_colors[ptop] && object.skin.raw_colors[ptop][pleft] 
        ? object.skin.raw_colors[ptop] 
        : [undefined, undefined];
    return cchar !== emptyCollisionChar || !!color[0] || !!color[1];
}

document.addEventListener("keypress", function (code) {
    heroActionEnabled = false;
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
        heroActionEnabled = true;
        const actionData = getActionUnderCursor();
        if (actionData) {
            actionData.action(actionData.object);
        }
        drawScene();
        return;
    } else {
        // debug keys
        const oldWeatherType = weatherType;
        if (raw_key === '1') {  // debug
            weatherType = 'normal';
        } else if (raw_key === '2') {  // debug
            weatherType = 'rain';
        } else if (raw_key === '3') {  // debug
            weatherType = 'snow';
        } else if (raw_key === '4') {  // debug
            weatherType = 'rain_and_snow';
        } else if (raw_key === '5') {  // debug
            weatherType = 'mist';
        } 
        if (oldWeatherType !== weatherType) {
            emitEvent(new GameEvent(
                "system", 
                "weather_changed", 
                {
                    from: oldWeatherType,
                    to: weatherType,
                }));
        }
        // wind
        if (raw_key === 'e') {
            isWindy = !isWindy;
            emitEvent(new GameEvent(
                "system", 
                "wind_changed", 
                {
                    from: !isWindy,
                    to: isWindy,
                }));
        }
        //
        if (raw_key === 'q') {  // debug
            timePeriod = timePeriod === 'day' ? 'night' : 'day';
            //
            emitEvent(new GameEvent(
                "system", 
                "time_changed", 
                {
                    from: timePeriod === 'day' ? 'night' : 'day',
                    to: timePeriod,
                }));
        }
        console.log(weatherType, timePeriod);
        return;  // skip
    }
    if (!code.shiftKey) {
        if (!isPositionBlocked(heroLeft + heroDir[0], heroTop + heroDir[1])) {
            heroLeft += heroDir[0];
            heroTop += heroDir[1];
        }
    }

    drawScene();
});

function getActionUnderCursor(): {object: StaticGameObject, action: GameObjectAction} | undefined {

    for (let object of sceneObjects) {
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
    sceneObjects.push(createTextObject(`VICTORY!`, 6, 6));
    drawScene();
});