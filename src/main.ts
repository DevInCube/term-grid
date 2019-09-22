import { t } from "./utils/misc";
import { StaticGameObject } from "./engine/StaticGameObject";
import { Skin } from "./engine/Skin";
import { house, chest, tree, trees } from "./world/objects";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const cellStyle = {
    borderColor: "#111f",
    borderWidth: 1,
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
    border: boolean = false) { 
        
    const left = leftPos * cellStyle.size;
    const top = topPos * cellStyle.size;
    //
    ctx.globalAlpha = transparent ? 0.2 : 1;
    ctx.fillStyle = cell.backgroundColor;
    ctx.fillRect(left, top, cellStyle.size, cellStyle.size);
    ctx.font = "24px Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.globalAlpha = 1;
    ctx.fillStyle = cell.textColor;
    ctx.fillText(cell.character, left + cellStyle.size / 2, top + cellStyle.size / 2);
    if (cellStyle.borderWidth > 0) {
        ctx.strokeStyle = cellStyle.borderColor;
        ctx.lineWidth = cellStyle.borderWidth;
        // palette borders
        ctx.strokeRect(left, top, cellStyle.size, cellStyle.size);
    }
}

const viewWidth = 20;
const viewHeight = 20;

let heroLeft = 9;
let heroTop = 9;
let heroDir = [0, 0];
let heroActionEnabled = false;

function drawObject(obj: StaticGameObject) {
    const lines = obj.skin.split('\n');
    let showOnlyCollisions: boolean = isPositionBehindTheObject(obj, heroLeft, heroTop);
    console.log(heroActionEnabled);
    if (heroActionEnabled && isPositionBehindTheObject(obj, heroLeft + heroDir[0], heroTop + heroDir[1])) {
        showOnlyCollisions = true;
    }
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const cellColor = (obj.colors[y] && obj.colors[y][x]) ? obj.colors[y][x] : ['', ''];
            const char = lines[y][x] || ' ';
            const cell = new Cell(char, cellColor[0], cellColor[1]);
            const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
            if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '')
                drawCell(cell, obj.position[0] + x, obj.position[1] + y, transparent, true);
        }
    }
}

const sceneObjects = [house, chest, tree, ...trees];

function drawScene() {
    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {
            drawCell(new Cell(), x, y);
        }
    }
    
    const text = "Term Adventures!";
    for (let i = 0; i < text.length; i++) 
    {
        drawCell(new Cell(text[i]), 2 + i, 2);
    }

    // hero
    drawCell(new Cell('🐱', 'yellow', 'darkgreen'), heroLeft, heroTop);
    // hero shadow behind objects
    for (let object of sceneObjects) {
        if (isPositionBehindTheObject(object, heroLeft, heroTop)) {
            ctx.fillStyle = 'black';
            const left = heroLeft * cellStyle.size;
            const top = heroTop * cellStyle.size;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(left, top, cellStyle.size, cellStyle.size);
            break;
        } 
    }
    for  (let object of sceneObjects) {
        drawObject(object);
    }
    // hero direction (cursor)
    if (heroDir[0] || heroDir[1]) {
        const leftPos = heroLeft + heroDir[0];
        const topPos = heroTop + heroDir[1];
        drawCell(new Cell('.', 'black', 'yellow'), leftPos, topPos, true);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        // palette borders
        const left = leftPos * cellStyle.size;
        const top = topPos * cellStyle.size;
        ctx.globalAlpha = 1;
        ctx.strokeRect(left, top, cellStyle.size, cellStyle.size);
    }
}

drawScene();  // initial draw

const emptyCollisionChar = ' ';

function isCollision(object: StaticGameObject, left: number, top: number) {
    const lines = object.collisions.split('\n');
    const cchar = lines[top] && lines[top][left] ? lines[top][left] : emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

function isPositionBlocked(left: number, top: number) {
    for (let object of sceneObjects) {
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
    let lines = object.collisions.split('\n');
    let cchar = lines[ptop] && lines[ptop][pleft] ? lines[ptop][pleft] : emptyCollisionChar;
    if (cchar !== emptyCollisionChar) return false;
    // check skin
    lines = object.skin.split('\n');
    cchar = lines[ptop] && lines[ptop][pleft] ? lines[ptop][pleft] : emptyCollisionChar;
    // check skin color
    const color = object.colors[ptop] && object.colors[ptop][pleft] ? object.colors[ptop] : [undefined, undefined];
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
        for (let object of sceneObjects) {
            const left = heroLeft + heroDir[0];
            const top = heroTop + heroDir[1];
            //
            const pleft = left - object.position[0];
            const ptop = top - object.position[1];
            for (let action of object.actions) {
                if (action[0][0] === pleft && action[0][1] === ptop) {
                    action[1]();  // pass action args
                }
            }
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

// scripts
chest.setAction(0, 0, function () {
    const colors = new Skin('........', {'.': [undefined, undefined]}).getRawColors();
    console.log(colors);
    const victory = new StaticGameObject(`VICTORY!`, colors, '', [6, 6]);
    sceneObjects.push(victory);
    drawScene();
});
