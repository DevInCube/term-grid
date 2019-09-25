export class ObjectSkin {

    characters: string[] = [];
    raw_colors: (string | undefined)[][][] = [];

    constructor(
        public charactersMask: string = '',
        public colorsMask: string = '', 
        public colors: {
        [key: string]: (string | undefined)[];
    } = {}) {

        this.raw_colors = this.getRawColors();
        this.characters = charactersMask.split('\n');
        // console.log(charactersMask, this.characters);
    }

    private getRawColors() {
        let raw_colors: (string | undefined)[][][] = [];
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
}
