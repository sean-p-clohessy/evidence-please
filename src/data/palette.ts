export const corePalette={
  ink:'#111611',screen:'#17211c',screen2:'#202923',line:'#839083',paper:'#f0e7d1',paper2:'#ded0ad',
  green:'#426f50',green2:'#9bc6a0',red:'#a63e37',gold:'#dfbc70',text:'#f4ecd8',muted:'#c5cabd'
} as const

export const paletteVariables=Object.fromEntries(Object.entries(corePalette).map(([name,value])=>[`--${name}`,value]))
