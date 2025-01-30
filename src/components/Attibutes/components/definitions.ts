import { Gliph, GliphConst } from "../../../UserDomain"
import primalAudioPath from '../../../assets/sounds/primal.mp3'
import rollAudioPath from '../../../assets/sounds/roll.mp3'

const primalAudio = new Audio(primalAudioPath);
const rollAudio = new Audio(rollAudioPath);

export const PRIMAL_ODD = 1

export type PrimalInterference = 'hope'|'despair'
export const PRIMAL_MESSAGE: {[_ in PrimalInterference]: string[]} = {
  'hope': ['Interferência Primal', 'Esperança Irrestrita'],
  'despair': ['Interferência Primal', 'Desespero Irrestrito']
}

export type RollResult = 'Failure'|'Sucess'|'TotalSucess'

export enum ResultAmountOfCrowns {
  Failure = 0,
  Sucess = 1,
  TotalSucess = 2
}

export const ResultTextOptions: {[result in RollResult]: string} = {
  Failure: 'Fracasso',
  Sucess: 'Sucesso Parcial',
  TotalSucess: 'Sucesso Total'
}


export const LevelMeaning: {[glyph in Gliph]: string} = {
  'FF-': 'Abaixo de um Humano',
  'FF': 'Nível Humano',
  'FF+': 'Acima de um Humano',
  'F-': 'Abaixo de um Guerreiro',
  'F': 'Nível Guerreiro',
  'F+': 'Acima de um Guerreiro',
  'E-': 'Abaixo de um Abençoado',
  'E': 'Nível Abençoado',
  'E+': 'Acima de um Abençoado',
  'D-': 'Abaixo de um Quarto Deus',
  'D': 'Nível Quarto Deus',
  'D+': 'Acima de um Quarto Deus',
  'C-': 'Abaixo de um Santo',
  'C': 'Nível Santo',
  'C+': 'Acima de um Santo',
  'B-': 'Abaixo de um Papa',
  'B': 'Nível Papa',
  'B+': 'Acima de um Papa',
  'A-': 'Abaixo de um Semi-Deus',
  'A': 'Nível Semi-Deus',
  'A+': 'Acima de um Semi-Deus',
  'S-': 'Abaixo de um Deus',
  'S': 'Nível Deus',
  'S+': 'Acima de um Deus',
  'SS-': 'Abaixo de um Grande Deus',
  'SS': 'Nível Grande Deus',
  'SS+': 'Acima de um Grande Deus',
}


export function rollValueAgaintChallenge(value: Gliph, challenge: Gliph, rollCount: number, extraAdvantage: number, setExtraResult: (v: string)=> void, setCifraResult: (v: string)=> void, setTextResult: (v: string)=>void, setRollCount: (v: number)=>void) {
  setExtraResult('0')
  setRollCount(rollCount+1)
  const primalInterference = sortPrimalInterference()
  if(primalInterference) {
    setTextResult(PRIMAL_MESSAGE[primalInterference][1])
    setCifraResult(PRIMAL_MESSAGE[primalInterference][0])
    primalAudio.play();
    return
  }
  const difOfLevels = getDifOfLevels(value, challenge)
  const vantageCoeficient = getVantage(value) - getVantage(challenge) + extraAdvantage
  const [crowns, unluck] = applyLevelDif(
      applyVantage(
          addRandomCifra(vantageCoeficient), vantageCoeficient
      ), difOfLevels
  )

  console.log('final:', crowns.concat(unluck))

  let amountOfCrowns = crowns.filter(v=>v=='👑').length
  const amountOfNegativeCrowns = crowns.filter(v=>v=='.').length
  if(amountOfCrowns>2){
      setExtraResult(String(amountOfCrowns-2))
      amountOfCrowns = 2 
  }
  if(amountOfNegativeCrowns>0){
      setExtraResult(String(-amountOfNegativeCrowns))
  }

  const printResult = (crowns.filter(v=>v=='👑') as string[]).concat(unluck)
  setCifraResult(printResult.join(''))
  setTextResult(ResultTextOptions[ResultAmountOfCrowns[amountOfCrowns] as RollResult])
  rollAudio.play()
}

function sortPrimalInterference(): PrimalInterference|undefined {
  const d100 = rollD100();
  if(d100<=PRIMAL_ODD) { return 'despair' }
  if(d100>100-PRIMAL_ODD) {return 'hope'}
}

function removeSignals(glyph: Gliph): Gliph {
  return glyph.replace('+', '').replace('-', '') as Gliph
}

function getDifOfLevels(firstGlyph: Gliph, secondGlyph: Gliph): number {
  firstGlyph = removeSignals(firstGlyph)
  secondGlyph = removeSignals(secondGlyph)
  const firstIndex = GliphConst.indexOf(firstGlyph)
  const secondIndex = GliphConst.indexOf(secondGlyph)
  const difOfLevels = firstIndex-secondIndex
  return Math.floor(difOfLevels/3)
}


function getVantage(glyph: Gliph): number {
  if(glyph.includes('+')) {
      return 1
  } else if (glyph.includes('-')) {
      return -1
  }
  return 0
}

function addRandomCifra(vantageCoeficient: number): string[] {
  const cifras: string[] = []
  for(let i=0; i < 2 + Math.abs(vantageCoeficient); i++) {
      const currentCifra = Math.random() >= 0.5 ? '👑' : '⚜️'
      cifras.push(currentCifra)
  }
  console.log('rolled: ', cifras)
  return cifras
}

function applyVantage(cifras: string[], vantageCoeficient: number): string[] {
  if(vantageCoeficient > 0) {
      cifras = cifras.sort((a, b) => b.localeCompare(a))
  } else if (vantageCoeficient < 0) {
      cifras = cifras.sort((a, b) => a.localeCompare(b))
  }
  console.log('vantage: ', cifras.slice(0, 2))
  return cifras.slice(0, 2)
}

function applyLevelDif(cifras: string[], difOfLevels: number): [string[], string[]] {
  const crowns: string[] = cifras.filter(v => v == '👑')
  const unlucks: string[] = cifras.filter(v => v == '⚜️')

  for(let i=0 ; i<Math.abs(difOfLevels) ; i++) {
      if (difOfLevels>0) {
          crowns.push('👑')
      } else {
          const index = crowns.indexOf('👑')
          if (index !== -1) {
              crowns.splice(index, 1);
          } else {
              crowns.push('.')
              unlucks.push('⚜️')
          }
      }
  }

  console.log('level dif: ', cifras)
  return [crowns, unlucks]
}

function rollD100(){
  return Math.floor(Math.random()*100)+1
}
