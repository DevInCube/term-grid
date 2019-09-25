export class ObjectPhysics {

    public collisions: (string)[];
    public lights: (string)[];

    constructor(
        collisionsMask: string = '', 
        lightMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
    }
}