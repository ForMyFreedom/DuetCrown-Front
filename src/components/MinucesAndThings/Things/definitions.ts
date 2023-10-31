import { Capacities, Gliph, Player } from "../../../UserDomain"
import { generalInverseTranslator } from "../../Attibutes/Definitions"

export const getGliphFromCapacityName = (user: Player, relativeCapacity: string|undefined): Gliph|undefined => {
  if(!relativeCapacity) { return undefined }
  const notTranslated = getGliph(user, relativeCapacity)
  if(notTranslated) { return notTranslated }
  const translated = getGliph(user, generalInverseTranslator(relativeCapacity))
  return translated
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
  