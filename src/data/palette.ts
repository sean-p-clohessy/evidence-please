export type PaletteId='archive'|'midnight'|'plum'

export const palettes={
  archive:{name:'Original',description:'Institutional green and aged paper',colours:{ink:'#111611',screen:'#17211c',screen2:'#202923',line:'#839083',paper:'#f0e7d1',paper2:'#ded0ad',green:'#426f50',green2:'#9bc6a0',red:'#a63e37',gold:'#dfbc70',text:'#f4ecd8',muted:'#c5cabd',appBg:'#0c100d',surface:'#151a16',surface2:'#252b26',selected:'#33483a',glow:'#334035'}},
  midnight:{name:'Midnight',description:'Deep navy with cool cyan accents',colours:{ink:'#101827',screen:'#14243a',screen2:'#1d304a',line:'#91a7bd',paper:'#f2eee5',paper2:'#d8e0e8',green:'#326b83',green2:'#8bd3e6',red:'#94304f',gold:'#f1c875',text:'#f7f2e8',muted:'#c7d3df',appBg:'#090f1a',surface:'#111d2e',surface2:'#1b2a40',selected:'#284b63',glow:'#315e7d'}},
  plum:{name:'Plum',description:'Warm aubergine and rosewood',colours:{ink:'#1c1320',screen:'#2b1f31',screen2:'#392940',line:'#aa9aac',paper:'#f4e9e0',paper2:'#dfc9d1',green:'#704466',green2:'#d6a6cf',red:'#943246',gold:'#e6c27a',text:'#f8ede8',muted:'#d5c8d7',appBg:'#160f18',surface:'#241927',surface2:'#322338',selected:'#573753',glow:'#704461'}}
} as const

export const paletteIds=Object.keys(palettes) as PaletteId[]
export const paletteVariables=(id:PaletteId)=>Object.fromEntries(Object.entries(palettes[id].colours).map(([name,value])=>[`--${name}`,value]))
