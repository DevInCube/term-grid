import { Sprite } from "../../engine/SpriteLoader";

const glitchySprite_old = `width:7
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
const glitchySprite = `width:7
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
'''''''''''''''''''''`;
export const sprite = Sprite.parse(glitchySprite);
console.log(sprite.frames);