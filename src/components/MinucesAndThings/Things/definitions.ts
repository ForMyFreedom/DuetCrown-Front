import { Capacities, Gliph, Player } from "../../../UserDomain"

export const getGliphFromCapacityName = (user: Player, relativeCapacity: string|undefined): Gliph|undefined => {
    if(!relativeCapacity) { return undefined }
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
  