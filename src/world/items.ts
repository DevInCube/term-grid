import { Item } from "../engine/Item";
import { ObjectSkin } from "../engine/ObjectSkin";
import { ObjectPhysics } from "../engine/ObjectPhysics";

export const lamp = new Item([0, 0], 
    new ObjectSkin(`🏮`, `.`, {'.': [undefined, 'transparent']}),
    new ObjectPhysics(` `, `f`),
    [0, 0]
);

export const sword = new Item([0, 0], 
    new ObjectSkin(`🗡`, `.`, {'.': [undefined, 'transparent']}),
    new ObjectPhysics(),
    [0, 0]
);