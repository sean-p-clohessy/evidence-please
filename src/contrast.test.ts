import { describe, expect, it } from 'vitest'
import { paletteIds, palettes } from './data/palette'

const luminance=(hex:string)=>{
  const channels=[1,3,5].map(index=>parseInt(hex.slice(index,index+2),16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4)
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722
}
const contrast=(foreground:string,background:string)=>{
  const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a)
  return (values[0]+.05)/(values[1]+.05)
}

describe('palette colour contrast',()=>{
  it.each(paletteIds)('%s meets WCAG AA contrast across core text pairings',id=>{
    const colours=palettes[id].colours
    for(const [foreground,background] of [[colours.text,colours.appBg],[colours.muted,colours.appBg],[colours.green2,colours.surface],[colours.gold,colours.surface],[colours.ink,colours.paper],[colours.red,colours.paper]]){
      expect(foreground).toMatch(/^#[0-9a-f]{6}$/i)
      expect(contrast(foreground,background)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
