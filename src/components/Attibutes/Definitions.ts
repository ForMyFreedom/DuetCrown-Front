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

export function generalTranslator(capactity: string): string {
  if(capactity=='combined') { return 'Combinados'}
  return TRANSLATE_SOME_CAPACITY['basics'](capactity) ?? TRANSLATE_SOME_CAPACITY['specials'](capactity) ?? TRANSLATE_SOME_CAPACITY['peculiars'](capactity)
}