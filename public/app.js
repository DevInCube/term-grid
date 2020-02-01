System.register("engine/ObjectSkin", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var ObjectSkin;
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
                    this.characters = charactersMask
                        .split('\n');
                    //.map(p => p.replace(/\s/g, '').replace(/\'/g, ' '));
                    // console.log(charactersMask, this.characters);
                }
                getRawColors() {
                    let raw_colors = [];
                    const lines = this.colorsMask
                        .split('\n');
                    //.map(p => p.replace(/\s/g, '').replace(/\'/g, ' '));
                    for (let y = 0; y < lines.length; y++) {
                        raw_colors.push([]);
                        for (let x = 0; x < lines[y].length; x++) {
                            const cellColor = (lines[y] && lines[y][x]) || ' ';
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
    var __moduleName = context_2 && context_2.id;
    var ObjectPhysics;
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
System.register("engine/SceneObject", ["engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    var ObjectSkin_1, ObjectPhysics_1, SceneObject;
    return {
        setters: [
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
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
                    this.ticks = 0;
                    //
                }
                new() { return new SceneObject([0, 0], new ObjectSkin_1.ObjectSkin(), new ObjectPhysics_1.ObjectPhysics(), [0, 0]); }
                // add cb params
                setAction(left, top, action) {
                    this.actions.push([[left, top], action]);
                }
                handleEvent(ev) { }
                update(ticks, scene) {
                    this.ticks += ticks;
                }
            };
            exports_3("SceneObject", SceneObject);
        }
    };
});
System.register("engine/GameEvent", [], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    var GameEvent;
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
System.register("engine/Cell", [], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    var Cell;
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
            exports_5("Cell", Cell);
        }
    };
});
System.register("engine/EventLoop", [], function (exports_6, context_6) {
    var __moduleName = context_6 && context_6.id;
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
    exports_6("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_6("emitEvent", emitEvent);
    var events;
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("engine/StaticGameObject", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    var SceneObject_1, ObjectSkin_2, ObjectPhysics_2, StaticGameObject;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position = [0, 0]) {
                    super(originPoint, skin, physics, position);
                }
                new() { return new StaticGameObject([0, 0], new ObjectSkin_2.ObjectSkin(), new ObjectPhysics_2.ObjectPhysics(), [0, 0]); }
            };
            exports_7("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics"], function (exports_8, context_8) {
    var __moduleName = context_8 && context_8.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_8("distanceTo", distanceTo);
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_3.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_3.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_8("createTextObject", createTextObject);
    function clone(o, params = {}) {
        return Object.assign(o.new(), deepCopy(o), params);
    }
    exports_8("clone", clone);
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
    exports_8("deepCopy", deepCopy);
    var ObjectSkin_3, StaticGameObject_1, ObjectPhysics_3;
    return {
        setters: [
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/Item", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_9, context_9) {
    var __moduleName = context_9 && context_9.id;
    var SceneObject_2, ObjectSkin_4, ObjectPhysics_4, Item;
    return {
        setters: [
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_2.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
                new() {
                    return new Item([0, 0], new ObjectSkin_4.ObjectSkin(), new ObjectPhysics_4.ObjectPhysics(), [0, 0]);
                }
            };
            exports_9("Item", Item);
        }
    };
});
System.register("engine/Npc", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics", "utils/misc", "engine/EventLoop", "engine/GameEvent"], function (exports_10, context_10) {
    var __moduleName = context_10 && context_10.id;
    var SceneObject_3, ObjectSkin_5, ObjectPhysics_5, misc_1, EventLoop_1, GameEvent_1, Npc;
    return {
        setters: [
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_3.SceneObject {
                constructor(skin = new ObjectSkin_5.ObjectSkin(), position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_5.ObjectPhysics(`.`, ``), position);
                    this.type = "undefined";
                    this.direction = [0, 1];
                    this.showCursor = false;
                    this.moveSpeed = 2; // cells per second
                    this.moveTick = 0;
                    this.objectInMainHand = null;
                    this.objectInSecondaryHand = null;
                    this.health = 1;
                    this.maxHealth = 3;
                    this.basicAttack = 1;
                    this.attackTick = 0;
                    this.attackSpeed = 1; // atk per second
                    this.important = true;
                }
                get attackValue() {
                    return this.basicAttack; // @todo
                }
                get cursorPosition() {
                    return [
                        this.position[0] + this.direction[0],
                        this.position[1] + this.direction[1]
                    ];
                }
                new() { return new Npc(); }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.moveTick += ticks;
                    this.attackTick += ticks;
                    //
                    const obj = this;
                    if (obj.objectInMainHand) {
                        obj.objectInMainHand.position = [
                            obj.cursorPosition[0],
                            obj.cursorPosition[1],
                        ];
                    }
                    if (obj.objectInSecondaryHand) {
                        obj.objectInSecondaryHand.position = [
                            obj.position[0] + obj.direction[1],
                            obj.position[1] - obj.direction[0],
                        ];
                    }
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
                attack(target) {
                    if (this.attackTick > 1000 / this.attackSpeed) {
                        this.attackTick = 0;
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "attack", {
                            object: this,
                            subject: target,
                        }));
                    }
                }
                distanceTo(other) {
                    return misc_1.distanceTo(this.position, other.position);
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === "attack" && ev.args.subject === this) {
                        const damage = ev.args.object.attackValue;
                        this.health -= damage;
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(ev.args.object, "damage", Object.create(ev.args)));
                        if (this.health <= 0) {
                            // @todo add death cause to this event
                            this.enabled = false;
                            EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "death", { object: this }));
                        }
                    }
                }
                runAway(scene, enemiesNearby) {
                    const possibleDirs = [
                        { direction: [-1, 0] },
                        { direction: [+1, 0] },
                        { direction: [0, -1] },
                        { direction: [0, +1] },
                    ];
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        pd.available = !scene.isPositionBlocked(position);
                        if (enemiesNearby.length)
                            pd.distance = misc_1.distanceTo(position, enemiesNearby[0].position);
                    }
                    const direction = possibleDirs.filter(x => x.available);
                    direction.sort((x, y) => y.distance - x.distance);
                    if (direction.length) {
                        this.direction = direction[0].direction;
                        this.move();
                    }
                }
                approach(scene, target) {
                    const possibleDirs = [
                        { direction: [-1, 0] },
                        { direction: [+1, 0] },
                        { direction: [0, -1] },
                        { direction: [0, +1] },
                    ];
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        pd.available = !scene.isPositionBlocked(position);
                        pd.distance = misc_1.distanceTo(position, target.position);
                    }
                    const direction = possibleDirs.filter(x => x.available);
                    direction.sort((x, y) => x.distance - y.distance);
                    if (direction.length) {
                        this.direction = direction[0].direction;
                        this.move();
                    }
                }
                moveRandomly() {
                    if ((Math.random() * 100 | 0) === 0) {
                        this.direction[0] = (Math.random() * 3 | 0) - 1;
                        if (this.direction[0] === 0) {
                            this.direction[1] = (Math.random() * 3 | 0) - 1;
                        }
                    }
                }
                getMobsNearby(scene, radius, callback) {
                    const enemies = [];
                    for (const object of scene.objects) {
                        if (!object.enabled)
                            continue;
                        if (object === this)
                            continue; // self check
                        if (object instanceof Npc && callback(object)) {
                            if (this.distanceTo(object) < radius) {
                                enemies.push(object);
                            }
                        }
                    }
                    return enemies;
                }
            };
            exports_10("Npc", Npc);
        }
    };
});
System.register("engine/GraphicsEngine", ["engine/Cell", "engine/Npc", "main"], function (exports_11, context_11) {
    var __moduleName = context_11 && context_11.id;
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
    exports_11("drawObjects", drawObjects);
    function drawNpcCursor(ctx, npc) {
        const leftPos = npc.position[0] + npc.direction[0];
        const topPos = npc.position[1] + npc.direction[1];
        drawCell(ctx, new Cell_1.Cell(' ', 'black', 'yellow'), leftPos, topPos, true);
        // palette borders
        const left = leftPos * cellStyle.size.width;
        const top = topPos * cellStyle.size.height;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(main_1.leftPad + left, main_1.topPad + top, cellStyle.size.width, cellStyle.size.height);
    }
    function drawObjectAt(ctx, obj, position) {
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
                if (cell.character !== ' ' || cell.textColor !== '' || cell.backgroundColor !== '') {
                    drawCell(ctx, cell, position[0] - obj.originPoint[0] + x, position[1] - obj.originPoint[1] + y);
                }
                x += 1;
            }
        }
    }
    exports_11("drawObjectAt", drawObjectAt);
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
                    const borders = (true) ? [
                        isEmptyCell(obj, x + 0, y - 1),
                        isEmptyCell(obj, x + 1, y + 0),
                        isEmptyCell(obj, x + 0, y + 1),
                        isEmptyCell(obj, x - 1, y + 0),
                    ] : [];
                    drawCell(ctx, cell, obj.position[0] - obj.originPoint[0] + x, obj.position[1] - obj.originPoint[1] + y, transparent, borders);
                    /* */
                }
                x += 1;
            }
        }
        function isEmptyCell(obj, x, y) {
            const cellColor = (obj.skin.raw_colors[y] && obj.skin.raw_colors[y][x])
                ? obj.skin.raw_colors[y][x]
                : ['', ''];
            return cellColor[0] === '' && cellColor[1] === '';
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
    exports_11("isCollision", isCollision);
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
        // const color = object.skin.raw_colors[ptop] && object.skin.raw_colors[ptop][pleft]
        //     ? object.skin.raw_colors[ptop]
        //     : [undefined, undefined];
        return (cchar !== emptyCollisionChar); //|| (!!color[0] || !!color[1])
    }
    exports_11("isPositionBehindTheObject", isPositionBehindTheObject);
    function drawCell(ctx, cell, leftPos, topPos, transparent = false, border = [false, false, false, false]) {
        if (leftPos < 0 || topPos < 0)
            return;
        const left = main_1.leftPad + leftPos * cellStyle.size.width;
        const top = main_1.topPad + topPos * cellStyle.size.height;
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
        addObjectBorders();
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
    exports_11("drawCell", drawCell);
    var Cell_1, Npc_1, main_1, GraphicsEngine, cellStyle, emptyCollisionChar;
    return {
        setters: [
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_11("GraphicsEngine", GraphicsEngine);
            exports_11("cellStyle", cellStyle = {
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
            });
            emptyCollisionChar = ' ';
        }
    };
});
System.register("engine/SceneBase", ["engine/GraphicsEngine"], function (exports_12, context_12) {
    var __moduleName = context_12 && context_12.id;
    var GraphicsEngine_1, SceneBase;
    return {
        setters: [
            function (GraphicsEngine_1_1) {
                GraphicsEngine_1 = GraphicsEngine_1_1;
            }
        ],
        execute: function () {
            SceneBase = class SceneBase {
                constructor() {
                    this.objects = [];
                }
                handleEvent(ev) {
                }
                update(ticks) {
                    for (const obj of this.objects) {
                        if (!obj.enabled)
                            continue;
                        obj.update(ticks, this);
                    }
                }
                draw(ctx) {
                    // sort objects by origin point
                    this.objects.sort((a, b) => a.position[1] - b.position[1]);
                    GraphicsEngine_1.drawObjects(ctx, this.objects);
                }
                // extra
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
            exports_12("SceneBase", SceneBase);
        }
    };
});
System.register("engine/Scene", ["engine/GameEvent", "main", "engine/Cell", "engine/EventLoop", "engine/GraphicsEngine", "engine/Npc", "engine/SceneBase"], function (exports_13, context_13) {
    var __moduleName = context_13 && context_13.id;
    var GameEvent_2, main_2, Cell_2, EventLoop_2, GraphicsEngine_2, Npc_2, SceneBase_1, defaultLightLevelAtNight, bedrockCell, Scene;
    return {
        setters: [
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            },
            function (main_2_1) {
                main_2 = main_2_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GraphicsEngine_2_1) {
                GraphicsEngine_2 = GraphicsEngine_2_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            },
            function (SceneBase_1_1) {
                SceneBase_1 = SceneBase_1_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            bedrockCell = new Cell_2.Cell(' ', 'transparent', '#331');
            Scene = class Scene extends SceneBase_1.SceneBase {
                constructor() {
                    super(...arguments);
                    this.weatherType = 'normal';
                    this.weatherTicks = 0;
                    this.temperature = 7; // 0-15 @todo add effects
                    this.isWindy = true;
                    this.timePeriod = 'day';
                    this.tiles = [];
                    this.lightLayer = [];
                    this.weatherLayer = [];
                    this.dayLightLevel = 15;
                    this.globalLightLevel = 0;
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_2.emitEvent(new GameEvent_2.GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
                    }
                }
                update(ticks) {
                    this.weatherTicks += ticks;
                    // update all enabled objects
                    super.update(ticks);
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
                            for (let y = 0; y < main_2.viewHeight; y++) {
                                for (let x = 0; x < main_2.viewWidth; x++) {
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
                        for (let y = 0; y < main_2.viewHeight; y++) {
                            for (let x = 0; x < main_2.viewWidth; x++) {
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
                    // tiles
                    for (let y = 0; y < main_2.viewHeight; y++) {
                        for (let x = 0; x < main_2.viewWidth; x++) {
                            var cell = this.tiles[y] ? this.tiles[y][x] : null;
                            GraphicsEngine_2.drawCell(ctx, cell ? cell : bedrockCell, x, y);
                        }
                    }
                    super.draw(ctx);
                    const scene = this;
                    drawWeather();
                    //drawLights();
                    function drawWeather() {
                        for (let y = 0; y < main_2.viewHeight; y++) {
                            for (let x = 0; x < main_2.viewWidth; x++) {
                                if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                                    GraphicsEngine_2.drawCell(ctx, scene.weatherLayer[y][x], x, y);
                            }
                        }
                    }
                    function drawLights() {
                        for (let y = 0; y < main_2.viewHeight; y++) {
                            for (let x = 0; x < main_2.viewWidth; x++) {
                                const lightLevel = scene.lightLayer[y][x] | 0;
                                GraphicsEngine_2.drawCell(ctx, new Cell_2.Cell(' ', undefined, `#000${(15 - lightLevel).toString(16)}`), x, y);
                            }
                        }
                    }
                }
            };
            exports_13("Scene", Scene);
        }
    };
});
System.register("engine/SpriteLoader", ["engine/ObjectSkin"], function (exports_14, context_14) {
    var __moduleName = context_14 && context_14.id;
    var ObjectSkin_6, SpriteInfo, Sprite;
    return {
        setters: [
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            }
        ],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            Sprite = class Sprite {
                constructor() {
                    this.frames = {};
                }
                static parse(str) {
                    var info = new SpriteInfo();
                    var lines = str.split(`\n`);
                    var i = 0;
                    var colorsDict = {};
                    // read headers (sprite info)
                    while (lines[i] !== '') {
                        var [key, value] = lines[i].split(':');
                        if (key === 'width')
                            info.width = Number(value);
                        else if (key === 'height')
                            info.height = Number(value);
                        else if (key === 'name')
                            info.name = value;
                        else if (key === 'empty')
                            info.empty = value;
                        else if (key === 'color') {
                            let colorParts = value.split(',');
                            colorsDict[colorParts[0]] = [colorParts[1], colorParts[2]];
                        }
                        else
                            throw new Error(`unknown key: '${key}'`);
                        i++;
                    }
                    i++;
                    console.log(info);
                    var sprite = new Sprite();
                    while (i < lines.length) {
                        if (lines[i].startsWith(info.name)) {
                            var name = lines[i].substr(info.name.length);
                            console.log(name);
                            i++;
                            const framesCount = lines[i].length / info.width;
                            var bodies = Array(framesCount).fill(``);
                            for (let y = 0; y < info.height; y++) {
                                for (let x = 0; x < framesCount; x++) {
                                    const part = lines[i + y].substr(x * info.width, info.width);
                                    bodies[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                                }
                            }
                            i += info.height;
                            //
                            var colors = Array(framesCount).fill(``);
                            for (let y = 0; y < info.height; y++) {
                                for (let x = 0; x < framesCount; x++) {
                                    const part = lines[i + y].substr(x * info.width, info.width);
                                    colors[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                                }
                            }
                            i += info.height;
                            for (let k = 0; k < framesCount; k++) {
                                if (k === 0)
                                    sprite.frames[name] = [];
                                sprite.frames[name].push(new ObjectSkin_6.ObjectSkin(bodies[k], colors[k], colorsDict));
                            }
                        }
                        else {
                            i += 1;
                        }
                    }
                    return sprite;
                }
            };
            exports_14("Sprite", Sprite);
        }
    };
});
System.register("world/sprites/glitchy", ["engine/SpriteLoader"], function (exports_15, context_15) {
    var __moduleName = context_15 && context_15.id;
    var SpriteLoader_1, glitchySprite_old, glitchySpriteText, glitchySprite;
    return {
        setters: [
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            glitchySprite_old = `width:7
height:3
name:  
empty:'
color:A,#000f,#aaaf
color:E,#00ff,#aaff
color:M,#0f0f,#afaf
color:t,#f00f,#faaf

  move right
'''''''''''''''''''''
--[•~•]-~[•-•]~-[•.•]
'''''''''''''''''''''
'''''''''''''''''''''
ttAEMEAttAEMEAttAEMEA
'''''''''''''''''''''
  move left
'''''''''''''''''''''
[•~•]--[•-•]~-[•.•]-~
'''''''''''''''''''''
'''''''''''''''''''''
AEMEAttAEMEAttAEMEAtt
'''''''''''''''''''''
  move up
'''''''''''''''''''''
'[•~•]''[•-•]''[•.•]'
'''|'''''')''''''('''
'''''''''''''''''''''
'AEMEA''AEMEA''AEMEA'
'''t''''''t''''''t'''
  move down
'''|''''''('''''')'''
'[•~•]''[•-•]''[•.•]'
'''''''''''''''''''''
'''t''''''t''''''t'''
'AEMEA''AEMEA''AEMEA'
'''''''''''''''''''''`;
            glitchySpriteText = `width:3
height:3
name:  
empty:'
color:A,#000f,#ff0f
color:E,#ffff,#aaf0
color:t,#f8ff,#faa0
color:o,#f000,#faa0

  move right
'--
>••
'__'
oEE
tAA
oEE`;
            exports_15("glitchySprite", glitchySprite = SpriteLoader_1.Sprite.parse(glitchySpriteText));
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics", "utils/misc"], function (exports_16, context_16) {
    var __moduleName = context_16 && context_16.id;
    var StaticGameObject_2, ObjectSkin_7, ObjectPhysics_6, misc_2, house, lamp, lamps, chest, pillar, arc, shop;
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
            exports_16("house", house = new StaticGameObject_2.StaticGameObject([2, 2], new ObjectSkin_7.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }), new ObjectPhysics_6.ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]));
            lamp = new StaticGameObject_2.StaticGameObject([0, 2], new ObjectSkin_7.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                'L': ['yellow', 'transparent'],
                'H': ['#666', 'transparent'],
            }), new ObjectPhysics_6.ObjectPhysics(` 
 
. `, `B`), [0, 0]);
            lamp.parameters["is_on"] = true;
            lamp.setAction(0, 2, (o) => {
                o.parameters["is_on"] = !o.parameters["is_on"];
                o.skin.raw_colors[0][0] = [o.parameters["is_on"] ? 'yellow' : 'gray', 'transparent'];
                o.physics.lights[0] = o.parameters["is_on"] ? 'F' : '0';
            });
            exports_16("lamps", lamps = [
                misc_2.clone(lamp, { position: [2, 5] }),
            ]);
            exports_16("chest", chest = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_7.ObjectSkin(`S`, `V`, {
                V: ['yellow', 'violet'],
            }), new ObjectPhysics_6.ObjectPhysics(`.`, ''), [2, 10]));
            exports_16("pillar", pillar = new StaticGameObject_2.StaticGameObject([0, 3], new ObjectSkin_7.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_6.ObjectPhysics(` 
 
 
. `), [0, 0]));
            exports_16("arc", arc = new StaticGameObject_2.StaticGameObject([2, 3], new ObjectSkin_7.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_6.ObjectPhysics(`     
     
     
.   .`), [0, 0]));
            exports_16("shop", shop = new StaticGameObject_2.StaticGameObject([2, 3], new ObjectSkin_7.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_6.ObjectPhysics(`       
       
       
 ..... `), [0, 0]));
        }
    };
});
System.register("world/items", ["engine/Item", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_17, context_17) {
    var __moduleName = context_17 && context_17.id;
    var Item_1, ObjectSkin_8, ObjectPhysics_7, lamp, sword;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            }
        ],
        execute: function () {
            exports_17("lamp", lamp = new Item_1.Item([0, 0], new ObjectSkin_8.ObjectSkin(`🏮`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(` `, `f`), [0, 0]));
            exports_17("sword", sword = new Item_1.Item([0, 0], new ObjectSkin_8.ObjectSkin(`🗡`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(), [0, 0]));
        }
    };
});
System.register("world/hero", ["engine/Npc", "engine/ObjectSkin"], function (exports_18, context_18) {
    var __moduleName = context_18 && context_18.id;
    var Npc_3, ObjectSkin_9, hero;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            }
        ],
        execute: function () {
            exports_18("hero", hero = new class extends Npc_3.Npc {
                constructor() {
                    super(new ObjectSkin_9.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [17, 15]);
                    this.type = "human";
                    this.moveSpeed = 10;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const obj = this;
                    obj.moveTick += ticks;
                }
            });
        }
    };
});
System.register("world/levels/glitch", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics", "world/hero"], function (exports_19, context_19) {
    var __moduleName = context_19 && context_19.id;
    var StaticGameObject_3, ObjectSkin_10, ObjectPhysics_8, hero_1, Glitch, glitch;
    return {
        setters: [
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            },
            function (hero_1_1) {
                hero_1 = hero_1_1;
            }
        ],
        execute: function () {
            Glitch = class Glitch extends StaticGameObject_3.StaticGameObject {
                constructor() {
                    super([0, 0], new ObjectSkin_10.ObjectSkin(`AA
 A`, `aa
 a`, {
                        'a': ['#f0f', '#0fff'],
                    }), new ObjectPhysics_8.ObjectPhysics(`.`, ''), [0, 0]);
                    this.isDestroyed = false;
                    this.hiddenFrames = {
                        450: [
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: ' ', f: '#0000', b: '#0000' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: ' ', f: '#0000', b: '#0000' }]
                        ],
                    };
                    this.idleFrames = {
                        450: [
                            [{ c: '$', f: '#0f0', b: '#f0f' }, { c: '@', f: '#0f0', b: '#f0f' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                        500: [
                            [{ c: 'z', f: '#f0f', b: '#0ff' }, { c: '@', f: '#0f0', b: '#f0f' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                        530: [
                            [{ c: 'z', f: '#0f0', b: '#f0f' }, { c: '@', f: '#0f0', b: '#f0f' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: 'x', f: '#0f0', b: '#f0f' }]
                        ],
                        950: [
                            [{ c: 's', f: '#0f0', b: '#f0f' }, { c: '@', f: '#0f0', b: '#f0f' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                    };
                    this.clickFrames = {
                        450: [
                            [{ c: '$', f: '#0f0', b: '#f0f' }, { c: '+', f: '#0f0', b: '#f0a' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                        500: [
                            [{ c: 'z', f: '#f0f', b: '#0ff' }, { c: '+', f: '#0f0', b: '#f0a' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                        530: [
                            [{ c: 'z', f: '#0f0', b: '#f0f' }, { c: '+', f: '#0f0', b: '#f0a' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: 'x', f: '#0f0', b: '#f0f' }]
                        ],
                        950: [
                            [{ c: 's', f: '#0f0', b: '#f0f' }, { c: '+', f: '#0f0', b: '#f0a' }],
                            [{ c: ' ', f: '#0000', b: '#0000' }, { c: '@', f: '#0f0', b: '#f0f' }]
                        ],
                    };
                    this.frames = this.clickFrames;
                    this.parameters["animate"] = true;
                }
                new() {
                    return new Glitch();
                }
                getFrame() {
                    const keys = Object.keys(this.frames).map(k => Number(k)).sort();
                    const frameKey = (() => {
                        while (true) {
                            const key = keys.find(k => k > this.ticks);
                            if ("undefined" === typeof key) {
                                this.ticks -= keys[keys.length - 1];
                            }
                            else {
                                return key;
                            }
                        }
                    })();
                    return this.frames[frameKey];
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.frames = (() => {
                        if (this.isDestroyed) {
                            return this.hiddenFrames;
                        }
                        if (hero_1.hero.position[0] === 10 && hero_1.hero.position[1] === 10) {
                            return this.clickFrames;
                        }
                        if (hero_1.hero.position[0] >= 10 - 2 && hero_1.hero.position[0] <= 10 + 2
                            && hero_1.hero.position[1] >= 10 - 2 && hero_1.hero.position[1] <= 10 + 2) {
                            return this.idleFrames;
                        }
                        return this.hiddenFrames;
                    })();
                    const frame = this.getFrame();
                    const o = this;
                    for (let x = 0; x < frame.length; x++) {
                        o.skin.characters[x] = frame[x].map(s => s.c).join("");
                        for (let y = 0; y < frame[x].length; y++) {
                            o.skin.raw_colors[x][y][0] = frame[x][y].f;
                            o.skin.raw_colors[x][y][1] = frame[x][y].b;
                        }
                    }
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    //
                    if (ev.type === "click") {
                        if (this.frames === this.clickFrames && ev.args.x === 8 && ev.args.y === 7) {
                            this.isDestroyed = true;
                        }
                    }
                }
            };
            exports_19("Glitch", Glitch);
            exports_19("glitch", glitch = new Glitch());
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/Cell"], function (exports_20, context_20) {
    var __moduleName = context_20 && context_20.id;
    function parseTiles(str, colors) {
        let common = {};
        return str
            .split('\n')
            .map(mapLine);
        function mapLine(line) {
            return line
                .split('')
                .map(mapCell);
        }
        function mapCell(s) {
            return s === ' ' ? null : createCell(s);
        }
        function createCell(s) {
            return common[s]
                ? common[s]
                : (common[s] = new Cell_3.Cell(' ', 'transparent', colors[s]));
        }
    }
    var Cell_3, tiles;
    return {
        setters: [
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            }
        ],
        execute: function () {
            exports_20("tiles", tiles = parseTiles(`gggggggGGggggggGGggGgggggggGGgggg ggggggggGGgg ggG
gGGGgggGGGGggggggg  ggggggggggggggGgggggggggggg ggg
ggGgGGGg gg gggggggggggggggg    gGgGGgGGg g gg g gg
    gg gg gggg gggg gggg ggg    ggGgggggg gg ggggg 
      ggg g       gg    gggg    ggGggggGGGGg gggggg
                   gg gggggg    ggGgggggggggGGGGGgg
g                     gg        ggggggg gggggggggg
Gg        ggG    GG         ggggGGG       gggggg  g
g      ggggg                   g gg   gggg    GGggg
Gg      ggGG   gg     gG        GGssssssss  ggggggg
G     gggg                       ssswwwWWWssgggGGgg
g                                 bbbBBWWwwwsgggggg
g           g        g             sswwwwWwsggg ggg
g                                    ssssssgg   ggg
           gg      gggggg             ggggggg ggggg
g g      GGGGG     gGWwGWGgg gggg          gGG  ggg
gg g     ggggg     gGggwGGwggg gggg     ggggGGGGggg
ggggg  gg            GwGgwgg ggg gg     gg g gGG gg
ggGGGggg            gwwGggw    gg           g g ggg
gg  gg gg          gggggwGGGgg                 gg g
gggggggGG              GGGGgggggGGGgggG            
gGGGGgggG                       GGggg   GGG        
gg   gGG    gggg                 gg  g g g gssbsssg
g   gg     gGGgggggg gg gggg      gGGg ggsssssbwwws
   g gg     ggGGgGGg  gg g  g g     ggGGgwwwwwbwwww
ggsss      gGGgg ggg    sss sssbBbssswwwwwWWWWBWWWw
wwwwwww            wwwwwwwwwwwwBbbwwwwwwwwwWWWWWWWW
ggggwwww          wwwwwWWWWWWWWbbBWWWWwwwwwwwwwwWWW
ggggggwwwssssswwwwwWWWWWwsssg sbBbsssswwwwwwwwwWWWW
gggggwwwwwwwwwwwww gggg gggggggg  gg  ggssswwwWWWWW`, {
                'g': '#350',
                'G': '#240',
                'w': '#358',
                'W': '#246',
                'b': '#444',
                'B': '#333',
                's': '#b80',
            }));
        }
    };
});
System.register("world/levels/ggj2020demo/npc", ["world/sprites/glitchy", "engine/Npc"], function (exports_21, context_21) {
    var __moduleName = context_21 && context_21.id;
    var glitchy_1, Npc_4, glitchyNpc;
    return {
        setters: [
            function (glitchy_1_1) {
                glitchy_1 = glitchy_1_1;
            },
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            }
        ],
        execute: function () {
            exports_21("glitchyNpc", glitchyNpc = new class extends Npc_4.Npc {
                constructor() {
                    super(glitchy_1.glitchySprite.frames["move right"][0], [20, 15]);
                    this.type = "glitchy";
                    this.moveSpeed = 4;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const self = this;
                    self.direction = [0, 0];
                    //
                    const prayList = getPrayNearby(this, 6);
                    if (!self.parameters["target"] && prayList.length) {
                        self.parameters["target"] = prayList[0];
                    }
                    const target = self.parameters["target"];
                    if (target) {
                        if (self.distanceTo(target) <= 1) {
                            self.attack(target);
                        }
                        self.approach(scene, target);
                    }
                    function getPrayNearby(self, radius) {
                        const enemies = [];
                        for (const object of scene.objects) {
                            if (!object.enabled)
                                continue;
                            if (object === self)
                                continue; // self check
                            if (object instanceof Npc_4.Npc && object.type === "sheep") {
                                if (self.distanceTo(object) < radius) {
                                    enemies.push(object);
                                }
                            }
                        }
                        return enemies;
                    }
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
                        this.parameters["target"] = null;
                    }
                }
            });
        }
    };
});
System.register("world/npc/Sheep", ["engine/Npc", "engine/ObjectSkin"], function (exports_22, context_22) {
    var __moduleName = context_22 && context_22.id;
    var Npc_5, ObjectSkin_11, Sheep;
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_5.Npc {
                constructor() {
                    super(new ObjectSkin_11.ObjectSkin(`🐑`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), [0, 0]);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                new() {
                    return new Sheep();
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const sheep = this;
                    const state = sheep.parameters["state"];
                    if (!state) {
                        //sheep.parameters["state"] = (Math.random() * 2 | 0) === 0 ? "wandering" : "still";
                    }
                    sheep.direction = [0, 0];
                    //
                    let enemiesNearby = this.getMobsNearby(scene, 5, x => x.type !== 'sheep');
                    const fearedSheeps = this.getMobsNearby(scene, 2, x => x.type === "sheep" && (x.parameters["stress"] | 0) > 0);
                    if (enemiesNearby.length || fearedSheeps.length) {
                        if (enemiesNearby.length) {
                            sheep.parameters["state"] = "feared";
                            sheep.parameters["stress"] = 3;
                            sheep.parameters["enemies"] = enemiesNearby;
                        }
                        else {
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
                        sheep.parameters["state"] = "wandering";
                        sheep.parameters["stress"] = 0;
                        sheep.parameters["enemies"] = [];
                    }
                    if (state === "wandering") {
                        this.moveRandomly();
                    }
                    if (!scene.isPositionBlocked(sheep.cursorPosition)) {
                        sheep.move();
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        this.runAway(scene, enemiesNearby);
                    }
                    if (sheep.parameters["state"] === "feared") {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FF000055"];
                    }
                    else if (sheep.parameters["stress"] > 1) {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
                    }
                }
            };
            exports_22("Sheep", Sheep);
        }
    };
});
System.register("world/objects/artificial", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_23, context_23) {
    var __moduleName = context_23 && context_23.id;
    var StaticGameObject_4, ObjectSkin_12, ObjectPhysics_9, vFence, hFence, beehive;
    return {
        setters: [
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            }
        ],
        execute: function () {
            exports_23("vFence", vFence = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_12.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]));
            exports_23("hFence", hFence = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_12.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]));
            exports_23("beehive", beehive = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_12.ObjectSkin(`☷`, `R`, {
                'R': ['black', 'orange'],
            }), new ObjectPhysics_9.ObjectPhysics(`.`), [0, 0]));
        }
    };
});
System.register("world/objects/natural", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_24, context_24) {
    var __moduleName = context_24 && context_24.id;
    var StaticGameObject_5, ObjectSkin_13, ObjectPhysics_10, createUnitSkin, unitPhysics, createUnitStaticObject, flower, wheat, hotspring, duck, bamboo, Tree, tree, SakuraTree, sakura;
    return {
        setters: [
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_13.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            unitPhysics = new ObjectPhysics_10.ObjectPhysics(` `);
            createUnitStaticObject = (sym, color = 'black') => new StaticGameObject_5.StaticGameObject([0, 0], createUnitSkin(sym, color), unitPhysics);
            exports_24("flower", flower = createUnitStaticObject(`❁`, 'red'));
            exports_24("wheat", wheat = createUnitStaticObject(`♈`, 'yellow'));
            exports_24("hotspring", hotspring = createUnitStaticObject(`♨`, 'lightblue'));
            exports_24("duck", duck = createUnitStaticObject(`🦆`, 'white'));
            exports_24("bamboo", bamboo = new StaticGameObject_5.StaticGameObject([0, 4], new ObjectSkin_13.ObjectSkin(`▄
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
            }), new ObjectPhysics_10.ObjectPhysics(` 
     
     
     
     
    .`, ``), [0, 0]));
            Tree = class Tree extends StaticGameObject_5.StaticGameObject {
                constructor() {
                    super([1, 3], new ObjectSkin_13.ObjectSkin(` ░ 
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
                    }), new ObjectPhysics_10.ObjectPhysics(`
    
    
 .`, ''), [2, 12]);
                }
                new() { return new Tree(); }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const o = this;
                    if (o.ticks > 300) {
                        o.ticks = 0;
                        if (o.parameters["animate"]) {
                            o.parameters["tick"] = !o.parameters["tick"];
                            o.skin.characters[0] = o.parameters["tick"] ? ` ░ ` : ` ▒ `;
                            o.skin.characters[1] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                            o.skin.characters[2] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                        }
                    }
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    //
                    const o = this;
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
                }
            };
            ;
            exports_24("tree", tree = new Tree());
            SakuraTree = class SakuraTree extends StaticGameObject_5.StaticGameObject {
                constructor() {
                    super([2, 3], new ObjectSkin_13.ObjectSkin(` ░░ 
░░░░
 ░░
  █`, ` oo 
o01o
 1S
  H`, {
                        'o': ['#c3829e', '#fcd1d7'],
                        '0': ['#fcd1d7', '#e9b1cd'],
                        '1': ['#e9b1cd', '#c3829e'],
                        'S': ['#c3829e', '#562135'],
                        'H': ['sienna', 'transparent'],
                    }), new ObjectPhysics_10.ObjectPhysics(`
    
    
 .`, ''), [2, 12]);
                }
                new() { return new SakuraTree(); }
            };
            ;
            exports_24("sakura", sakura = new SakuraTree());
        }
    };
});
System.register("world/npc/Bee", ["engine/Npc", "engine/ObjectSkin"], function (exports_25, context_25) {
    var __moduleName = context_25 && context_25.id;
    var Npc_6, ObjectSkin_14, Bee, bee;
    return {
        setters: [
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_6.Npc {
                constructor() {
                    super(new ObjectSkin_14.ObjectSkin(`🐝`, `.`, {
                        '.': ['yellow', 'transparent'],
                    }), [0, 0]);
                    this.type = "bee";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                new() {
                    return new Bee();
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const self = this;
                    self.direction = [0, 0];
                    //
                    this.moveRandomly();
                    if (!scene.isPositionBlocked(self.cursorPosition)) {
                        self.move();
                    }
                }
            };
            exports_25("bee", bee = new Bee());
        }
    };
});
System.register("world/levels/ggj2020demo/level", ["utils/misc", "world/objects", "world/levels/glitch", "world/levels/ggj2020demo/tiles", "world/items", "world/npc/Sheep", "world/objects/artificial", "world/objects/natural", "world/npc/Bee"], function (exports_26, context_26) {
    var __moduleName = context_26 && context_26.id;
    var misc_3, objects_1, glitch_1, tiles_1, items_1, Sheep_1, artificial_1, natural_1, Bee_1, levelWidth, levelHeight, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheep, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, level;
    return {
        setters: [
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (glitch_1_1) {
                glitch_1 = glitch_1_1;
            },
            function (tiles_1_1) {
                tiles_1 = tiles_1_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            },
            function (Sheep_1_1) {
                Sheep_1 = Sheep_1_1;
            },
            function (artificial_1_1) {
                artificial_1 = artificial_1_1;
            },
            function (natural_1_1) {
                natural_1 = natural_1_1;
            },
            function (Bee_1_1) {
                Bee_1 = Bee_1_1;
            }
        ],
        execute: function () {
            levelWidth = 60;
            levelHeight = 30;
            fences = [];
            if (true) {
                for (let x = 0; x < levelWidth; x++) {
                    fences.push(misc_3.clone(artificial_1.hFence, { position: [x, 0] }));
                    fences.push(misc_3.clone(artificial_1.hFence, { position: [x, levelHeight - 1] }));
                }
                for (let y = 1; y < levelHeight - 1; y++) {
                    fences.push(misc_3.clone(artificial_1.vFence, { position: [0, y] }));
                    fences.push(misc_3.clone(artificial_1.vFence, { position: [levelWidth - 20 + 9, y] }));
                }
            }
            extraFences = [
                misc_3.clone(artificial_1.vFence, { position: [28, 7] }),
                misc_3.clone(artificial_1.vFence, { position: [29, 7] }),
                misc_3.clone(artificial_1.vFence, { position: [30, 7] }),
                misc_3.clone(artificial_1.vFence, { position: [31, 7] }),
            ];
            trees = [
                { position: [7, 9] },
                { position: [27, 19] },
                { position: [5, 28] },
                { position: [34, 18] },
                { position: [47, 2] },
                { position: [11, 16] },
                { position: [12, 24] },
                { position: [17, 3] },
                { position: [23, 5] },
                { position: [27, 5] },
                { position: [33, 8] },
                { position: [37, 7] },
                { position: [42, 9] },
            ].map(x => misc_3.clone(natural_1.tree, x));
            sakuras = [
                { position: [37, 22] },
                { position: [42, 18] },
                { position: [47, 19] },
                { position: [40, 24] },
                { position: [43, 22] },
                { position: [26, 24] },
                { position: [32, 20] },
            ].map(x => misc_3.clone(natural_1.sakura, x));
            houses = [
                misc_3.clone(objects_1.house, { position: [25, 5] }),
                misc_3.clone(objects_1.house, { position: [15, 25] }),
                misc_3.clone(objects_1.house, { position: [13, 3] }),
                misc_3.clone(objects_1.house, { position: [3, 10] }),
            ];
            lamps = [
                misc_3.clone(items_1.lamp, { position: [27, 5] }),
                misc_3.clone(items_1.lamp, { position: [13, 25] }),
                misc_3.clone(items_1.lamp, { position: [15, 3] }),
                misc_3.clone(items_1.lamp, { position: [1, 10] }),
            ];
            pillars = [
                misc_3.clone(objects_1.pillar, { position: [7, 21] }),
                misc_3.clone(objects_1.pillar, { position: [20, 24] }),
                misc_3.clone(objects_1.pillar, { position: [30, 20] }),
            ];
            arcs = [
                misc_3.clone(objects_1.arc, { position: [16, 16] }),
                misc_3.clone(objects_1.arc, { position: [32, 25] }),
            ];
            shops = [
                { position: [18, 10] }
            ].map(x => misc_3.clone(objects_1.shop, x));
            ducks = [
                { position: [40, 10] },
                { position: [38, 12] },
                { position: [44, 25] },
                { position: [40, 26] },
                { position: [7, 28] },
            ].map(x => misc_3.clone(natural_1.duck, x));
            sheep = new Sheep_1.Sheep();
            sheepList = [
                { position: [44, 16] },
                { position: [48, 16] },
                { position: [43, 14] },
                { position: [46, 12] },
            ].map(x => misc_3.clone(sheep, x));
            wheats = [
                { position: [31, 4] },
                { position: [31, 5] },
                { position: [30, 3] },
                { position: [31, 3] },
                { position: [28, 2] },
                { position: [29, 2] },
                { position: [29, 3] },
                { position: [29, 5] },
                { position: [28, 6] },
            ].map(x => misc_3.clone(natural_1.wheat, x));
            flowers = [
                { position: [7, 4] },
                { position: [37, 5] },
                { position: [46, 4] },
                { position: [44, 7] },
                { position: [34, 3] },
                { position: [37, 3] },
                { position: [38, 1] },
            ].map(x => misc_3.clone(natural_1.flower, x));
            bamboos = [
                { position: [4, 17] },
                { position: [6, 19] },
                { position: [3, 22] },
                { position: [2, 27] },
                { position: [1, 15] },
            ].map(x => misc_3.clone(natural_1.bamboo, x));
            beehives = [
                { position: [34, 2] },
                { position: [36, 2] },
                { position: [34, 4] },
                { position: [36, 4] },
                { position: [38, 2] },
                { position: [38, 4] },
            ].map(x => misc_3.clone(artificial_1.beehive, x));
            bees = [
                { position: [35, 2] },
                { position: [34, 5] },
                { position: [40, 3] },
            ].map(x => misc_3.clone(Bee_1.bee, x));
            hotsprings = [
                { position: [22, 18] },
                { position: [21, 15] },
                { position: [24, 19] },
            ].map(x => misc_3.clone(natural_1.hotspring, x));
            exports_26("level", level = {
                sceneObjects: [
                    ...fences, ...extraFences,
                    ...trees, ...sakuras, ...bamboos,
                    ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                    ...flowers, ...lamps, ...wheats,
                    ...hotsprings,
                    ...ducks, ...bees, ...sheepList,
                ],
                glitches: [/*glitchyNpc,*/ misc_3.clone(glitch_1.glitch, { position: [7, 7] })],
                tiles: tiles_1.tiles,
            });
        }
    };
});
System.register("ui/playerUi", ["engine/GraphicsEngine", "engine/Cell", "main", "engine/Npc"], function (exports_27, context_27) {
    var __moduleName = context_27 && context_27.id;
    var GraphicsEngine_3, Cell_4, main_3, Npc_7, uiBackground, PlayerUi;
    return {
        setters: [
            function (GraphicsEngine_3_1) {
                GraphicsEngine_3 = GraphicsEngine_3_1;
            },
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            },
            function (main_3_1) {
                main_3 = main_3_1;
            },
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            }
        ],
        execute: function () {
            uiBackground = new Cell_4.Cell(' ', 'white', '#003');
            PlayerUi = class PlayerUi {
                constructor(npc) {
                    this.npc = npc;
                    this.objectUnderCursor = null;
                }
                draw(ctx) {
                    const uiHeight = main_3.viewHeight;
                    const uiWidth = 10;
                    const left = main_3.viewWidth - uiWidth;
                    const top = 0;
                    for (let i = 0; i < uiHeight; i++)
                        for (let j = 0; j < uiWidth; j++) {
                            GraphicsEngine_3.drawCell(ctx, uiBackground, left + j, top + i);
                        }
                    for (let i = 0; i < this.npc.maxHealth; i++) {
                        GraphicsEngine_3.drawCell(ctx, new Cell_4.Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent'), left + i, top + 0);
                    }
                    if (this.objectUnderCursor) {
                        if (this.objectUnderCursor instanceof Npc_7.Npc) {
                            GraphicsEngine_3.drawObjectAt(ctx, this.objectUnderCursor, [main_3.viewWidth - 1, 0]);
                            for (let i = 0; i < this.objectUnderCursor.maxHealth; i++) {
                                GraphicsEngine_3.drawCell(ctx, new Cell_4.Cell(`♥`, i <= this.objectUnderCursor.health ? 'red' : 'gray', 'transparent'), main_3.viewWidth - this.objectUnderCursor.maxHealth + i - 1, 0);
                            }
                        }
                    }
                }
                update(ticks, scene) {
                    this.objectUnderCursor = null;
                    for (let o of scene.objects) {
                        if (!o.enabled)
                            continue;
                        if (o instanceof Npc_7.Npc) {
                            if (o.position[0] === this.npc.cursorPosition[0]
                                && o.position[1] === this.npc.cursorPosition[1]) {
                                this.objectUnderCursor = o;
                                break;
                            }
                        }
                    }
                }
            };
            exports_27("PlayerUi", PlayerUi);
        }
    };
});
System.register("ui/glitchField", ["engine/GraphicsEngine", "engine/Cell", "main", "engine/Scene"], function (exports_28, context_28) {
    var __moduleName = context_28 && context_28.id;
    var GraphicsEngine_4, Cell_5, main_4, Scene_1, glitchFieldDefault, GlitchField;
    return {
        setters: [
            function (GraphicsEngine_4_1) {
                GraphicsEngine_4 = GraphicsEngine_4_1;
            },
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
            },
            function (main_4_1) {
                main_4 = main_4_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            }
        ],
        execute: function () {
            glitchFieldDefault = new Cell_5.Cell(' ', 'white', '#a001');
            GlitchField = class GlitchField extends Scene_1.SceneBase {
                constructor() {
                    super();
                }
                draw(ctx) {
                    for (let i = 0; i < main_4.viewHeight; i++)
                        for (let j = 0; j < main_4.viewWidth; j++)
                            GraphicsEngine_4.drawCell(ctx, glitchFieldDefault, j, i);
                    super.draw(ctx);
                }
                update(ticks) {
                    super.update(ticks);
                }
            };
            exports_28("GlitchField", GlitchField);
        }
    };
});
System.register("main", ["world/levels/ggj2020demo/level", "world/items", "engine/GameEvent", "engine/EventLoop", "engine/Scene", "engine/Cell", "engine/GraphicsEngine", "world/hero", "ui/playerUi", "engine/Npc", "utils/misc", "ui/glitchField"], function (exports_29, context_29) {
    var __moduleName = context_29 && context_29.id;
    function getActionUnderCursor() {
        const npc = hero_2.hero;
        for (let object of scene.objects) {
            if (!object.enabled)
                continue;
            //
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
    function getNpcUnderCursor(npc) {
        for (let object of scene.objects) {
            if (!object.enabled)
                continue;
            if (!(object instanceof Npc_8.Npc))
                continue;
            //
            const left = npc.cursorPosition[0];
            const top = npc.cursorPosition[1];
            //
            if (object.position[0] === left && object.position[1] === top) {
                return object;
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
                    GraphicsEngine_5.drawCell(ctx, new Cell_6.Cell(' ', 'black', '#555'), x, viewHeight - dialogHeight + y);
                else
                    GraphicsEngine_5.drawCell(ctx, new Cell_6.Cell(' ', 'white', '#333'), x, viewHeight - dialogHeight + y);
            }
        }
    }
    function onInterval() {
        game.update(ticksPerStep);
        EventLoop_3.eventLoop([game, scene, ...scene.objects, glitchField, ...glitchField.objects]);
        game.draw();
    }
    var level_1, items_2, GameEvent_3, EventLoop_3, Scene_2, Cell_6, GraphicsEngine_5, hero_2, playerUi_1, Npc_8, misc_4, glitchField_1, canvas, ctx, Game, game, viewWidth, viewHeight, leftPad, topPad, scene, heroUi, glitchField, ticksPerStep;
    return {
        setters: [
            function (level_1_1) {
                level_1 = level_1_1;
            },
            function (items_2_1) {
                items_2 = items_2_1;
            },
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (Scene_2_1) {
                Scene_2 = Scene_2_1;
            },
            function (Cell_6_1) {
                Cell_6 = Cell_6_1;
            },
            function (GraphicsEngine_5_1) {
                GraphicsEngine_5 = GraphicsEngine_5_1;
            },
            function (hero_2_1) {
                hero_2 = hero_2_1;
            },
            function (playerUi_1_1) {
                playerUi_1 = playerUi_1_1;
            },
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            },
            function (glitchField_1_1) {
                glitchField_1 = glitchField_1_1;
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
                    heroUi.draw(ctx);
                    glitchField.draw(ctx);
                    if (this.mode === "dialog") {
                        drawDialog();
                    }
                }
                update(ticks) {
                    heroUi.update(ticks, scene);
                    if (this.mode === "scene") {
                        scene.update(ticks);
                        glitchField.update(ticks);
                    }
                }
            };
            game = new Game();
            exports_29("viewWidth", viewWidth = 60);
            exports_29("viewHeight", viewHeight = 30);
            exports_29("leftPad", leftPad = (ctx.canvas.width - GraphicsEngine_5.cellStyle.size.width * viewWidth) / 2);
            exports_29("topPad", topPad = (ctx.canvas.height - GraphicsEngine_5.cellStyle.size.height * viewHeight) / 2);
            scene = new Scene_2.Scene();
            heroUi = new playerUi_1.PlayerUi(hero_2.hero);
            glitchField = new glitchField_1.GlitchField();
            scene.tiles = level_1.level.tiles;
            scene.objects = level_1.level.sceneObjects;
            glitchField.objects = level_1.level.glitches;
            scene.objects.push(hero_2.hero);
            document.addEventListener("keydown", function (ev) {
                // const raw_key = ev.key.toLowerCase();
                const key_code = ev.code;
                if (game.mode === 'scene') {
                    // onSceneInput();
                }
                else if (game.mode === 'dialog') {
                    if (key_code === "Escape") {
                        EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
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
                        hero_2.hero.direction = [0, -1];
                    }
                    else if (raw_key === 's') {
                        hero_2.hero.direction = [0, +1];
                    }
                    else if (raw_key === 'a') {
                        hero_2.hero.direction = [-1, 0];
                    }
                    else if (raw_key === 'd') {
                        hero_2.hero.direction = [+1, 0];
                    }
                    else if (raw_key === ' ') {
                        if (hero_2.hero.objectInMainHand === items_2.sword) {
                            const npc = getNpcUnderCursor(hero_2.hero);
                            if (npc) {
                                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(hero_2.hero, 'attack', {
                                    object: hero_2.hero,
                                    subject: npc
                                }));
                            }
                            return;
                        }
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
                        if (raw_key === '1') {
                            scene.weatherType = 'normal';
                        }
                        else if (raw_key === '2') {
                            scene.weatherType = 'rain';
                        }
                        else if (raw_key === '3') {
                            scene.weatherType = 'snow';
                        }
                        else if (raw_key === '4') {
                            scene.weatherType = 'rain_and_snow';
                        }
                        else if (raw_key === '5') {
                            scene.weatherType = 'mist';
                        }
                        if (oldWeatherType !== scene.weatherType) {
                            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "weather_changed", {
                                from: oldWeatherType,
                                to: scene.weatherType,
                            }));
                        }
                        // wind
                        if (raw_key === 'e') {
                            scene.isWindy = !scene.isWindy;
                            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "wind_changed", {
                                from: !scene.isWindy,
                                to: scene.isWindy,
                            }));
                        }
                        //
                        if (raw_key === 'q') {
                            scene.timePeriod = scene.timePeriod === 'day' ? 'night' : 'day';
                            //
                            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "time_changed", {
                                from: scene.timePeriod === 'day' ? 'night' : 'day',
                                to: scene.timePeriod,
                            }));
                        }
                        return; // skip
                    }
                    if (!code.shiftKey) {
                        if (!scene.isPositionBlocked(hero_2.hero.cursorPosition)) {
                            hero_2.hero.move();
                        }
                    }
                }
            });
            ticksPerStep = 33;
            // initial events
            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "weather_changed", { from: scene.weatherType, to: scene.weatherType }));
            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "wind_changed", { from: scene.isWindy, to: scene.isWindy }));
            EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "time_changed", { from: scene.timePeriod, to: scene.timePeriod }));
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window.command = new class {
                getItem(itemName) {
                    console.log('Not implemented yet');
                }
                takeItem(itemName) {
                    if (itemName === 'sword') {
                        hero_2.hero.objectInMainHand = misc_4.clone(items_2.sword);
                    }
                    else if (itemName === 'lamp') {
                        hero_2.hero.objectInMainHand = misc_4.clone(items_2.lamp);
                    }
                }
                takeItem2(itemName) {
                    if (itemName === 'lamp') {
                        hero_2.hero.objectInSecondaryHand = misc_4.clone(items_2.lamp);
                    }
                    else {
                        hero_2.hero.objectInSecondaryHand = null;
                    }
                }
            };
            canvas.addEventListener("click", ev => {
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent("system", "click", {
                    x: Math.floor((ev.clientX - leftPad) / GraphicsEngine_5.cellStyle.size.width),
                    y: Math.floor((ev.clientY - topPad) / GraphicsEngine_5.cellStyle.size.height)
                }));
            });
        }
    };
});
System.register("world/npcs", ["engine/ObjectSkin", "engine/EventLoop", "engine/GameEvent", "engine/Npc"], function (exports_30, context_30) {
    var __moduleName = context_30 && context_30.id;
    var ObjectSkin_15, EventLoop_4, GameEvent_4, Npc_9, ulan, npcs;
    return {
        setters: [
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            },
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            }
        ],
        execute: function () {
            ulan = new Npc_9.Npc(new ObjectSkin_15.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (o) => {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            exports_30("npcs", npcs = [
                ulan,
            ]);
        }
    };
});
System.register("world/levels/intro", ["world/objects", "utils/misc", "engine/EventLoop", "engine/GameEvent", "world/npcs"], function (exports_31, context_31) {
    var __moduleName = context_31 && context_31.id;
    var objects_2, misc_5, EventLoop_5, GameEvent_5, npcs_1, introLevel;
    return {
        setters: [
            function (objects_2_1) {
                objects_2 = objects_2_1;
            },
            function (misc_5_1) {
                misc_5 = misc_5_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
            },
            function (GameEvent_5_1) {
                GameEvent_5 = GameEvent_5_1;
            },
            function (npcs_1_1) {
                npcs_1 = npcs_1_1;
            }
        ],
        execute: function () {
            exports_31("introLevel", introLevel = [objects_2.house, objects_2.chest, ...objects_2.lamps, ...npcs_1.npcs]);
            // scripts
            objects_2.chest.setAction(0, 0, function () {
                EventLoop_5.emitEvent(new GameEvent_5.GameEvent(objects_2.chest, "add_object", { object: misc_5.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
//# sourceMappingURL=app.js.map