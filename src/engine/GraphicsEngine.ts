import { SceneObject } from "./SceneObject";
import { Cell } from "./Cell";
import { Npc } from "./Npc";
import { viewWidth, viewHeight, leftPad, topPad } from "../main";

export class GraphicsEngine {
    
}

export const cellStyle = {
    borderColor: "#1114",
    borderWidth: 0.5,
    default: {
        textColor: '#fff',
        backgroundColor: '#335'
    },
    size: {
        width: 24,
        height: 24,
    },
    charSize: 18,
};

export function drawObjects(ctx: CanvasRenderingContext2D, objects: SceneObject[]) {
    for (let object of objects) {
        if (!object.enabled)
            continue;
        drawObject(ctx, object, objects.filter(x => x.important));
    }
    // draw cursors
    for (let object of objects) {
        if (object instanceof Npc
            && (object.direction[0] || object.direction[1]) ) {
            if (object.showCursor) {
                drawNpcCursor(ctx, object);
            }
            if (object.objectInMainHand) {
                drawObject(ctx, object.objectInMainHand, []);
            }
            if (object.objectInSecondaryHand) {
                drawObject(ctx, object.objectInSecondaryHand, []);
            }
        }
    }
}

function drawNpcCursor(ctx: CanvasRenderingContext2D, npc: Npc) {
    const leftPos = npc.position[0] + npc.direction[0];
    const topPos = npc.position[1] + npc.direction[1];
    drawCell(ctx, new Cell(' ', 'black', 'yellow'), leftPos, topPos, true);
    // palette borders
    const left = leftPos * cellStyle.size.width;
    const top = topPos * cellStyle.size.height;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftPad + left, topPad + top, cellStyle.size.width, cellStyle.size.height);
}

export function drawObjectAt(ctx: CanvasRenderingContext2D, obj: SceneObject, position: [number ,number]) {
    for (let y = 0; y < obj.skin.characters.length; y++) {
        let x = 0;
        for (let charIndex = 0; charIndex < obj.skin.characters[y].length; charIndex++) {
            const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) ? obj.skin.raw_colors[y][x] : ['', ''];
            const codePoint = obj.skin.characters[y].codePointAt(charIndex);
            
            let char = obj.skin.characters[y][charIndex] || ' ';
            if (codePoint && <number>codePoint > 0xffff) {
                const next = obj.skin.characters[y][charIndex + 1];
                // console.log(char, next, char + next);
                if (next) {
                    char += next;
                    charIndex += 1;
                }
            }
            const cell = new Cell(char, cellColor[0], cellColor[1]);
            if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                drawCell(ctx, cell, position[0] - obj.originPoint[0] + x, position[1] - obj.originPoint[1] + y);
            }
            x += 1;
        }

    }
}

function drawObject(ctx: CanvasRenderingContext2D, obj: SceneObject, importantObjects: SceneObject[]) {
    let showOnlyCollisions: boolean = isInFrontOfImportantObject();
    // console.log(obj.skin.characters);
    for (let y = 0; y < obj.skin.characters.length; y++) {
        let x = 0;
        for (let charIndex = 0; charIndex < obj.skin.characters[y].length; charIndex++) {
            const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) ? obj.skin.raw_colors[y][x] : ['', ''];
            const codePoint = obj.skin.characters[y].codePointAt(charIndex);
            
            let char = obj.skin.characters[y][charIndex] || ' ';
            if (codePoint && <number>codePoint > 0xffff) {
                const next = obj.skin.characters[y][charIndex + 1];
                // console.log(char, next, char + next);
                if (next) {
                    char += next;
                    charIndex += 1;
                }
            }
            const cell = new Cell(char, cellColor[0], cellColor[1]);
            const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
            if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                drawCell(ctx, cell, obj.position[0] - obj.originPoint[0] + x, obj.position[1] - obj.originPoint[1] + y, transparent, []);
                /* [
                    isEmptyCell(obj, x + 0, y - 1),  // top
                    isEmptyCell(obj, x + 1, y + 0),
                    isEmptyCell(obj, x + 0, y + 1),
                    isEmptyCell(obj, x - 1, y + 0),
                ] */
            }
            x += 1;
        }

    }

    function isInFrontOfImportantObject() {
        for (const o of importantObjects) {
            if (isPositionBehindTheObject(obj, o.position[0], o.position[1])) return true;
        }
        return false;
    }
}


const emptyCollisionChar = ' ';

export function isCollision(object: SceneObject, left: number, top: number) {
    const cchar = object.physics.collisions[top] && object.physics.collisions[top][left] 
        ? object.physics.collisions[top][left] 
        : emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

export function isPositionBehindTheObject(object: SceneObject, left: number, top: number): boolean {
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

export function drawCell(
    ctx: CanvasRenderingContext2D,
    cell: Cell, 
    leftPos: number, 
    topPos: number, 
    transparent: boolean = false,
    border: boolean[] = [false, false, false, false]) { 
    if (leftPos < 0 || topPos < 0) return;
    const left = leftPad + leftPos * cellStyle.size.width;
    const top = topPad + topPos * cellStyle.size.height;
    //
    ctx.globalAlpha = transparent ? 0.2 : 1;
    ctx.strokeStyle = cellStyle.borderColor;
    ctx.fillStyle = cell.backgroundColor;
    ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
    ctx.font = `${cellStyle.charSize}px monospace`;
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