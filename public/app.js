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
System.register("engine/Cell", [], function (exports_4, context_4) {
    var Cell;
    var __moduleName = context_4 && context_4.id;
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
            exports_4("Cell", Cell);
        }
    };
});
System.register("engine/EventLoop", [], function (exports_5, context_5) {
    var events;
    var __moduleName = context_5 && context_5.id;
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
    exports_5("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_5("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("engine/GraphicsEngine", ["engine/Cell", "engine/Npc"], function (exports_6, context_6) {
    var Cell_1, Npc_1, GraphicsEngine, cellStyle, emptyCollisionChar;
    var __moduleName = context_6 && context_6.id;
    function drawObjects(ctx, objects) {
        for (let object of objects) {
            if (!object.enabled)
                continue;
            drawObject(ctx, object, objects.filter(x => x.important));
        }
        // draw cursors
        for (let object of objects) {
            if (object instanceof Npc_1.Npc
                && (object.direction[0] || object.direction[1])) {
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
    exports_6("drawObjects", drawObjects);
    function drawNpcCursor(ctx, npc) {
        const leftPos = npc.position[0] + npc.direction[0];
        const topPos = npc.position[1] + npc.direction[1];
        drawCell(ctx, new Cell_1.Cell('.', 'black', 'yellow'), leftPos, topPos, true);
        // palette borders
        const left = leftPos * cellStyle.size.width;
        const top = topPos * cellStyle.size.height;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, cellStyle.size.width, cellStyle.size.height);
    }
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
    exports_6("isCollision", isCollision);
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
    exports_6("isPositionBehindTheObject", isPositionBehindTheObject);
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
    exports_6("drawCell", drawCell);
    return {
        setters: [
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_6("GraphicsEngine", GraphicsEngine);
            exports_6("cellStyle", cellStyle = {
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
System.register("engine/Item", ["engine/SceneObject"], function (exports_7, context_7) {
    var SceneObject_1, Item;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
            };
            exports_7("Item", Item);
        }
    };
});
System.register("engine/Scene", ["engine/GameEvent", "main", "engine/Cell", "engine/EventLoop", "engine/GraphicsEngine", "engine/Npc"], function (exports_8, context_8) {
    var GameEvent_1, main_1, Cell_2, EventLoop_1, GraphicsEngine_1, Npc_2, defaultLightLevelAtNight, Scene;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (GraphicsEngine_1_1) {
                GraphicsEngine_1 = GraphicsEngine_1_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            Scene = class Scene {
                constructor() {
                    this.objects = [];
                    this.weatherType = 'normal';
                    this.weatherTicks = 0;
                    this.temperature = 7; // 0-15 @todo add effects
                    this.isWindy = true;
                    this.timePeriod = 'day';
                    this.lightLayer = [];
                    this.weatherLayer = [];
                    this.dayLightLevel = 15;
                    this.globalLightLevel = 0;
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
                    }
                }
                update(ticks) {
                    this.weatherTicks += ticks;
                    for (const obj of this.objects) {
                        if (obj.updateHandler) {
                            obj.updateHandler(ticks, obj, this);
                        }
                    }
                    const scene = this;
                    updateWeather();
                    updateLights();
                    function updateWeather() {
                        if (scene.weatherType === 'rain') {
                            scene.dayLightLevel = 12;
                        }
                        else {
                            scene.dayLightLevel = 15;
                        }
                        if (scene.weatherTicks > 300) {
                            scene.weatherTicks = 0;
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
                                    addCell(new Cell_2.Cell(sym, 'cyan', '#0000'), x, y);
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
                    function updateLights() {
                        // clear
                        if (scene.timePeriod === 'night') {
                            scene.globalLightLevel = defaultLightLevelAtNight;
                        }
                        else {
                            scene.globalLightLevel = scene.dayLightLevel;
                        }
                        scene.lightLayer = [];
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                if (!scene.lightLayer[y])
                                    scene.lightLayer[y] = [];
                                if (!scene.lightLayer[y][x])
                                    scene.lightLayer[y][x] = scene.globalLightLevel;
                            }
                        }
                        const lightObjects = [
                            ...scene.objects,
                            ...scene.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInMainHand)
                                .map((x) => x.objectInMainHand),
                            ...scene.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInSecondaryHand)
                                .map((x) => x.objectInSecondaryHand)
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
                        function spreadPoint(array, x, y) {
                            if (array[y][x] - 2 <= defaultLightLevelAtNight)
                                return;
                            for (let i = x - 1; i < x + 2; i++)
                                for (let j = y - 1; j < y + 2; j++)
                                    if ((i === x || j === y) && !(i === x && j === y)
                                        && (i >= 0 && i < 20 && j >= 0 && j < 20)
                                        && array[j][i] + 1 < array[y][x]) {
                                        array[j][i] = array[y][x] - 2;
                                        spreadPoint(array, i, j);
                                    }
                        }
                        function addLight(left, top, lightLevel) {
                            if (scene.lightLayer[top] && typeof scene.lightLayer[top][left] != "undefined") {
                                scene.lightLayer[top][left] = lightLevel;
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
                    GraphicsEngine_1.drawObjects(ctx, this.objects);
                    const scene = this;
                    drawWeather();
                    drawLights();
                    function drawWeather() {
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                                    GraphicsEngine_1.drawCell(ctx, scene.weatherLayer[y][x], x, y);
                            }
                        }
                    }
                    function drawLights() {
                        for (let y = 0; y < main_1.viewHeight; y++) {
                            for (let x = 0; x < main_1.viewWidth; x++) {
                                const lightLevel = scene.lightLayer[y][x] | 0;
                                GraphicsEngine_1.drawCell(ctx, new Cell_2.Cell(' ', undefined, `#000${(15 - lightLevel).toString(16)}`), x, y);
                            }
                        }
                    }
                }
                isPositionBlocked(position) {
                    for (let object of this.objects) {
                        if (!object.enabled)
                            continue;
                        const pleft = position[0] - object.position[0] + object.originPoint[0];
                        const ptop = position[1] - object.position[1] + object.originPoint[1];
                        if (GraphicsEngine_1.isCollision(object, pleft, ptop)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
            exports_8("Scene", Scene);
        }
    };
});
System.register("engine/SceneObject", [], function (exports_9, context_9) {
    var SceneObject;
    var __moduleName = context_9 && context_9.id;
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
                    this.ticks = 0;
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
            exports_9("SceneObject", SceneObject);
        }
    };
});
System.register("engine/StaticGameObject", ["engine/ObjectSkin", "utils/misc", "engine/SceneObject", "engine/ObjectPhysics"], function (exports_10, context_10) {
    var ObjectSkin_1, misc_1, SceneObject_2, ObjectPhysics_1, StaticGameObject;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_2.SceneObject {
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
            exports_10("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics"], function (exports_11, context_11) {
    var ObjectSkin_2, StaticGameObject_1, ObjectPhysics_2;
    var __moduleName = context_11 && context_11.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_11("distanceTo", distanceTo);
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_2.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_2.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_11("createTextObject", createTextObject);
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
    exports_11("deepCopy", deepCopy);
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
System.register("engine/Npc", ["engine/ObjectSkin", "engine/SceneObject", "engine/ObjectPhysics", "utils/misc"], function (exports_12, context_12) {
    var ObjectSkin_3, SceneObject_3, ObjectPhysics_3, misc_2, Npc;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_3.SceneObject {
                constructor(skin = new ObjectSkin_3.ObjectSkin(), position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_3.ObjectPhysics(`.`, ``), position);
                    this.type = "undefined";
                    this.direction = [0, 1];
                    this.showCursor = false;
                    this.moveSpeed = 2; // cells per second
                    this.moveTick = 0;
                    this.objectInMainHand = null;
                    this.objectInSecondaryHand = null;
                    this.important = true;
                }
                get cursorPosition() {
                    return [
                        this.position[0] + this.direction[0],
                        this.position[1] + this.direction[1]
                    ];
                }
                move() {
                    const obj = this;
                    if (obj.moveTick >= 1000 / obj.moveSpeed) {
                        obj.position[0] += obj.direction[0];
                        obj.position[1] += obj.direction[1];
                        //
                        obj.moveTick = 0;
                    }
                }
                distanceTo(other) {
                    return misc_2.distanceTo(this.position, other.position);
                }
                static createEmpty() {
                    return new Npc();
                }
                static clone(o, params) {
                    return Object.assign(this.createEmpty(), misc_2.deepCopy(o), params);
                }
            };
            exports_12("Npc", Npc);
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_13, context_13) {
    var StaticGameObject_2, ObjectSkin_4, ObjectPhysics_4, house, tree, trees, bamboo, lamp, lamps, chest, flower, flowers;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
            }
        ],
        execute: function () {
            exports_13("house", house = new StaticGameObject_2.StaticGameObject([2, 2], new ObjectSkin_4.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }), new ObjectPhysics_4.ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]));
            exports_13("tree", tree = new StaticGameObject_2.StaticGameObject([1, 3], new ObjectSkin_4.ObjectSkin(` ░ 
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
            }), new ObjectPhysics_4.ObjectPhysics(`


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
            tree.onUpdate((ticks, o, scene) => {
                o.ticks += ticks;
                if (o.ticks > 300) {
                    if (o.parameters["animate"]) {
                        o.parameters["tick"] = !o.parameters["tick"];
                        o.skin.characters[0] = o.parameters["tick"] ? ` ░ ` : ` ▒ `;
                        o.skin.characters[1] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                        o.skin.characters[2] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                    }
                    o.ticks = 0;
                }
            });
            exports_13("trees", trees = [
            //{...tree, position: [5, 11]} as StaticGameObject,
            //{...tree, position: [11, 8]} as StaticGameObject,
            //{...tree, position: [10, 10]} as StaticGameObject,
            ]);
            bamboo = new StaticGameObject_2.StaticGameObject([0, 4], new ObjectSkin_4.ObjectSkin(`▄
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
            }), new ObjectPhysics_4.ObjectPhysics(` 
 
 
 
 
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
            lamp = new StaticGameObject_2.StaticGameObject([0, 2], new ObjectSkin_4.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                'L': ['yellow', 'transparent'],
                'H': ['#666', 'transparent'],
            }), new ObjectPhysics_4.ObjectPhysics(` 
 
. `, `B`), [0, 0]);
            lamp.parameters["is_on"] = true;
            lamp.setAction(0, 2, (o) => {
                o.parameters["is_on"] = !o.parameters["is_on"];
                o.skin.raw_colors[0][0] = [o.parameters["is_on"] ? 'yellow' : 'gray', 'transparent'];
                o.physics.lights[0] = o.parameters["is_on"] ? 'F' : '0';
            });
            exports_13("lamps", lamps = [
                StaticGameObject_2.StaticGameObject.clone(lamp, { position: [2, 5] }),
            ]);
            exports_13("chest", chest = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_4.ObjectSkin(`S`, `V`, {
                V: ['yellow', 'violet'],
            }), new ObjectPhysics_4.ObjectPhysics(`.`, ''), [2, 10]));
            flower = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_4.ObjectSkin(`❁`, `V`, {
                V: ['red', 'transparent'],
            }), new ObjectPhysics_4.ObjectPhysics(` `, 'F'), [2, 10]);
            exports_13("flowers", flowers = []);
            for (let i = 0; i < 10; i++) {
                const fl = StaticGameObject_2.StaticGameObject.clone(flower, { position: [Math.random() * 20 | 0, Math.random() * 20 | 0] });
                flowers.push(fl);
                fl.onUpdate((ticks, o, scene) => {
                    if (!o.parameters["inited"]) {
                        o.parameters["inited"] = true;
                        o.skin.raw_colors[0][0][0] = ['red', 'yellow', 'violet'][(Math.random() * 3) | 0];
                    }
                });
            }
        }
    };
});
System.register("world/levels/sheep", ["engine/Npc", "engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics", "utils/misc", "world/objects"], function (exports_14, context_14) {
    var Npc_3, ObjectSkin_5, StaticGameObject_3, ObjectPhysics_5, misc_3, objects_1, vFence, hFence, sheeps, wolves, fences, sheep, wolf, tree2, sheepLevel;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            },
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            }
        ],
        execute: function () {
            vFence = new StaticGameObject_3.StaticGameObject([0, 0], new ObjectSkin_5.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_5.ObjectPhysics('.'), [0, 0]);
            hFence = new StaticGameObject_3.StaticGameObject([0, 0], new ObjectSkin_5.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_5.ObjectPhysics('.'), [0, 0]);
            sheeps = [];
            wolves = [];
            fences = [];
            sheep = new Npc_3.Npc(new ObjectSkin_5.ObjectSkin(`🐑`, `.`, {
                '.': [undefined, 'transparent'],
            }), [0, 0]);
            sheep.type = "sheep";
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(StaticGameObject_3.StaticGameObject.clone(hFence, { position: [x, 1] }));
                    fences.push(StaticGameObject_3.StaticGameObject.clone(hFence, { position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(StaticGameObject_3.StaticGameObject.clone(vFence, { position: [1, y] }));
                    fences.push(StaticGameObject_3.StaticGameObject.clone(vFence, { position: [18, y] }));
                }
            }
            if (true) { // random sheeps
                for (let y = 2; y < 17; y++) {
                    const parts = 4;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        sheeps.push(Npc_3.Npc.clone(sheep, { position: [x, y] }));
                    }
                }
                for (let sheep1 of sheeps) {
                    sheep1.setAction(0, 5, (obj) => {
                        //
                    });
                    sheep1.onUpdate((ticks, obj, scene) => {
                        const sheep = obj;
                        if (!sheep.enabled)
                            return;
                        sheep.moveTick += ticks;
                        const state = sheep.parameters["state"];
                        if (!state) {
                            //sheep.parameters["state"] = (Math.random() * 2 | 0) === 0 ? "wandering" : "still";
                        }
                        sheep.direction = [0, 0];
                        //
                        let enemiesNearby = getEnemiesNearby(5);
                        const fearedSheeps = getFearedSheepNearby(2);
                        if (enemiesNearby.length || fearedSheeps.length) {
                            if (enemiesNearby.length) {
                                sheep.parameters["state"] = "feared";
                                sheep.parameters["stress"] = 3;
                                sheep.parameters["enemies"] = enemiesNearby;
                            }
                            else { // if (fearedSheeps.length) 
                                const sheepsStress = Math.max(...fearedSheeps.map(x => x.parameters["stress"] | 0));
                                //console.log(sheepsStress);
                                sheep.parameters["stress"] = sheepsStress - 1;
                                if (sheep.parameters["stress"] === 0) {
                                    sheep.parameters["state"] = "still";
                                    sheep.parameters["enemies"] = [];
                                }
                                else {
                                    sheep.parameters["state"] = "feared_2";
                                    sheep.parameters["enemies"] = fearedSheeps[0].parameters["enemies"];
                                    enemiesNearby = fearedSheeps[0].parameters["enemies"];
                                }
                            }
                        }
                        else {
                            sheep.parameters["state"] = "still";
                            sheep.parameters["stress"] = 0;
                            sheep.parameters["enemies"] = [];
                        }
                        if (state === "wandering") {
                            if ((Math.random() * 3 | 0) === 0) {
                                moveRandomly();
                            }
                        }
                        if (!scene.isPositionBlocked(sheep.cursorPosition)) {
                            sheep.move();
                        }
                        else if (sheep.parameters["stress"] > 0) {
                            const possibleDirs = [
                                { direction: [-1, 0] },
                                { direction: [+1, 0] },
                                { direction: [0, -1] },
                                { direction: [0, +1] },
                            ];
                            for (let pd of possibleDirs) {
                                const position = [
                                    sheep.position[0] + pd.direction[0],
                                    sheep.position[1] + pd.direction[1],
                                ];
                                pd.available = !scene.isPositionBlocked(position);
                                if (enemiesNearby.length)
                                    pd.distance = misc_3.distanceTo(position, enemiesNearby[0].position);
                            }
                            const direction = possibleDirs.filter(x => x.available);
                            direction.sort((x, y) => y.distance - x.distance);
                            if (direction.length) {
                                sheep.direction = direction[0].direction;
                                sheep.move();
                            }
                        }
                        if (sheep.parameters["state"] === "feared") {
                            sheep.skin.raw_colors[0][0] = [undefined, "OrangeRed"];
                        }
                        else if (sheep.parameters["stress"] > 1) {
                            sheep.skin.raw_colors[0][0] = [undefined, "Coral"];
                        }
                        else if (sheep.parameters["stress"] > 0) {
                            sheep.skin.raw_colors[0][0] = [undefined, "Orange"];
                        }
                        else {
                            sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
                        }
                        function moveRandomly() {
                            sheep.direction[0] = (Math.random() * 3 | 0) - 1;
                            sheep.direction[1] = (Math.random() * 3 | 0) - 1;
                        }
                        function getEnemiesNearby(radius) {
                            const enemies = [];
                            for (const object of scene.objects) {
                                if (!object.enabled)
                                    continue;
                                if (object === sheep)
                                    continue; // self check
                                if (object instanceof Npc_3.Npc && object.type !== "sheep") {
                                    if (sheep.distanceTo(object) < radius) {
                                        enemies.push(object);
                                    }
                                }
                            }
                            return enemies;
                        }
                        function getFearedSheepNearby(radius) {
                            const sheepsNearby = [];
                            for (const object of scene.objects) {
                                if (!object.enabled)
                                    continue;
                                if (object === sheep)
                                    continue; // self check
                                if (object instanceof Npc_3.Npc && object.type === "sheep") {
                                    if (sheep.distanceTo(object) < radius
                                        && (object.parameters["stress"] | 0) > 0) {
                                        sheepsNearby.push(object);
                                    }
                                }
                            }
                            return sheepsNearby;
                        }
                    });
                }
            }
            wolf = new Npc_3.Npc(new ObjectSkin_5.ObjectSkin(`🐺`, `.`, {
                '.': [undefined, 'transparent'],
            }), [15, 15]);
            wolf.type = "wolf";
            wolf.moveSpeed = 4;
            wolf.onUpdate((ticks, obj, scene) => {
                const wolf = obj;
                wolf.moveTick += ticks;
                wolf.direction = [0, 0];
                //
                const prayList = getPrayNearby(6);
                if (prayList.length) {
                    wolf.parameters["target"] = prayList[0];
                }
                const target = wolf.parameters["target"];
                if (target) {
                    if (wolf.distanceTo(target) <= 1) {
                        target.enabled = false; // eat prey
                        console.log("Wolf ate sheep");
                        wolf.parameters["target"] = null;
                    }
                    const possibleDirs = [
                        { direction: [-1, 0] },
                        { direction: [+1, 0] },
                        { direction: [0, -1] },
                        { direction: [0, +1] },
                    ];
                    for (let pd of possibleDirs) {
                        const position = [
                            wolf.position[0] + pd.direction[0],
                            wolf.position[1] + pd.direction[1],
                        ];
                        pd.available = !scene.isPositionBlocked(position);
                        pd.distance = misc_3.distanceTo(position, target.position);
                    }
                    const direction = possibleDirs.filter(x => x.available);
                    direction.sort((x, y) => x.distance - y.distance);
                    if (direction.length) {
                        wolf.direction = direction[0].direction;
                        wolf.move();
                    }
                }
                function getPrayNearby(radius) {
                    const enemies = [];
                    for (const object of scene.objects) {
                        if (!object.enabled)
                            continue;
                        if (object === wolf)
                            continue; // self check
                        if (object instanceof Npc_3.Npc && object.type === "sheep") {
                            if (wolf.distanceTo(object) < radius) {
                                enemies.push(object);
                            }
                        }
                    }
                    return enemies;
                }
            });
            wolves.push(wolf);
            tree2 = StaticGameObject_3.StaticGameObject.clone(objects_1.tree, { position: [7, 9] });
            exports_14("sheepLevel", sheepLevel = [...sheeps, ...wolves, ...fences, tree2]);
        }
    };
});
System.register("world/items", ["engine/Item", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_15, context_15) {
    var Item_1, ObjectSkin_6, ObjectPhysics_6, lamp;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            }
        ],
        execute: function () {
            exports_15("lamp", lamp = new Item_1.Item([0, 0], new ObjectSkin_6.ObjectSkin(`🏮`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_6.ObjectPhysics(` `, `f`), [0, 0]));
        }
    };
});
System.register("world/hero", ["engine/Npc", "engine/ObjectSkin", "world/items"], function (exports_16, context_16) {
    var Npc_4, ObjectSkin_7, items_1, hero;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            }
        ],
        execute: function () {
            exports_16("hero", hero = new Npc_4.Npc(new ObjectSkin_7.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [9, 7]));
            hero.moveSpeed = 10;
            hero.showCursor = true;
            hero.objectInSecondaryHand = items_1.lamp;
            hero.onUpdate((ticks, o, scene) => {
                const obj = o;
                obj.moveTick += ticks;
                if (obj.objectInMainHand) {
                    obj.objectInMainHand.position = obj.cursorPosition;
                }
                if (obj.objectInSecondaryHand) {
                    obj.objectInSecondaryHand.position = [
                        obj.position[0] + obj.direction[1],
                        obj.position[1] - obj.direction[0],
                    ];
                }
            });
        }
    };
});
System.register("main", ["world/levels/sheep", "engine/GameEvent", "engine/EventLoop", "engine/Scene", "engine/Cell", "engine/GraphicsEngine", "world/hero"], function (exports_17, context_17) {
    var sheep_1, GameEvent_2, EventLoop_2, Scene_1, Cell_3, GraphicsEngine_2, hero_1, canvas, ctx, Game, game, scene, viewWidth, viewHeight, ticksPerStep;
    var __moduleName = context_17 && context_17.id;
    function getActionUnderCursor() {
        const npc = hero_1.hero;
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
        game.update(ticksPerStep);
        EventLoop_2.eventLoop([game, scene, ...scene.objects]);
        game.draw();
    }
    return {
        setters: [
            function (sheep_1_1) {
                sheep_1 = sheep_1_1;
            },
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
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
            function (hero_1_1) {
                hero_1 = hero_1_1;
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
                update(ticks) {
                    if (this.mode === "scene")
                        scene.update(ticks);
                }
            };
            game = new Game();
            scene = new Scene_1.Scene();
            scene.objects = sheep_1.sheepLevel;
            exports_17("viewWidth", viewWidth = 20);
            exports_17("viewHeight", viewHeight = 20);
            scene.objects.push(hero_1.hero);
            document.addEventListener("keydown", function (ev) {
                // const raw_key = ev.key.toLowerCase();
                const key_code = ev.code;
                if (game.mode === 'scene') {
                    // onSceneInput();
                }
                else if (game.mode === 'dialog') {
                    if (key_code === "Escape") {
                        EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
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
                        hero_1.hero.direction = [0, -1];
                    }
                    else if (raw_key === 's') {
                        hero_1.hero.direction = [0, +1];
                    }
                    else if (raw_key === 'a') {
                        hero_1.hero.direction = [-1, 0];
                    }
                    else if (raw_key === 'd') {
                        hero_1.hero.direction = [+1, 0];
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
                            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "weather_changed", {
                                from: oldWeatherType,
                                to: scene.weatherType,
                            }));
                        }
                        // wind
                        if (raw_key === 'e') {
                            scene.isWindy = !scene.isWindy;
                            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "wind_changed", {
                                from: !scene.isWindy,
                                to: scene.isWindy,
                            }));
                        }
                        //
                        if (raw_key === 'q') { // debug
                            scene.timePeriod = scene.timePeriod === 'day' ? 'night' : 'day';
                            //
                            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "time_changed", {
                                from: scene.timePeriod === 'day' ? 'night' : 'day',
                                to: scene.timePeriod,
                            }));
                        }
                        return; // skip
                    }
                    if (!code.shiftKey) {
                        if (!scene.isPositionBlocked(hero_1.hero.cursorPosition)) {
                            hero_1.hero.move();
                        }
                    }
                }
            });
            ticksPerStep = 33;
            // initial events
            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "weather_changed", { from: scene.weatherType, to: scene.weatherType }));
            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "wind_changed", { from: scene.isWindy, to: scene.isWindy }));
            EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "time_changed", { from: scene.timePeriod, to: scene.timePeriod }));
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
        }
    };
});
System.register("world/npcs", ["engine/ObjectSkin", "engine/EventLoop", "engine/GameEvent", "engine/Npc"], function (exports_18, context_18) {
    var ObjectSkin_8, EventLoop_3, GameEvent_3, Npc_5, ulan, npcs;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            }
        ],
        execute: function () {
            ulan = new Npc_5.Npc(new ObjectSkin_8.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (o) => {
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            exports_18("npcs", npcs = [
                ulan,
            ]);
        }
    };
});
System.register("world/levels/intro", ["world/objects", "utils/misc", "engine/EventLoop", "engine/GameEvent", "world/npcs"], function (exports_19, context_19) {
    var objects_2, misc_4, EventLoop_4, GameEvent_4, npcs_1, introLevel;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (objects_2_1) {
                objects_2 = objects_2_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            },
            function (npcs_1_1) {
                npcs_1 = npcs_1_1;
            }
        ],
        execute: function () {
            exports_19("introLevel", introLevel = [...objects_2.flowers, objects_2.house, objects_2.chest, objects_2.tree, ...objects_2.trees, ...objects_2.lamps, ...npcs_1.npcs]);
            // scripts
            objects_2.chest.setAction(0, 0, function () {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent(objects_2.chest, "add_object", { object: misc_4.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
//# sourceMappingURL=app.js.map