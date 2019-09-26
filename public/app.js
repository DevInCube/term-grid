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
System.register("engine/ObjectPhysics", [], function (exports_2, context_2) {
    var ObjectPhysics;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor(collisionsMask = '', lightMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                }
            };
            exports_2("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("utils/misc", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics"], function (exports_3, context_3) {
    var ObjectSkin_1, StaticGameObject_1, ObjectPhysics_1;
    var __moduleName = context_3 && context_3.id;
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_1.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_1.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_3("createTextObject", createTextObject);
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
    exports_3("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/GameEvent", [], function (exports_4, context_4) {
    var GameEvent;
    var __moduleName = context_4 && context_4.id;
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
            exports_4("GameEvent", GameEvent);
        }
    };
});
System.register("engine/SceneObject", [], function (exports_5, context_5) {
    var SceneObject;
    var __moduleName = context_5 && context_5.id;
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
                    this.important = false;
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
            exports_5("SceneObject", SceneObject);
        }
    };
});
System.register("engine/StaticGameObject", ["engine/ObjectSkin", "utils/misc", "engine/SceneObject", "engine/ObjectPhysics"], function (exports_6, context_6) {
    var ObjectSkin_2, misc_1, SceneObject_1, ObjectPhysics_2, StaticGameObject;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
                static createEmpty() {
                    return new StaticGameObject([0, 0], new ObjectSkin_2.ObjectSkin(), new ObjectPhysics_2.ObjectPhysics(), [0, 0]);
                }
                static clone(o, params) {
                    return Object.assign(this.createEmpty(), misc_1.deepCopy(o), params);
                }
            };
            exports_6("StaticGameObject", StaticGameObject);
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
                        // console.log("Cut tree"); @todo sent event
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
            for (let i = 0; i < 10; i++) {
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
System.register("engine/EventLoop", [], function (exports_8, context_8) {
    var events;
    var __moduleName = context_8 && context_8.id;
    function eventLoop(handlers) {
        while (events.length > 0) {
            const ev = events.shift();
            if (ev) {
                for (const obj of handlers) {
                    obj.handleEvent(ev);
                }
            }
        }
    }
    exports_8("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_8("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("world/npcs", ["engine/ObjectSkin", "engine/SceneObject", "engine/ObjectPhysics", "engine/EventLoop", "engine/GameEvent"], function (exports_9, context_9) {
    var ObjectSkin_4, SceneObject_2, ObjectPhysics_4, EventLoop_1, GameEvent_1, Npc, ulan, npcs;
    var __moduleName = context_9 && context_9.id;
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
            },
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_2.SceneObject {
                constructor(skin, position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics(`.`, `8`), position);
                    this.direction = [0, 0];
                    this.important = true;
                }
            };
            exports_9("Npc", Npc);
            ulan = new Npc(new ObjectSkin_4.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (o) => {
                EventLoop_1.emitEvent(new GameEvent_1.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            exports_9("npcs", npcs = [
                ulan,
            ]);
        }
    };
});
System.register("world/intro", ["world/objects", "utils/misc", "engine/EventLoop", "engine/GameEvent", "world/npcs"], function (exports_10, context_10) {
    var objects_1, misc_2, EventLoop_2, GameEvent_2, npcs_1, introLevel;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            },
            function (npcs_1_1) {
                npcs_1 = npcs_1_1;
            }
        ],
        execute: function () {
            exports_10("introLevel", introLevel = [...objects_1.flowers, objects_1.house, objects_1.chest, objects_1.tree, ...objects_1.trees, ...objects_1.lamps, ...npcs_1.npcs]);
            // scripts
            objects_1.chest.setAction(0, 0, function () {
                EventLoop_2.emitEvent(new GameEvent_2.GameEvent(objects_1.chest, "add_object", { object: misc_2.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
System.register("engine/Cell", [], function (exports_11, context_11) {
    var Cell;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
            Cell = class Cell {
                constructor(character = ' ', textColor = 'white', backgroundColor = 'black') {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                }
            };
            exports_11("Cell", Cell);
        }
    };
});
System.register("engine/GraphicsEngine", ["engine/Cell"], function (exports_12, context_12) {
    var Cell_1, GraphicsEngine, cellStyle, emptyCollisionChar;
    var __moduleName = context_12 && context_12.id;
    function drawObjects(ctx, objects) {
        for (let object of objects) {
            if (!object.enabled)
                continue;
            drawObject(ctx, object, objects.filter(x => x.important));
        }
    }
    exports_12("drawObjects", drawObjects);
    function drawObject(ctx, obj, importantObjects) {
        let showOnlyCollisions = isInFrontOfImportantObject();
        // console.log(obj.skin.characters);
        for (let y = 0; y < obj.skin.characters.length; y++) {
            let x = 0;
            for (let charIndex = 0; charIndex < obj.skin.characters[y].length; charIndex++) {
                const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x]) ? obj.skin.raw_colors[y][x] : ['', ''];
                const codePoint = obj.skin.characters[y].codePointAt(charIndex);
                let char = obj.skin.characters[y][charIndex] || ' ';
                if (codePoint && codePoint > 0xffff) {
                    const next = obj.skin.characters[y][charIndex + 1];
                    // console.log(char, next, char + next);
                    if (next) {
                        char += next;
                        charIndex += 1;
                    }
                }
                const cell = new Cell_1.Cell(char, cellColor[0], cellColor[1]);
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
                if (isPositionBehindTheObject(obj, o.position[0], o.position[1]))
                    return true;
            }
            return false;
        }
    }
    function isCollision(object, left, top) {
        const cchar = object.physics.collisions[top] && object.physics.collisions[top][left]
            ? object.physics.collisions[top][left]
            : emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    exports_12("isCollision", isCollision);
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
    exports_12("isPositionBehindTheObject", isPositionBehindTheObject);
    function drawCell(ctx, cell, leftPos, topPos, transparent = false, border = [false, false, false, false]) {
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
    exports_12("drawCell", drawCell);
    return {
        setters: [
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_12("GraphicsEngine", GraphicsEngine);
            exports_12("cellStyle", cellStyle = {
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
            });
            emptyCollisionChar = ' ';
        }
    };
});
System.register("engine/Scene", ["engine/GameEvent", "main", "engine/Cell", "engine/EventLoop", "engine/GraphicsEngine"], function (exports_13, context_13) {
    var GameEvent_3, main_1, Cell_2, EventLoop_3, GraphicsEngine_1, defaultLightLevelAtNight, Scene;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (GraphicsEngine_1_1) {
                GraphicsEngine_1 = GraphicsEngine_1_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            Scene = class Scene {
                constructor() {
                    this.objects = [];
                    this.weatherType = 'normal';
                    this.temperature = 7; // 0-15 @todo add effects
                    this.isWindy = true;
                    this.timePeriod = 'day';
                    this.lightLayer = [];
                    this.weatherLayer = [];
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_3.emitEvent(new GameEvent_3.GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
                    }
                }
                update() {
                    for (const obj of this.objects) {
                        if (obj.updateHandler) {
                            obj.updateHandler(obj);
                        }
                    }
                    const scene = this;
                    updateWeather();
                    function updateWeather() {
                        scene.weatherLayer = [];
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                createCell(x, y);
                            }
                        }
                        function addCell(cell, x, y) {
                            if (!scene.weatherLayer[y])
                                scene.weatherLayer[y] = [];
                            scene.weatherLayer[y][x] = cell;
                        }
                        function createCell(x, y) {
                            if (scene.weatherType === 'rain') {
                                const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                                addCell(new Cell_2.Cell(sym, 'cyan', '#0003'), x, y);
                            }
                            else if (scene.weatherType === 'snow') {
                                const r = (Math.random() * 6 | 0);
                                if (r === 0)
                                    addCell(new Cell_2.Cell('❄', 'white', 'transparent'), x, y);
                                else if (r === 1)
                                    addCell(new Cell_2.Cell('❅', 'white', 'transparent'), x, y);
                                else if (r === 2)
                                    addCell(new Cell_2.Cell('❆', 'white', 'transparent'), x, y);
                            }
                            else if (scene.weatherType === 'rain_and_snow') {
                                const r = Math.random() * 3 | 0;
                                if (r === 1)
                                    addCell(new Cell_2.Cell('❄', 'white', 'transparent'), x, y);
                                else if (r === 2)
                                    addCell(new Cell_2.Cell('`', 'cyan', 'transparent'), x, y);
                            }
                            else if (scene.weatherType === 'mist') {
                                if ((Math.random() * 2 | 0) === 1)
                                    addCell(new Cell_2.Cell('*', 'transparent', '#fff2'), x, y);
                            }
                        }
                    }
                }
                draw(ctx) {
                    // sort objects by origin point
                    this.objects.sort((a, b) => a.position[1] - b.position[1]);
                    // bedrock
                    for (let y = 0; y < main_1.viewHeight; y++) {
                        for (let x = 0; x < main_1.viewWidth; x++) {
                            GraphicsEngine_1.drawCell(ctx, new Cell_2.Cell(' ', 'transparent', '#331'), x, y);
                        }
                    }
                    // hero shadow behind objects
                    for (let object of this.objects) {
                        if (!object.enabled)
                            continue;
                        if (GraphicsEngine_1.isPositionBehindTheObject(object, main_1.hero.position[0], main_1.hero.position[1])) {
                            ctx.fillStyle = 'black';
                            const left = main_1.hero.position[0] * GraphicsEngine_1.cellStyle.size.width;
                            const top = main_1.hero.position[1] * GraphicsEngine_1.cellStyle.size.height;
                            ctx.globalAlpha = 0.5;
                            ctx.fillRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                            break;
                        }
                    }
                    GraphicsEngine_1.drawObjects(ctx, this.objects);
                    // hero direction (cursor)
                    if (main_1.hero.direction[0] || main_1.hero.direction[1]) {
                        drawHeroCursor();
                    }
                    const scene = this;
                    updateLights();
                    function updateLights() {
                        // clear
                        scene.lightLayer = [];
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                if (!scene.lightLayer[y])
                                    scene.lightLayer[y] = [];
                                if (!scene.lightLayer[y][x])
                                    scene.lightLayer[y][x] = 0;
                                // hero light
                                if (Math.abs(x - main_1.hero.position[0]) + Math.abs(y - main_1.hero.position[1]) <= 2)
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
                                    scene.lightLayer[atop][aleft] += lightLevel;
                                    // halo light
                                    const newLightLevel = lightLevel - 1;
                                    if (newLightLevel > 0) {
                                        if (atop - 1 >= 0)
                                            scene.lightLayer[atop - 1][aleft] += newLightLevel;
                                        if (atop + 1 < main_1.viewHeight)
                                            scene.lightLayer[atop + 1][aleft] += newLightLevel;
                                        if (aleft - 1 >= 0)
                                            scene.lightLayer[atop][aleft - 1] += newLightLevel;
                                        if (aleft + 1 < main_1.viewWidth)
                                            scene.lightLayer[atop][aleft + 1] += newLightLevel;
                                    }
                                }
                            }
                        }
                    }
                    drawWeather();
                    function drawHeroCursor() {
                        const leftPos = main_1.hero.position[0] + main_1.hero.direction[0];
                        const topPos = main_1.hero.position[1] + main_1.hero.direction[1];
                        GraphicsEngine_1.drawCell(ctx, new Cell_2.Cell('.', 'black', 'yellow'), leftPos, topPos, true);
                        // palette borders
                        const left = leftPos * GraphicsEngine_1.cellStyle.size.width;
                        const top = topPos * GraphicsEngine_1.cellStyle.size.height;
                        ctx.globalAlpha = 1;
                        ctx.strokeStyle = 'yellow';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                    }
                    function drawWeather() {
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                                    GraphicsEngine_1.drawCell(ctx, scene.weatherLayer[y][x], x, y);
                            }
                        }
                        if (scene.timePeriod === 'night') {
                            for (let y = 0; y < main_1.viewHeight; y++) {
                                for (let x = 0; x < main_1.viewWidth; x++) {
                                    const lightLevel = (scene.lightLayer[y] && scene.lightLayer[y][x])
                                        ? scene.lightLayer[y][x]
                                        : defaultLightLevelAtNight;
                                    GraphicsEngine_1.drawCell(ctx, new Cell_2.Cell(' ', 'transparent', `#000${(15 - lightLevel).toString(16)}`), x, y);
                                }
                            }
                        }
                    }
                }
                isPositionBlocked(left, top) {
                    for (let object of this.objects) {
                        if (!object.enabled)
                            continue;
                        const pleft = left - object.position[0] + object.originPoint[0];
                        const ptop = top - object.position[1] + object.originPoint[1];
                        if (GraphicsEngine_1.isCollision(object, pleft, ptop)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
            exports_13("Scene", Scene);
        }
    };
});
System.register("main", ["world/intro", "world/npcs", "engine/GameEvent", "engine/EventLoop", "engine/Scene", "engine/Cell", "engine/GraphicsEngine", "engine/ObjectSkin"], function (exports_14, context_14) {
    var intro_1, npcs_2, GameEvent_4, EventLoop_4, Scene_1, Cell_3, GraphicsEngine_2, ObjectSkin_5, canvas, ctx, Game, game, scene, viewWidth, viewHeight, hero;
    var __moduleName = context_14 && context_14.id;
    function getActionUnderCursor() {
        const npc = hero;
        for (let object of scene.objects) {
            const left = npc.position[0] + npc.direction[0];
            const top = npc.position[1] + npc.direction[1];
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
    function drawDialog() {
        // background
        const dialogWidth = viewWidth;
        const dialogHeight = viewHeight / 2 - 3;
        for (let y = 0; y < dialogHeight; y++) {
            for (let x = 0; x < dialogWidth; x++) {
                if (x === 0 || x === dialogWidth - 1 || y === 0 || y === dialogHeight - 1)
                    GraphicsEngine_2.drawCell(ctx, new Cell_3.Cell(' ', 'black', '#555'), x, viewHeight - dialogHeight + y);
                else
                    GraphicsEngine_2.drawCell(ctx, new Cell_3.Cell(' ', 'white', '#333'), x, viewHeight - dialogHeight + y);
            }
        }
    }
    function onInterval() {
        game.update();
        EventLoop_4.eventLoop([game, scene, ...scene.objects]);
        game.draw();
    }
    return {
        setters: [
            function (intro_1_1) {
                intro_1 = intro_1_1;
            },
            function (npcs_2_1) {
                npcs_2 = npcs_2_1;
            },
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            },
            function (GraphicsEngine_2_1) {
                GraphicsEngine_2 = GraphicsEngine_2_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = canvas.getContext("2d");
            Game = class Game {
                constructor() {
                    this.mode = "scene"; // "dialog", "inventory", ...
                }
                handleEvent(ev) {
                    if (ev.type === "switch_mode") {
                        this.mode = ev.args.to;
                    }
                    else if (ev.type === "add_object") {
                        scene.objects.push(ev.args.object);
                        // @todo send new event
                    }
                }
                draw() {
                    scene.draw(ctx);
                    if (this.mode === "dialog") {
                        drawDialog();
                    }
                }
                update() {
                    if (this.mode === "scene")
                        scene.update();
                }
            };
            game = new Game();
            scene = new Scene_1.Scene();
            scene.objects = intro_1.introLevel;
            exports_14("viewWidth", viewWidth = 20);
            exports_14("viewHeight", viewHeight = 20);
            exports_14("hero", hero = new npcs_2.Npc(new ObjectSkin_5.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [9, 7]));
            scene.objects.push(hero);
            document.addEventListener("keydown", function (ev) {
                // const raw_key = ev.key.toLowerCase();
                const key_code = ev.code;
                if (game.mode === 'scene') {
                    // onSceneInput();
                }
                else if (game.mode === 'dialog') {
                    if (key_code === "Escape") {
                        EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
                    }
                }
            });
            document.addEventListener("keypress", function (code) {
                const raw_key = code.key.toLowerCase();
                const key_code = code.code;
                // console.log(raw_key, key_code);
                if (game.mode === 'scene') {
                    onSceneInput();
                }
                else if (game.mode === 'dialog') {
                    //
                }
                onInterval();
                function onSceneInput() {
                    if (raw_key === 'w') {
                        hero.direction = [0, -1];
                    }
                    else if (raw_key === 's') {
                        hero.direction = [0, +1];
                    }
                    else if (raw_key === 'a') {
                        hero.direction = [-1, 0];
                    }
                    else if (raw_key === 'd') {
                        hero.direction = [+1, 0];
                    }
                    else if (raw_key === ' ') {
                        const actionData = getActionUnderCursor();
                        if (actionData) {
                            actionData.action(actionData.object);
                        }
                        onInterval();
                        return;
                    }
                    else {
                        // debug keys
                        const oldWeatherType = scene.weatherType;
                        if (raw_key === '1') { // debug
                            scene.weatherType = 'normal';
                        }
                        else if (raw_key === '2') { // debug
                            scene.weatherType = 'rain';
                        }
                        else if (raw_key === '3') { // debug
                            scene.weatherType = 'snow';
                        }
                        else if (raw_key === '4') { // debug
                            scene.weatherType = 'rain_and_snow';
                        }
                        else if (raw_key === '5') { // debug
                            scene.weatherType = 'mist';
                        }
                        if (oldWeatherType !== scene.weatherType) {
                            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "weather_changed", {
                                from: oldWeatherType,
                                to: scene.weatherType,
                            }));
                        }
                        // wind
                        if (raw_key === 'e') {
                            scene.isWindy = !scene.isWindy;
                            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "wind_changed", {
                                from: !scene.isWindy,
                                to: scene.isWindy,
                            }));
                        }
                        //
                        if (raw_key === 'q') { // debug
                            scene.timePeriod = scene.timePeriod === 'day' ? 'night' : 'day';
                            //
                            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "time_changed", {
                                from: scene.timePeriod === 'day' ? 'night' : 'day',
                                to: scene.timePeriod,
                            }));
                        }
                        return; // skip
                    }
                    if (!code.shiftKey) {
                        if (!scene.isPositionBlocked(hero.position[0] + hero.direction[0], hero.position[1] + hero.direction[1])) {
                            hero.position[0] += hero.direction[0];
                            hero.position[1] += hero.direction[1];
                        }
                    }
                }
            });
            // initial events
            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "weather_changed", { from: scene.weatherType, to: scene.weatherType }));
            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "wind_changed", { from: scene.isWindy, to: scene.isWindy }));
            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "time_changed", { from: scene.timePeriod, to: scene.timePeriod }));
            //
            onInterval(); // initial run
            setInterval(onInterval, 500);
        }
    };
});
//# sourceMappingURL=app.js.map