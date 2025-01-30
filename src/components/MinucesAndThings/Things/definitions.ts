import { CAPACITY_BUFF_LIMIT, Capacities, ExtendedSignal, Gliph, MOVIMENT_BUFF_LIMIT, Player, getGliphAfterMod, sumSignal } from "../../../UserDomain"
import { generalInverseTranslator } from "../../Attibutes/Definitions"

export const getBuffLimit = (user: Player, relativeCapacity: string): number => {
  const capacityOrigin = getCapacityOrigin(user, relativeCapacity)
  if(capacityOrigin=='peculiars'){
    return MOVIMENT_BUFF_LIMIT
  }else{
    return CAPACITY_BUFF_LIMIT
  }
}

export const getCapacityOrigin = (user: Player, relativeCapacity: string): keyof Capacities => {
  function localOperation(cap: string){
    if(Object.keys(user.capacities.peculiars).includes(cap)) {
      return 'peculiars'
    }
    if(Object.keys(user.capacities.basics).includes(cap)) {
      return 'basics'
    }
    if(Object.keys(user.capacities.specials).includes(cap)) {
      return 'specials'
    }
  }
  return localOperation(relativeCapacity) ?? localOperation(
    generalInverseTranslator(relativeCapacity)
  ) ?? 'primal'
}

export const getGliphFromCapacityName = (user: Player, relativeCapacity: string|undefined, withMods: boolean = false): Gliph|undefined => {
  if(!relativeCapacity) { return undefined }
  let extraSignal: ExtendedSignal = ''
  if(withMods){
    const mods = user.currentMods
      .filter(mod => mod.kind == 'capacity')
      .filter(mod => mod.keywords[0] == relativeCapacity || mod.keywords[0] == generalInverseTranslator(relativeCapacity))
    extraSignal = mods.map(mod => mod.value).reduce(sumSignal, '')
  }
  const gliph = getGliph(user, relativeCapacity) || getGliph(user, generalInverseTranslator(relativeCapacity))
  if(!gliph) { return undefined }
  return getGliphAfterMod(gliph, extraSignal, getBuffLimit(user, relativeCapacity))
}

function getGliph(user: Player, relativeCapacity: string): Gliph|undefined {
  if(Object.keys(user.capacities.peculiars).includes(relativeCapacity)) {
    return user.capacities.peculiars[relativeCapacity]
  }
  if(Object.keys(user.capacities['basics']).includes(relativeCapacity)) {
    return user.capacities['basics'][relativeCapacity as keyof Capacities['basics']]
  }
  if(Object.keys(user.capacities['specials']).includes(relativeCapacity)) {
    return user.capacities['specials'][relativeCapacity as keyof Capacities['specials']]
  }
  if(relativeCapacity=='primal' || relativeCapacity=='peculiar') {
    return undefined
  }
}
  