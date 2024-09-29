import { Capacities } from "../../UserDomain"

export const TRANSLATE_KIND_ATRIBUTE: {[T in keyof Capacities]: string} = {
    basics: "Básicas",
    specials: "Especiais",
    peculiars: "Peculiar",
    primal: "Primal"
}

export const TRANSLATE_SOME_CAPACITY: {[T in keyof Capacities]: (key: string) => string} = {
    basics: (key: string) => TRANSLATE_BASIC_ATRIBUTE[key as keyof Capacities['basics']],
    specials: (key: string) => TRANSLATE_SPECIAL[key as keyof Capacities['specials']],
    peculiars: (key: string) => key,
    primal: () => "Primal"
}

export const TRANSLATE_BASIC_ATRIBUTE: {[T in keyof Capacities['basics']]: string} = {
    strength: 'Força',
    agility: 'Agilidade',
    body: 'Corpo',
    mind: 'Mente',
    senses: 'Sentidos',
    charisma: 'Carisma',
}

export const TRANSLATE_SPECIAL: {[T in keyof Capacities['specials']]: string} = {
    ambition: 'Ambição',
    judge: 'Juízo',
    wish: 'Desejo',
    will: 'Vontade',
}

const StaticNaming = {
    combined: 'Combinados/Primal',
    commum: 'Comum',
}

export function generalTranslator(capacity: string): string {
  if(Object.keys(StaticNaming).includes(capacity)) {
    return StaticNaming[capacity as keyof typeof StaticNaming]
  }
  return TRANSLATE_SOME_CAPACITY['basics'](capacity) ?? TRANSLATE_SOME_CAPACITY['specials'](capacity) ?? TRANSLATE_SOME_CAPACITY['peculiars'](capacity)
}

export function generalInverseTranslator(capacity: string): string {
    if(Object.values(StaticNaming).includes(capacity)) {
        return Object.entries(StaticNaming).find(([, value]) => value==capacity)![0]
    }
    const byBasics = Object.entries(TRANSLATE_BASIC_ATRIBUTE).find(([, value]) => value==capacity)
    if(byBasics) { return byBasics[0] }
    const bySpecials = Object.entries(TRANSLATE_SPECIAL).find(([, value]) => value==capacity)
    if(bySpecials) { return bySpecials[0] }
    return capacity
}