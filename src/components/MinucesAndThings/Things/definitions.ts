import { Capacities, ExtendedSignal, Gliph, Player, getGliphAfterMod, sumSignal } from "../../../UserDomain"
import { generalInverseTranslator } from "../../Attibutes/Definitions"

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
  return getGliphAfterMod(gliph, extraSignal)
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
  