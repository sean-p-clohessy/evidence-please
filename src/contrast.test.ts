import { describe, expect, it } from 'vitest'
import { corePalette } from './data/palette'

const luminance=(hex:string)=>{
  const channels=[1,3,5].map(index=>parseInt(hex.slice(index,index+2),16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4)
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722
}
const contrast=(foreground:string,background:string)=>{
  const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a)
  return (values[0]+.05)/(values[1]+.05)
}

describe('core colour contrast',()=>{
  it.each([
    ['main text',corePalette.text,'#0c100d'],
    ['muted text',corePalette.muted,'#0c100d'],
    ['accent text',corePalette.green2,'#151a16'],
    ['gold text',corePalette.gold,'#151a16'],
    ['paper text',corePalette.ink,corePalette.paper],
    ['red on paper',corePalette.red,corePalette.paper]
  ])('%s meets WCAG AA contrast for normal text',(_,foreground,background)=>{
    expect(foreground).toMatch(/^#[0-9a-f]{6}$/i)
    expect(contrast(foreground,background)).toBeGreaterThanOrEqual(4.5)
  })
})
