export type Signal = '+' | '-' | ''
export type HigherSignals = '++' | '+++' | '+🌎' | '+🌎+' | '+🌎++' | '+🌎+++' | '+🌎🌎'
export type LowerSignals = '--' | '---' | '-🌎' | '-🌎-' | '-🌎--' | '-🌎---' | '-🌎🌎'
export type ExtendedSignal = Signal | HigherSignals | LowerSignals
export type Letter = 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'FF'
export type Gliph = `${Letter}${Signal}`

export const GliphConst: Gliph[] = ['FF-', 'FF', 'FF+', 'F-', 'F', 'F+', 'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S-', 'S', 'S+', 'SS-', 'SS', 'SS+']
export const SignalsConst: ExtendedSignal[] = ['-🌎🌎', '-🌎---', '-🌎--', '-🌎-', '-🌎', '---', '--', '-', '', '+', '++', '+++', '+🌎', '+🌎+', '+🌎++', '+🌎+++', '+🌎🌎']
export const MeanSignalIndex = SignalsConst.indexOf('')
export const StatConst: Stat['kind'][] = ['VIT', 'DMG', 'DEF', 'ATK']

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
    value: number|null // percentage
  }
}

export type ProgessInCapacities = {
  [T in keyof Omit<Capacities,'primal'>]: {
    [key in keyof Capacities[T]]: {
      evo: number,
      glyph: Gliph
    }
  };
};

export type CommumMoviment = Pick<Moviment, 'name'|'description'>

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
  kind: 'Peculiar' | 'Combined' | 'Commum'
  relativeCapacity: string
  agregated: ExtendedSignal
  name: string
  description: string
  codes?: { key: string; props: object }[]
}

export type Thing = {
  name: string
  imageUrl: string
  description: string
  relativeCapacity?: string
  gliph: Gliph | ''
  applicated: boolean
  modifications?: Modification[]
}

export type Minucie = {
  name: string
  imageUrl: string
  relative?: string
  description: string
  applicated: boolean
  modifications?: Modification[]
}

export type ImagePlayerData = {
  url: string,
  xDesloc: number
  yDesloc: number
  scale: number
}


/* // @ Consider using this
type BaseModification = {
  value: ExtendedSignal
  origin: string
}

type CapacityModification = BaseModification & {
  kind: 'capacity'
  keywords: {
    name: string
  }
}

type StatModification = BaseModification & {
  kind: 'stat'
  keywords: {
    relativeCapacity: string
    kind: string
  }
}

export type Modification = CapacityModification | StatModification
*/

export type Modification = {
  kind: 'capacity' | 'stat'
  value: ExtendedSignal
  origin: string // thing or minucie name
  keywords: string[] // In case of capacity, is ['name']... In case of stat, is ['relativeCapacity', 'kind']
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
  progress: ProgessInCapacities
  stats: Stat[]
  toShowStats: {[kind in Stat['kind']]?: string[] } // string[] -> capacityName[]
  evolutions: Evolutions
  extensions: Extension[]
  moviments: Moviment[]
  things: Thing[]
  minucies: Minucie[]
  anotations: string
  currentMods: Modification[]
  /*
  vantage: {
    capacities: {
      [CapGrop in keyof Omit<Partial<Capacities>, 'primal'>]: {
        [Cap in keyof Partial<Capacities[CapGrop]>]: number
      }
    }
    stats: (Omit<Stat, 'naturalMod'> & {value: number})[]
  }
  */
}

export function isGliphInConformity(personalGliph: Gliph, otherGliph: Gliph): boolean {
  return GliphConst.indexOf(personalGliph) <= GliphConst.indexOf(otherGliph)
}

