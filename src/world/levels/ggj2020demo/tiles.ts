import { Cell } from "../../../engine/Cell";

export const tiles = parseTiles(`gggggggGGggggggGGggGgggggggGGgggg ggggggggGGgg ggG
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
gg   gGG    gggg                 gg  g g g gssssssg
g   gg     gGGgggggg gg gggg      gGGg ggsssssswwws
   g gg     ggGGgGGg  gg g  g g     ggGGgwwwwwwwwww
ggsss      gGGgg ggg    sss sssbBbssswwwwwWWWWWWWWw
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
});


function parseTiles(str: string, colors: { [key: string]: string }): (Cell | null)[][] {
    let common: { [key: string]: Cell } = {};
    return str
        .split('\n')
        .map(mapLine);

    function mapLine(line: string) {
        return line
            .split('')
            .map(mapCell);
    }

    function mapCell(s: string) {
        return s === ' ' ? null : createCell(s);
    }

    function createCell(s: string) {
        return common[s]
            ? common[s]
            : (common[s] = new Cell(' ', 'transparent', colors[s]));
    }
}