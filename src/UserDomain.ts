export type Signal = '+' | '-' | ''
export type HigherSignals = '++' | '+++' | '+🌎' | '+🌎+' | '+🌎++' | '+🌎+++' | '+🌎🌎'
export type LowerSignals = '--' | '---' | '-🌎' | '-🌎-' | '-🌎--' | '-🌎---' | '-🌎🌎'
export type ExtendedSignal = Signal | HigherSignals | LowerSignals
export type Letter = 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'FF'
export type Gliph = `${Letter}${Signal}`

export const GliphConst: Gliph[] = ['FF-', 'FF', 'FF+', 'F-', 'F', 'F+', 'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S-', 'S', 'S+', 'SS-', 'SS', 'SS+']
export const SignalsConst: ExtendedSignal[] = ['-🌎🌎', '-🌎---', '-🌎--', '-🌎-', '-🌎', '---', '--', '-', '', '+', '++', '+++', '+🌎', '+🌎+', '+🌎++', '+🌎+++', '+🌎🌎']


export type Capacities = {
  basics: {
    strength: Gliph
    agility: Gliph
    body: Gliph
    mind: Gliph
    senses: Gliph
    charisma: Gliph
  }
  specials: {
    ambition: Gliph
    judge: Gliph
    wish: Gliph
    will: Gliph
  }
  peculiars: { [name: string]: Gliph }
  primal: {
    kind: 'Hope' | 'Despair'
    value: number // percentage
  }
}

export type Stat = {
  kind: 'VIT' | 'DMG' | 'DEF' | 'ATK'
  naturalMod: ExtendedSignal
  relativeCapacity: string
  actual?: number // percentage
}

export type Evolutions = {
  physical: number // percentage
  espiritual: number // percentage
}

export type Extension = {
  name: string
  kind: string
  progress: number // percentage
  value: Gliph | Signal
}

export type Moviment = {
  kind: 'Peculiar' | 'Combined'
  relativeCapacity: string
  agregated: ExtendedSignal
  name: string
  description: string
  codes?: { key: string; props: object }[]
}

export type Thing = {
  name: string
  description: string
  relativeCapacity?: string
  gliph?: Gliph
}

export type Minucie = {
  // Desing: NAME [EXTRANAME?]: DESCRIPTION
  name: string
  extraName?: string
  description: string
}

export type ImagePlayerData = {
  url: string,
  xDesloc: number
  yDesloc: number
  scale: number
}


export type StringRelation = {[key: string]: string}

export type Player = {
  id: number
  name: string
  nickname: string
  primaryColor: string
  image: ImagePlayerData,
  identity: StringRelation
  sumary: StringRelation
  capacities: Capacities
  stats: Stat[]
  toShowStats: {[kind in Stat['kind']]?: string[] } // string[] -> capacityName[]
  evolutions: Evolutions
  extensions: Extension[]
  moviments: Moviment[]
  things: Thing[]
  minucies: Minucie[]
  anotations: string
}

export function isGliphInConformity(personalGliph: Gliph, otherGliph: Gliph): boolean {
  return GliphConst.indexOf(personalGliph) <= GliphConst.indexOf(otherGliph)
}

export function isGliphInRegularity(personalGliph: Gliph|undefined, otherGliph: Gliph|undefined): string {
  if(!personalGliph || !otherGliph) { return '' }
  const glifDif = GliphConst.indexOf(personalGliph) - GliphConst.indexOf(otherGliph)
  if(glifDif>=3){
    return 'Desperdiçado sobre Minhas Mãos'
  }
  if(glifDif<=-3) {
    return 'Instável sobre Minhas Mãos'
  }
  return ''
}

export function getGliphAfterMod(gliph: Gliph|undefined, mod: ExtendedSignal) {
  if(!gliph) { return GliphConst[0] }
  const middleIndex= SignalsConst.indexOf('')
  const modIndex = SignalsConst.indexOf(mod)
  const dif = modIndex-middleIndex
  const gliphFinalDif = GliphConst.indexOf(gliph)+dif
  if(gliphFinalDif<0){
    return GliphConst[0]
  }
  if(gliphFinalDif>=GliphConst.length){
    return GliphConst[GliphConst.length-1]
  }
  return GliphConst[gliphFinalDif]
}

export function subtractGliphs(firstGliph: Gliph, secondGliph: Gliph): ExtendedSignal {
  const meanIndex = SignalsConst.indexOf('')
  const dif = GliphConst.indexOf(firstGliph) - GliphConst.indexOf(secondGliph) + meanIndex
  if(dif<0){
    return SignalsConst[0]
  }
  if(dif>=GliphConst.length){
    return SignalsConst[SignalsConst.length-1]
  }
  return SignalsConst[dif]
}

export function solveDMG(vitGliph: Gliph, dmgGliph: Gliph): number {
  const vitIndex = GliphConst.indexOf(vitGliph)
  const dmgIndex = GliphConst.indexOf(dmgGliph)
  const dif = dmgIndex-vitIndex
  let percen = 25

  if (dif > 0) {
    percen *= 2 ** Math.floor(dif / 3);
    percen *= 1 + ((dif % 3) / 3);
  } else {
    percen /= 2 ** Math.floor(-dif / 3);
    percen *= 1 + ((dif % 3) / 6);
  }

  percen = (percen>100) ? 100 : percen

  return Math.floor(percen)
}

export function modifySignal(signal: ExtendedSignal, mod: number): ExtendedSignal {
  const signalIndex= SignalsConst.indexOf(signal)
  const finalIndex = signalIndex+mod

  if(finalIndex<0){
    return SignalsConst[0]
  }

   if(finalIndex>=SignalsConst.length){
    return SignalsConst[SignalsConst.length-1]
  }
  return SignalsConst[finalIndex]
}

export function getMeanOfGliphs(gliphArray: Gliph[]): Gliph {
  if(gliphArray.length==0) { return GliphConst[0] }
  const indexArray = gliphArray.map(gliph => GliphConst.indexOf(gliph))
  const meanIndex = Math.floor(indexArray.reduce((a, b) => a + b, 0) / indexArray.length)
  return GliphConst[meanIndex]
}