System.register("utils/misc", [], function (exports_1, context_1) {
    var t;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("t", t = 5);
        }
    };
});
System.register("engine/StaticGameObject", [], function (exports_2, context_2) {
    var StaticGameObject;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            StaticGameObject = class StaticGameObject {
                constructor(skin, colors, collisions, position) {
                    this.skin = skin;
                    this.colors = colors;
                    this.collisions = collisions;
                    this.position = position;
                    this.enabled = true;
                    this.actions = [];
                }
                // add cb params
                setAction(left, top, action) {
                    this.actions.push([[left, top], action]);
                }
                static createEmpty() {
                    return new StaticGameObject('', [[[]]], '', []);
                }
            };
            exports_2("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("engine/Skin", [], function (exports_3, context_3) {
    var Skin;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Skin = class Skin {
                constructor(mask, colors) {
                    this.mask = mask;
                    this.colors = colors;
                }
                getRawColors() {
                    let raw_colors = [];
                    const lines = this.mask.split('\n');
                    for (let y = 0; y < lines.length; y++) {
                        raw_colors.push([]);
                        for (let x = 0; x < lines[y].length; x++) {
                            const cellColor = lines[y][x] || ' ';
                            raw_colors[y].push(this.colors[cellColor]);
                        }
                    }
                    return raw_colors;
                }
            };
            exports_3("Skin", Skin);
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/Skin"], function (exports_4, context_4) {
    var StaticGameObject_1, Skin_1, house, tree, trees, chest;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (Skin_1_1) {
                Skin_1 = Skin_1_1;
            }
        ],
        execute: function () {
            exports_4("house", house = new StaticGameObject_1.StaticGameObject(` /^\\ 
==*==
 [ ] `, new Skin_1.Skin(` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }).getRawColors(), `
 ... 
 . .`, [5, 10]));
            exports_4("tree", tree = new StaticGameObject_1.StaticGameObject(`   
   
   
  `, new Skin_1.Skin(` o 
o01
01S
 H`, {
                'o': [undefined, '#0a0'],
                '0': [undefined, '#080'],
                '1': [undefined, '#060'],
                'S': [undefined, '#040'],
                'H': [undefined, 'sienna'],
            }).getRawColors(), `


 .`, [1, 9]));
            exports_4("trees", trees = [
            //{...tree, position: [5, 11]} as StaticGameObject,
            //{...tree, position: [11, 8]} as StaticGameObject,
            //{...tree, position: [10, 10]} as StaticGameObject,
            ]);
            if (true) { // random trees
                for (let y = 4; y < 16; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(Object.assign(StaticGameObject_1.StaticGameObject.createEmpty(), tree, { position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(Object.assign(StaticGameObject_1.StaticGameObject.createEmpty(), tree, { position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(1, 3, (obj) => {
                        obj.enabled = false;
                        console.log("Cut tree");
                    });
                }
            }
            exports_4("chest", chest = new StaticGameObject_1.StaticGameObject(`S`, new Skin_1.Skin(`V`, {
                V: ['yellow', 'violet'],
            }).getRawColors(), `.`, [2, 10]));
        }
    };
});
System.register("main", ["engine/StaticGameObject", "engine/Skin", "world/objects"], function (exports_5, context_5) {
    var StaticGameObject_2, Skin_2, objects_1, canvas, ctx, cellStyle, Cell, viewWidth, viewHeight, heroLeft, heroTop, heroDir, heroActionEnabled, sceneObjects, emptyCollisionChar;
    var __moduleName = context_5 && context_5.id;
    function drawCell(cell, leftPos, topPos, transparent = false, border = [false, false, false, false]) {
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
            ctx.strokeRect(left - cellStyle.borderWidth / 2, top - cellStyle.borderWidth / 2, cellStyle.size, cellStyle.size);
        }
        // border 'shadow'
        ctx.lineWidth = 2;
        ctx.globalAlpha = transparent ? 0.4 : 0.7;
        if (border[0]) {
            ctx.strokeRect(left, top, cellStyle.size, 2);
        }
        if (border[1]) {
            ctx.strokeRect(left + cellStyle.size, top, 2, cellStyle.size);
        }
        if (border[2]) {
            ctx.strokeRect(left, top + cellStyle.size, cellStyle.size, 2);
        }
        if (border[3]) {
            ctx.strokeRect(left, top, 2, cellStyle.size);
        }
    }
    function drawObject(obj) {
        const lines = obj.skin.split('\n');
        let showOnlyCollisions = isPositionBehindTheObject(obj, heroLeft, heroTop);
        if (heroActionEnabled && isPositionBehindTheObject(obj, heroLeft + heroDir[0], heroTop + heroDir[1])) {
            showOnlyCollisions = true;
        }
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                const cellColor = (obj.colors[y] && obj.colors[y][x]) ? obj.colors[y][x] : ['', ''];
                const char = lines[y][x] || ' ';
                const cell = new Cell(char, cellColor[0], cellColor[1]);
                const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
                if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                    drawCell(cell, obj.position[0] + x, obj.position[1] + y, transparent, [
                        isEmptyCell(obj, x + 0, y - 1),
                        isEmptyCell(obj, x + 1, y + 0),
                        isEmptyCell(obj, x + 0, y + 1),
                        isEmptyCell(obj, x - 1, y + 0),
                    ]);
                }
            }
        }
    }
    function isEmptyCell(obj, x, y) {
        const cellColor = (obj.colors[y] && obj.colors[y][x])
            ? obj.colors[y][x]
            : ['', ''];
        const lines = obj.skin.split('\n');
        const char = (lines[y] && lines[y][x])
            ? lines[y][x]
            : ' ';
        return cellColor[0] === '' && cellColor[1] === '';
    }
    function drawScene() {
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                drawCell(new Cell(), x, y);
            }
        }
        const text = "Term Adventures!";
        for (let i = 0; i < text.length; i++) {
            drawCell(new Cell(text[i]), 2 + i, 2);
        }
        // hero
        drawCell(new Cell('🐱', 'yellow', 'darkgreen'), heroLeft, heroTop);
        // hero shadow behind objects
        for (let object of sceneObjects) {
            if (!object.enabled)
                continue;
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
            if (!object.enabled)
                continue;
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
    function isCollision(object, left, top) {
        const lines = object.collisions.split('\n');
        const cchar = lines[top] && lines[top][left] ? lines[top][left] : emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    function isPositionBlocked(left, top) {
        for (let object of sceneObjects) {
            if (!object.enabled)
                continue;
            const pleft = left - object.position[0];
            const ptop = top - object.position[1];
            if (isCollision(object, pleft, ptop)) {
                return true;
            }
        }
        return false;
    }
    function isPositionBehindTheObject(object, left, top) {
        const pleft = left - object.position[0];
        const ptop = top - object.position[1];
        // check collisions
        let lines = object.collisions.split('\n');
        let cchar = lines[ptop] && lines[ptop][pleft] ? lines[ptop][pleft] : emptyCollisionChar;
        if (cchar !== emptyCollisionChar)
            return false;
        // check skin
        lines = object.skin.split('\n');
        cchar = lines[ptop] && lines[ptop][pleft] ? lines[ptop][pleft] : emptyCollisionChar;
        // check skin color
        const color = object.colors[ptop] && object.colors[ptop][pleft] ? object.colors[ptop] : [undefined, undefined];
        return cchar !== emptyCollisionChar || !!color[0] || !!color[1];
    }
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (Skin_2_1) {
                Skin_2 = Skin_2_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = canvas.getContext("2d");
            cellStyle = {
                borderColor: "#111f",
                borderWidth: 1,
                default: {
                    textColor: '#fff',
                    backgroundColor: '#335'
                },
                size: 32,
            };
            Cell = class Cell {
                constructor(character = ' ', textColor = cellStyle.default.textColor, backgroundColor = cellStyle.default.backgroundColor) {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                }
            };
            viewWidth = 20;
            viewHeight = 20;
            heroLeft = 9;
            heroTop = 9;
            heroDir = [0, 0];
            heroActionEnabled = false;
            sceneObjects = [objects_1.house, objects_1.chest, objects_1.tree, ...objects_1.trees];
            drawScene(); // initial draw
            emptyCollisionChar = ' ';
            document.addEventListener("keypress", function (code) {
                heroActionEnabled = false;
                const raw_key = code.key.toLowerCase();
                if (raw_key === 'w') {
                    heroDir = [0, -1];
                }
                else if (raw_key === 's') {
                    heroDir = [0, +1];
                }
                else if (raw_key === 'a') {
                    heroDir = [-1, 0];
                }
                else if (raw_key === 'd') {
                    heroDir = [+1, 0];
                }
                else if (raw_key === ' ') {
                    heroActionEnabled = true;
                    for (let object of sceneObjects) {
                        const left = heroLeft + heroDir[0];
                        const top = heroTop + heroDir[1];
                        //
                        const pleft = left - object.position[0];
                        const ptop = top - object.position[1];
                        for (let action of object.actions) {
                            if (action[0][0] === pleft && action[0][1] === ptop) {
                                action[1](object); // pass action args
                            }
                        }
                    }
                    drawScene();
                    return;
                }
                else {
                    return; // skip
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
            objects_1.chest.setAction(0, 0, function () {
                const colors = new Skin_2.Skin('........', { '.': [undefined, undefined] }).getRawColors();
                const victory = new StaticGameObject_2.StaticGameObject(`VICTORY!`, colors, '', [6, 6]);
                sceneObjects.push(victory);
                drawScene();
            });
        }
    };
});
//# sourceMappingURL=app.js.map