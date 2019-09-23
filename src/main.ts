import { createTextObject } from "./utils/misc";
import { StaticGameObject, GameObjectAction } from "./engine/StaticGameObject";
import { house, chest, tree, trees } from "./world/objects";

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
    size: 32,
};

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
        
    const left = leftPos * cellStyle.size;
    const top = topPos * cellStyle.size;
    //
    ctx.globalAlpha = transparent ? 0.2 : 1;
    ctx.strokeStyle = cellStyle.borderColor;
    ctx.fillStyle = cell.backgroundColor;
    ctx.fillRect(left, top, cellStyle.size, cellStyle.size);
    ctx.font = "24px Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.globalAlpha = 1;
    ctx.fillStyle = cell.textColor;
    ctx.fillText(cell.character, left + cellStyle.size / 2, top + cellStyle.size / 2);
    if (cellStyle.borderWidth > 0) {
        ctx.lineWidth = cellStyle.borderWidth;
        // palette borders
        ctx.strokeRect(left - cellStyle.borderWidth / 2, top - cellStyle.borderWidth / 2, cellStyle.size, cellStyle.size);
    }
    // cell borders
    const borderWidth = 1.5;
    ctx.lineWidth = borderWidth;
    ctx.globalAlpha = transparent ? 0.4 : 0.7;
    if (border[0]) ctx.strokeRect(left, top, cellStyle.size, borderWidth);
    if (border[1]) ctx.strokeRect(left + cellStyle.size, top, borderWidth, cellStyle.size);
    if (border[2]) ctx.strokeRect(left, top + cellStyle.size, cellStyle.size, borderWidth);
    if (border[3]) ctx.strokeRect(left, top, borderWidth, cellStyle.size);
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
    for (let y = 0; y < obj.characters.length; y++) {
        for (let x = 0; x < obj.characters[y].length; x++) {
            const cellColor = (obj.colors[y] && obj.colors[y][x]) ? obj.colors[y][x] : ['', ''];
            const char = obj.characters[y][x] || ' ';
            const cell = new Cell(char, cellColor[0], cellColor[1]);
            const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
            if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                drawCell(cell, obj.position[0] + x, obj.position[1] + y, transparent, [
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
    const cellColor = (obj.colors[y] && obj.colors[y][x]) 
        ? obj.colors[y][x] 
        : ['', ''];
    return cellColor[0] === '' && cellColor[1] === '';
}

const sceneObjects = [createTextObject("Term Adventures!", 2, 2), house, chest, tree, ...trees];

function drawScene() {
    // bedrock
    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {
            drawCell(new Cell(), x, y);
        }
    }

    // hero
    drawCell(new Cell('🐱', 'yellow', 'darkgreen'), heroLeft, heroTop);
    // hero shadow behind objects
    for (let object of sceneObjects) {
        if (!object.enabled) continue;
        if (isPositionBehindTheObject(object, heroLeft, heroTop)) {
            ctx.fillStyle = 'black';
            const left = heroLeft * cellStyle.size;
            const top = heroTop * cellStyle.size;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(left, top, cellStyle.size, cellStyle.size);
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

    function drawHeroCursor() {
        const leftPos = heroLeft + heroDir[0];
        const topPos = heroTop + heroDir[1];
        drawCell(new Cell('.', 'black', 'yellow'), leftPos, topPos, true);
        // palette borders
        const left = leftPos * cellStyle.size;
        const top = topPos * cellStyle.size;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, cellStyle.size, cellStyle.size);
    }
}

drawScene();  // initial draw

const emptyCollisionChar = ' ';

function isCollision(object: StaticGameObject, left: number, top: number) {
    const cchar = object.collisions[top] && object.collisions[top][left] 
        ? object.collisions[top][left] 
        : emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

function isPositionBlocked(left: number, top: number) {
    for (let object of sceneObjects) {
        if (!object.enabled) continue;
        const pleft = left - object.position[0];
        const ptop = top - object.position[1];
        if (isCollision(object, pleft, ptop)) { 
            return true;
        }
    }
    return false;
}

function isPositionBehindTheObject(object: StaticGameObject, left: number, top: number): boolean {
    const pleft = left - object.position[0];
    const ptop = top - object.position[1];
    // check collisions
    if (isCollision(object, ptop, pleft)) return false;
    // check characters skin
    const cchar = object.characters[ptop] && object.characters[ptop][pleft] 
        ? object.characters[ptop][pleft] 
        : emptyCollisionChar;
    // check color skin
    const color = object.colors[ptop] && object.colors[ptop][pleft] 
        ? object.colors[ptop] 
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
        const pleft = left - object.position[0];
        const ptop = top - object.position[1];
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