export function isGliphInRegularity(personalGliph: Gliph|''|undefined, otherGliph: Gliph|undefined): string {
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


export function solveDMG(vitGliph: Gliph, modGliph: Gliph): number {
  const vitIndex = GliphConst.indexOf(vitGliph)
  const dmgIndex = GliphConst.indexOf(modGliph)
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

export function getSignalWithAmount(amount: number, symbol: '+'|'-'): ExtendedSignal {
  const middleIndex = SignalsConst.indexOf('')
  const offset = (symbol == '+') ? amount : - amount
  const finalIndex = middleIndex + offset
  if(finalIndex<0){
    return SignalsConst[0]
  }
  if(finalIndex>=SignalsConst.length){
    return SignalsConst[SignalsConst.length-1]
  }
  return SignalsConst[finalIndex]
}

export function sumSignal(signal1: ExtendedSignal, signal2: ExtendedSignal): ExtendedSignal {
  return operateSignal(signal1, signal2, 1)
}

export function subSignal(signal1: ExtendedSignal, signal2: ExtendedSignal): ExtendedSignal {
  return operateSignal(signal1, signal2, -1)
}

function operateSignal(signal1: ExtendedSignal, signal2: ExtendedSignal, operate: 1|-1): ExtendedSignal {
  const meanIndex = SignalsConst.indexOf('')
  const signal1Index = SignalsConst.indexOf(signal1) - meanIndex
  const signal2Index = SignalsConst.indexOf(signal2) - meanIndex
  const finalIndex = meanIndex + signal1Index + operate * signal2Index
  if(finalIndex<0){
    return SignalsConst[0]
  }
  if(finalIndex>=SignalsConst.length){
    return SignalsConst[SignalsConst.length-1]
  }
  return SignalsConst[finalIndex]
}

export function inverseSignal(signal: ExtendedSignal): ExtendedSignal {
  const meanIndex = SignalsConst.indexOf('')
  const signalIndex = SignalsConst.indexOf(signal) - meanIndex
  const finalIndex = meanIndex - signalIndex
  if(finalIndex<0){
    return SignalsConst[0]
  }
  if(finalIndex>=SignalsConst.length){
    return SignalsConst[SignalsConst.length-1]
  }
  return SignalsConst[finalIndex]
}



export function calculateLevelOfPlayer(player: Player): Gliph {
  const basicLevelMean = Object.entries(player.capacities.basics)
    .map(([, gliph]) => GliphConst.indexOf(gliph))
    .reduce((a, b) => a + b, 0)
    / Object.keys(player.capacities.basics).length

  const amountOfPeculiar = Object.keys(player.capacities.peculiars).length
  let peculiarLevelMean: number
  if(amountOfPeculiar>0){
    peculiarLevelMean = Object.entries(player.capacities.peculiars)
    .map(([, gliph]) => GliphConst.indexOf(gliph))
    .reduce((a, b) => a + b, 0)
    * ((2+amountOfPeculiar)/(4*amountOfPeculiar))
  } else {
    peculiarLevelMean = 0
  }

  const specialLevelMean = deggregation(
    Object.entries(player.capacities.specials)
      .map(([, gliph]) => aggregation(GliphConst.indexOf(gliph)))
      .reduce((a, b) => a + b, 0)
  )

  const levelMean = Math.round((basicLevelMean + peculiarLevelMean + specialLevelMean)/3)
  if (levelMean<0) { return GliphConst[0] }
  if (levelMean>=GliphConst.length) { return GliphConst[GliphConst.length-1] }
  return GliphConst[levelMean]
}


function aggregation(y: number): number {
  if(y<=4) { return (y-1)/3 }
  const c = 3/Math.log(2)
  return Math.E**((y-4)/c)
}

function deggregation(x: number): number {
  if(x<=1) { return 3*x+1}
  return 3*Math.log2(x)+4
}

/*
export function setBonusInRelative(user: Player, bonus: ExtendedSignal|undefined, relative: string|undefined) {
  if(!bonus || !relative) { return }
  changeBonusInRelative(true, user, bonus, relative)
}


export function unsetBonusInRelative(user: Player, bonus: ExtendedSignal|undefined, relative: string|undefined) {
  if(!bonus || !relative) { return }
  const middleIndex= SignalsConst.indexOf('')
  const bonusIndex = SignalsConst.indexOf(bonus)
  const invertedBonus = 2*middleIndex - bonusIndex
  changeBonusInRelative(false, user, SignalsConst[invertedBonus], relative)
}


function changeBonusInRelative(toSet: boolean, user: Player, bonus: ExtendedSignal, relative: string) {
  if(Object.keys(user.capacities.peculiars).includes(relative)) {
    if(toSet){
      const gliph = user.capacities.peculiars[relative]
      user.bonus.capacities.peculiars[relative] = getGliphAfterMod(gliph,bonus)
    } else {

    }
  }
  if(Object.keys(user.capacities['basics']).includes(relative)) {
    if(toSet){
      const gliph = user.capacities.basics[relative]
      user.bonus.capacities.basics[relative] = getGliphAfterMod(gliph,bonus)
    } else {
      
    }
  }
  if(Object.keys(user.capacities['specials']).includes(relative)) {
    if(toSet){
      const gliph = user.capacities.specials[relative]
      user.bonus.capacities.specials[relative as keyof Player['bonus']['capacities']['specials']] = getGliphAfterMod(gliph,bonus)
    } else {
      
    }
  }
}
*/