System.register("engine/Skin", [], function (exports_1, context_1) {
    var Skin;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Skin = class Skin {
                constructor(mask = '', colors = {}) {
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
            exports_1("Skin", Skin);
        }
    };
});
System.register("engine/StaticGameObject", ["engine/Skin"], function (exports_2, context_2) {
    var Skin_1, StaticGameObject;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (Skin_1_1) {
                Skin_1 = Skin_1_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject {
                constructor(charSkin, colorSkin, collisionsMask, position) {
                    this.position = position;
                    this.enabled = true;
                    this.characters = charSkin.split('\n');
                    this.colors = colorSkin.getRawColors();
                    this.collisions = collisionsMask.split('\n');
                    //
                    this.actions = [];
                }
                // add cb params
                setAction(left, top, action) {
                    this.actions.push([[left, top], action]);
                }
                static createEmpty() {
                    return new StaticGameObject('', new Skin_1.Skin(), '', []);
                }
            };
            exports_2("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/Skin", "engine/StaticGameObject"], function (exports_3, context_3) {
    var Skin_2, StaticGameObject_1;
    var __moduleName = context_3 && context_3.id;
    function createTextObject(text, x, y) {
        const colors = new Skin_2.Skin(''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject(text, colors, '', [x, y]);
        return t;
    }
    exports_3("createTextObject", createTextObject);
    return {
        setters: [
            function (Skin_2_1) {
                Skin_2 = Skin_2_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/Skin"], function (exports_4, context_4) {
    var StaticGameObject_2, Skin_3, house, tree, trees, chest;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (Skin_3_1) {
                Skin_3 = Skin_3_1;
            }
        ],
        execute: function () {
            exports_4("house", house = new StaticGameObject_2.StaticGameObject(` /^\\ 
==*==
 [ ] `, new Skin_3.Skin(` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }), `
 ... 
 . .`, [5, 10]));
            exports_4("tree", tree = new StaticGameObject_2.StaticGameObject(`   
   
   
  `, new Skin_3.Skin(` o 
o01
01S
 H`, {
                'o': [undefined, '#0a0'],
                '0': [undefined, '#080'],
                '1': [undefined, '#060'],
                'S': [undefined, '#040'],
                'H': [undefined, 'sienna'],
            }), `


 .`, [1, 9]));
            exports_4("trees", trees = [
            //{...tree, position: [5, 11]} as StaticGameObject,
            //{...tree, position: [11, 8]} as StaticGameObject,
            //{...tree, position: [10, 10]} as StaticGameObject,
            ]);
            if (true) { // random trees
                for (let y = 4; y < 16; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(Object.assign(StaticGameObject_2.StaticGameObject.createEmpty(), tree, { position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(Object.assign(StaticGameObject_2.StaticGameObject.createEmpty(), tree, { position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(1, 3, (obj) => {
                        obj.enabled = false;
                        console.log("Cut tree");
                    });
                }
            }
            exports_4("chest", chest = new StaticGameObject_2.StaticGameObject(`S`, new Skin_3.Skin(`V`, {
                V: ['yellow', 'violet'],
            }), `.`, [2, 10]));
        }
    };
});
System.register("main", ["utils/misc", "world/objects"], function (exports_5, context_5) {
    var misc_1, objects_1, canvas, ctx, cellStyle, Cell, viewWidth, viewHeight, heroLeft, heroTop, heroDir, heroActionEnabled, weatherType, timePeriod, sceneObjects, weatherLayer, emptyCollisionChar;
    var __moduleName = context_5 && context_5.id;
    function drawCell(cell, leftPos, topPos, transparent = false, border = [false, false, false, false]) {
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
        if (border[0])
            ctx.strokeRect(left, top, cellStyle.size, borderWidth);
        if (border[1])
            ctx.strokeRect(left + cellStyle.size, top, borderWidth, cellStyle.size);
        if (border[2])
            ctx.strokeRect(left, top + cellStyle.size, cellStyle.size, borderWidth);
        if (border[3])
            ctx.strokeRect(left, top, borderWidth, cellStyle.size);
    }
    function drawObject(obj) {
        let showOnlyCollisions = isPositionBehindTheObject(obj, heroLeft, heroTop);
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
        return cellColor[0] === '' && cellColor[1] === '';
    }
    function drawScene() {
        // bedrock
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                drawCell(new Cell(), x, y);
            }
        }
        // hero
        drawCell(new Cell('🐱', 'yellow', 'transparent'), heroLeft, heroTop);
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
            drawHeroCursor();
        }
        drawWeather();
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
                        drawCell(new Cell(' ', 'transparent', '#0006'), x, y);
                    }
                }
            }
        }
    }
    function update() {
        updateWeather();
        function updateWeather() {
            weatherLayer = [];
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    createCell(x, y);
                }
            }
            function addCell(cell, x, y) {
                if (!weatherLayer[y])
                    weatherLayer[y] = [];
                weatherLayer[y][x] = cell;
            }
            function createCell(x, y) {
                if (weatherType === 'rain') {
                    const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                    addCell(new Cell(sym, 'cyan', '#0003'), x, y);
                }
                else if (weatherType === 'snow') {
                    if ((Math.random() * 2 | 0) === 1)
                        addCell(new Cell('❄', 'white', 'transparent'), x, y);
                }
                else if (weatherType === 'rain_and_snow') {
                    const r = Math.random() * 3 | 0;
                    if (r === 1)
                        addCell(new Cell('❄', 'white', 'transparent'), x, y);
                    else if (r === 2)
                        addCell(new Cell('`', 'cyan', 'transparent'), x, y);
                }
                else if (weatherType === 'mist') {
                    if ((Math.random() * 2 | 0) === 1)
                        addCell(new Cell('*', 'transparent', '#fff2'), x, y);
                }
            }
        }
    }
    function onInterval() {
        update();
        drawScene();
    }
    function isCollision(object, left, top) {
        const cchar = object.collisions[top] && object.collisions[top][left]
            ? object.collisions[top][left]
            : emptyCollisionChar;
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
        if (isCollision(object, ptop, pleft))
            return false;
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
    function getActionUnderCursor() {
        for (let object of sceneObjects) {
            const left = heroLeft + heroDir[0];
            const top = heroTop + heroDir[1];
            //
            const pleft = left - object.position[0];
            const ptop = top - object.position[1];
            for (let action of object.actions) {
                if (action[0][0] === pleft && action[0][1] === ptop) {
                    const actionFunc = action[1];
                    return { object, action: actionFunc };
                }
            }
        }
        return undefined;
    }
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
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
                borderWidth: 0.5,
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
            weatherType = 'normal';
            timePeriod = 'day';
            // createTextObject("Term Adventures!", 2, 2)
            sceneObjects = [objects_1.house, objects_1.chest, objects_1.tree, ...objects_1.trees];
            weatherLayer = [];
            onInterval(); // initial run
            setInterval(onInterval, 500);
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
                    const actionData = getActionUnderCursor();
                    if (actionData) {
                        actionData.action(actionData.object);
                    }
                    drawScene();
                    return;
                }
                else if (raw_key === '1') { // debug
                    weatherType = 'normal';
                }
                else if (raw_key === '2') { // debug
                    weatherType = 'rain';
                }
                else if (raw_key === '3') { // debug
                    weatherType = 'snow';
                }
                else if (raw_key === '4') { // debug
                    weatherType = 'rain_and_snow';
                }
                else if (raw_key === '5') { // debug
                    weatherType = 'mist';
                }
                else if (raw_key === 'q') { // debug
                    timePeriod = timePeriod === 'day' ? 'night' : 'day';
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
                sceneObjects.push(misc_1.createTextObject(`VICTORY!`, 6, 6));
                drawScene();
            });
        }
    };
});
//# sourceMappingURL=app.js.map