export class Skin {

    constructor(
        public mask: string = '', 
        public colors: {
        [key: string]: (string | undefined)[];
    } = {}) { }

    getRawColors() {
        let raw_colors: (string | undefined)[][][] = [];
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
}
