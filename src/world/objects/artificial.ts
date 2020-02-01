import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { ObjectPhysics } from "../../engine/ObjectPhysics";

export const vFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);

export const hFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);

export const beehive = new StaticGameObject([0, 0],
    new ObjectSkin(`☷`, `R`, {
        'R': ['black', 'orange'],
    }),
    new ObjectPhysics(`.`), [0, 0]);
