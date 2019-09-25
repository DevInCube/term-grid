System.register("engine/ObjectSkin", [], function (exports_1, context_1) {
    var ObjectSkin;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ObjectSkin = class ObjectSkin {
                constructor(charactersMask = '', colorsMask = '', colors = {}) {
                    this.charactersMask = charactersMask;
                    this.colorsMask = colorsMask;
                    this.colors = colors;
                    this.characters = [];
                    this.raw_colors = [];
                    this.raw_colors = this.getRawColors();
                    this.characters = charactersMask.split('\n');
                    // console.log(charactersMask, this.characters);
                }
                getRawColors() {
                    let raw_colors = [];
                    const lines = this.colorsMask.split('\n');
                    for (let y = 0; y < lines.length; y++) {
                        raw_colors.push([]);
                        for (let x = 0; x < lines[y].length; x++) {
                            const cellColor = lines[y][x] || ' ';
                            const color = this.colors[cellColor];
                            raw_colors[y].push(color ? [...color] : ['', '']);
                        }
                    }
                    return raw_colors;
                }
            };
            exports_1("ObjectSkin", ObjectSkin);
        }
    };
});
System.register("engine/GameEvent", [], function (exports_2, context_2) {
    var GameEvent;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            GameEvent = class GameEvent {
                constructor(sender, type, args) {
                    this.sender = sender;
                    this.type = type;
                    this.args = args;
                }
            };
            exports_2("GameEvent", GameEvent);
        }
    };
});
System.register("engine/ObjectPhysics", [], function (exports_3, context_3) {
    var ObjectPhysics;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor(collisionsMask = '', lightMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                }
            };
            exports_3("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("engine/SceneObject", [], function (exports_4, context_4) {
    var SceneObject;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            SceneObject = class SceneObject {
                constructor(originPoint, skin, physics, position) {
                    this.originPoint = originPoint;
                    this.skin = skin;
                    this.physics = physics;
                    this.position = position;
                    this.enabled = true;
                    this.parameters = {};
                    this.actions = [];
                    this.eventHandlers = [];
                    //
                }
                // add cb params
                setAction(left, top, action) {
                    this.actions.push([[left, top], action]);
                }
                addEventHandler(handler) {
                    this.eventHandlers.push(handler);
                }
                handleEvent(ev) {
                    for (const eh of this.eventHandlers) {
                        eh(this, ev);
                    }
                }
                onUpdate(handler) {
                    this.updateHandler = handler;
                }
            };
            exports_4("SceneObject", SceneObject);
        }
    };
});
System.register("engine/StaticGameObject", ["engine/ObjectSkin", "utils/misc", "engine/SceneObject", "engine/ObjectPhysics"], function (exports_5, context_5) {
    var ObjectSkin_1, misc_1, SceneObject_1, ObjectPhysics_1, StaticGameObject;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
                static createEmpty() {
                    return new StaticGameObject([0, 0], new ObjectSkin_1.ObjectSkin(), new ObjectPhysics_1.ObjectPhysics(), [0, 0]);
                }
                static clone(o, params) {
                    return Object.assign(this.createEmpty(), misc_1.deepCopy(o), params);
                }
            };
            exports_5("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics"], function (exports_6, context_6) {
    var ObjectSkin_2, StaticGameObject_1, ObjectPhysics_2;
    var __moduleName = context_6 && context_6.id;
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_2.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_2.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_6("createTextObject", createTextObject);
    function deepCopy(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = deepCopy(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = deepCopy(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    exports_6("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_7, context_7) {
    var StaticGameObject_2, ObjectSkin_3, ObjectPhysics_3, house, tree, trees, bamboo, lamp, lamps, chest, flower, flowers;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            }
        ],
        execute: function () {
            exports_7("house", house = new StaticGameObject_2.StaticGameObject([2, 2], new ObjectSkin_3.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }), new ObjectPhysics_3.ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]));
            exports_7("tree", tree = new StaticGameObject_2.StaticGameObject([1, 3], new ObjectSkin_3.ObjectSkin(` ░ 
░░░
░░░
 █`, ` o 
o01
01S
 H`, {
                'o': ['#0c0', '#0a0'],
                '0': ['#0a0', '#080'],
                '1': ['#080', '#060'],
                'S': ['#060', '#040'],
                'H': ['sienna', 'transparent'],
            }), new ObjectPhysics_3.ObjectPhysics(`


 .`, ''), [2, 12]));
            tree.addEventHandler((o, ev) => {
                if (ev.type === 'wind_changed') {
                    o.parameters["animate"] = ev.args["to"];
                }
                else if (ev.type === 'weather_changed') {
                    if (ev.args.to === 'snow') {
                        o.skin.raw_colors[0][1][1] = 'white';
                        o.skin.raw_colors[1][0][1] = 'white';
                        o.skin.raw_colors[1][1][1] = '#ccc';
                        o.skin.raw_colors[1][2][1] = '#ccc';
                    }
                    else {
                        o.skin.raw_colors[0][1][1] = '#0a0';
                        o.skin.raw_colors[1][0][1] = '#0a0';
                        o.skin.raw_colors[1][1][1] = '#080';
                        o.skin.raw_colors[1][2][1] = '#080';
                    }
                }
            });
            tree.onUpdate((o) => {
                if (o.parameters["animate"]) {
                    o.parameters["tick"] = !o.parameters["tick"];
                    o.skin.characters[0] = o.parameters["tick"] ? ` ░ ` : ` ▒ `;
                    o.skin.characters[1] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                    o.skin.characters[2] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                }
            });
            exports_7("trees", trees = [
            //{...tree, position: [5, 11]} as StaticGameObject,
            //{...tree, position: [11, 8]} as StaticGameObject,
            //{...tree, position: [10, 10]} as StaticGameObject,
            ]);
            bamboo = new StaticGameObject_2.StaticGameObject([0, 4], new ObjectSkin_3.ObjectSkin(`▄
█
█
█
█
█`, `T
H
L
H
L
D`, {
                // https://colorpalettes.net/color-palette-412/
                'T': ['#99bc20', 'transparent'],
                'L': ['#517201', 'transparent'],
                'H': ['#394902', 'transparent'],
                'D': ['#574512', 'transparent'],
            }), new ObjectPhysics_3.ObjectPhysics(` 
 
 
 
 
.`, ``), [0, 0]);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(Object.assign(StaticGameObject_2.StaticGameObject.createEmpty(), bamboo, { position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(Object.assign(StaticGameObject_2.StaticGameObject.createEmpty(), bamboo, { position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(0, 5, (obj) => {
                        obj.enabled = false;
                        console.log("Cut tree");
                    });
                }
            }
            lamp = new StaticGameObject_2.StaticGameObject([0, 2], new ObjectSkin_3.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                'L': ['yellow', 'transparent'],
                'H': ['#666', 'transparent'],
            }), new ObjectPhysics_3.ObjectPhysics(` 
 
. `, `B`), [0, 0]);
            lamp.parameters["is_on"] = true;
            lamp.setAction(0, 2, (o) => {
                o.parameters["is_on"] = !o.parameters["is_on"];
                o.skin.raw_colors[0][0] = [o.parameters["is_on"] ? 'yellow' : 'gray', 'transparent'];
                o.physics.lights[0] = o.parameters["is_on"] ? 'F' : '0';
            });
            exports_7("lamps", lamps = [
                StaticGameObject_2.StaticGameObject.clone(lamp, { position: [2, 5] }),
            ]);
            exports_7("chest", chest = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_3.ObjectSkin(`S`, `V`, {
                V: ['yellow', 'violet'],
            }), new ObjectPhysics_3.ObjectPhysics(`.`, ''), [2, 10]));
            flower = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_3.ObjectSkin(`❁`, `V`, {
                V: ['red', 'transparent'],
            }), new ObjectPhysics_3.ObjectPhysics(` `, 'F'), [2, 10]);
            exports_7("flowers", flowers = []);
            for (let i = 0; i < 20; i++) {
                const fl = StaticGameObject_2.StaticGameObject.clone(flower, { position: [Math.random() * 20 | 0, Math.random() * 20 | 0] });
                flowers.push(fl);
                fl.onUpdate((o) => {
                    if (!o.parameters["inited"]) {
                        o.parameters["inited"] = true;
                        o.skin.raw_colors[0][0][0] = ['red', 'yellow', 'violet'][(Math.random() * 3) | 0];
                    }
                });
            }
        }
    };
});
System.register("world/npcs", ["engine/ObjectSkin", "engine/SceneObject", "engine/ObjectPhysics"], function (exports_8, context_8) {
    var ObjectSkin_4, SceneObject_2, ObjectPhysics_4, Npc, npcs;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_2.SceneObject {
                constructor(skin, position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics(`.`, `8`), position);
                }
            };
            exports_8("Npc", Npc);
            exports_8("npcs", npcs = [
                new Npc(new ObjectSkin_4.ObjectSkin('🐻', `.`, {
                    '.': [undefined, 'transparent'],
                }), [4, 4]),
            ]);
        }
    };
});
System.register("main", ["utils/misc", "world/objects", "world/npcs", "engine/GameEvent"], function (exports_9, context_9) {
    var misc_2, objects_1, npcs_1, GameEvent_1, canvas, ctx, cellStyle, defaultLightLevelAtNight, Cell, viewWidth, viewHeight, heroLeft, heroTop, heroDir, heroActionEnabled, weatherType, temperature, isWindy, timePeriod, sceneObjects, lightLayer, weatherLayer, events, emptyCollisionChar;
    var __moduleName = context_9 && context_9.id;
    function drawCell(cell, leftPos, topPos, transparent = false, border = [false, false, false, false]) {
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
            if (border[0])
                ctx.strokeRect(left, top, cellStyle.size.width, borderWidth);
            if (border[1])
                ctx.strokeRect(left + cellStyle.size.width, top, borderWidth, cellStyle.size.height);
            if (border[2])
                ctx.strokeRect(left, top + cellStyle.size.height, cellStyle.size.width, borderWidth);
            if (border[3])
                ctx.strokeRect(left, top, borderWidth, cellStyle.size.height);
        }
    }
    function drawObject(obj) {
        let showOnlyCollisions = isPositionBehindTheObject(obj, heroLeft, heroTop);
        if (heroActionEnabled && isPositionBehindTheObject(obj, heroLeft + heroDir[0], heroTop + heroDir[1])) {
            showOnlyCollisions = true;
        }
        for (let y = 0; y < obj.skin.characters.length; y++) {
            let x = 0;
            for (let charIndex = 0; charIndex < obj.skin.characters[y].length; charIndex++) {
                const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) ? obj.skin.raw_colors[y][x] : ['', ''];
                let char = obj.skin.characters[y][charIndex] || ' ';
                if (char.charCodeAt(0) > 255) {
                    const next = obj.skin.characters[y][charIndex + 1];
                    if (next) {
                        char += obj.skin.characters[y][charIndex + 1];
                        charIndex += 1;
                    }
                }
                const cell = new Cell(char, cellColor[0], cellColor[1]);
                const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
                if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                    drawCell(cell, obj.position[0] - obj.originPoint[0] + x, obj.position[1] - obj.originPoint[1] + y, transparent, []);
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
    }
    function isEmptyCell(obj, x, y) {
        const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x])
            ? obj.skin.raw_colors[y][x]
            : ['', ''];
        return cellColor[0] === '' && cellColor[1] === '';
    }
    function drawScene() {
        // sort objects by origin point
        sceneObjects.sort((a, b) => a.position[1] - b.position[1]);
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
            if (!object.enabled)
                continue;
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
            if (!object.enabled)
                continue;
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
                    if (!lightLayer[y])
                        lightLayer[y] = [];
                    if (!lightLayer[y][x])
                        lightLayer[y][x] = 0;
                    // hero
                    if (Math.abs(x - heroLeft) + Math.abs(y - heroTop) <= 2)
                        lightLayer[y][x] = 15;
                }
            }
            for (let obj of sceneObjects) {
                for (let line of obj.physics.lights.entries()) {
                    for (let left = 0; left < line[1].length; left++) {
                        const char = line[1][left];
                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + line[0];
                        lightLayer[atop][aleft] += lightLevel;
                        // halo light
                        const newLightLevel = lightLevel - 1;
                        if (newLightLevel > 0) {
                            if (atop - 1 >= 0)
                                lightLayer[atop - 1][aleft] += newLightLevel;
                            if (atop + 1 < viewHeight)
                                lightLayer[atop + 1][aleft] += newLightLevel;
                            if (aleft - 1 >= 0)
                                lightLayer[atop][aleft - 1] += newLightLevel;
                            if (aleft + 1 < viewWidth)
                                lightLayer[atop][aleft + 1] += newLightLevel;
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
                    const r = (Math.random() * 6 | 0);
                    if (r === 0)
                        addCell(new Cell('❄', 'white', 'transparent'), x, y);
                    else if (r === 1)
                        addCell(new Cell('❅', 'white', 'transparent'), x, y);
                    else if (r === 2)
                        addCell(new Cell('❆', 'white', 'transparent'), x, y);
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
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    function isCollision(object, left, top) {
        const cchar = object.physics.collisions[top] && object.physics.collisions[top][left]
            ? object.physics.collisions[top][left]
            : emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    function isPositionBlocked(left, top) {
        for (let object of sceneObjects) {
            if (!object.enabled)
                continue;
            const pleft = left - object.position[0] + object.originPoint[0];
            const ptop = top - object.position[1] + object.originPoint[1];
            if (isCollision(object, pleft, ptop)) {
                return true;
            }
        }
        return false;
    }
    function isPositionBehindTheObject(object, left, top) {
        const pleft = left - object.position[0] + object.originPoint[0];
        const ptop = top - object.position[1] + object.originPoint[1];
        // check collisions
        if (isCollision(object, ptop, pleft))
            return false;
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
    function getActionUnderCursor() {
        for (let object of sceneObjects) {
            const left = heroLeft + heroDir[0];
            const top = heroTop + heroDir[1];
            //
            const pleft = left - object.position[0] + object.originPoint[0];
            const ptop = top - object.position[1] + object.originPoint[1];
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
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (npcs_1_1) {
                npcs_1 = npcs_1_1;
            },
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
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
                size: {
                    width: 32,
                    height: 32,
                },
            };
            defaultLightLevelAtNight = 4;
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
            temperature = 7; // 0-15 @todo add effects
            isWindy = true;
            timePeriod = 'day';
            // createTextObject("Term Adventures!", 2, 2)
            sceneObjects = [...objects_1.flowers, objects_1.house, objects_1.chest, objects_1.tree, ...objects_1.trees, ...objects_1.lamps, ...npcs_1.npcs];
            lightLayer = [];
            weatherLayer = [];
            events = [];
            // initial events
            emitEvent(new GameEvent_1.GameEvent("system", "weather_changed", { from: weatherType, to: weatherType }));
            emitEvent(new GameEvent_1.GameEvent("system", "wind_changed", { from: isWindy, to: isWindy }));
            emitEvent(new GameEvent_1.GameEvent("system", "time_changed", { from: timePeriod, to: timePeriod }));
            //
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
                else {
                    // debug keys
                    const oldWeatherType = weatherType;
                    if (raw_key === '1') { // debug
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
                    if (oldWeatherType !== weatherType) {
                        emitEvent(new GameEvent_1.GameEvent("system", "weather_changed", {
                            from: oldWeatherType,
                            to: weatherType,
                        }));
                    }
                    // wind
                    if (raw_key === 'e') {
                        isWindy = !isWindy;
                        emitEvent(new GameEvent_1.GameEvent("system", "wind_changed", {
                            from: !isWindy,
                            to: isWindy,
                        }));
                    }
                    //
                    if (raw_key === 'q') { // debug
                        timePeriod = timePeriod === 'day' ? 'night' : 'day';
                        //
                        emitEvent(new GameEvent_1.GameEvent("system", "time_changed", {
                            from: timePeriod === 'day' ? 'night' : 'day',
                            to: timePeriod,
                        }));
                    }
                    console.log(weatherType, timePeriod);
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
                sceneObjects.push(misc_2.createTextObject(`VICTORY!`, 6, 6));
                drawScene();
            });
        }
    };
});
//# sourceMappingURL=app.js.map