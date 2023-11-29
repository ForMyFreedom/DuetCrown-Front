import { AxiosResponse } from "axios";
import { Moviment, Player, StringRelation } from "./UserDomain";
import { toast } from 'react-toastify';

export function isEqualArray<T>(array1: T[], array2: T[]):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function isEqualObject<T>(array1: T, array2: T):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function changeOrderInArray<T>(isUp: boolean, index: number, setItens: React.Dispatch<React.SetStateAction<T[]>>) {
    setItens(prevItens => {
      const directional = getDirectional(isUp, index, prevItens.length)
      if(directional == 0){ return prevItens }

      const newItens = [...prevItens];
      const aux = newItens[index+directional];
      newItens[index+directional] = newItens[index];
      newItens[index] = aux;
      return newItens;
    });
}


export function someMinuceOrThingHasThisName(player: Player, name: string) {
  for(const item of player.things){
    if(item.name == name){ return true; }
  }
  for(const item of player.minucies){
    if(item.name == name) { return true; }
  }
  return false;
}

export function changeOrderInStringRelation(isUp: boolean, index: number, itens: StringRelation, setItens: React.Dispatch<React.SetStateAction<StringRelation>>) {
    setItens(prevItens => {
      const directional = getDirectional(isUp, index, Object.keys(itens).length)
      if(directional == 0){ return prevItens }

      const newItens = {...prevItens};
      const entries = Object.entries(newItens);
      const aux = entries[index+directional];
      entries[index+directional] = entries[index];
      entries[index] = aux;
      return Object.fromEntries(entries);
    });
}

export function changeOrderOfMoviments(isUp: boolean, index: number, setMoviments: React.Dispatch<React.SetStateAction<Moviment[]>>) {
  setMoviments(prevMoviments => {
    const directional = getDirectional(isUp, index, prevMoviments.length)
    if(directional == 0){ return prevMoviments }

    const newItens = [...prevMoviments];
    let i = directional
    while(newItens[index+i] != undefined && newItens[index+i].relativeCapacity != newItens[index].relativeCapacity){
      i+=directional
    }
    if(newItens[index+i] == undefined){ return prevMoviments }

    const aux = newItens[index+i];
    if(aux.relativeCapacity!=newItens[index].relativeCapacity){
      return prevMoviments;
    }
    newItens[index+i] = newItens[index];
    newItens[index] = aux;
    return newItens;
  });
}


export async function responseHandler(request: ()=>Promise<AxiosResponse>, sucessMessage?: string): Promise<AxiosResponse|undefined> {
  try{
    const response = await request()
    if(sucessMessage){
      toast.success(sucessMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    return response
  }catch(e){
    treatAuthExpire(e)
  }
}


export function allCapacitiesNames(user: Player): string[] {
  const capacitiesNames: string[] = []
  for(const [capName, capacity] of Object.entries(user.capacities)){
    if(capName!='primal') [
      capacitiesNames.push(...Object.keys(capacity))
    ]
  }
  return capacitiesNames
}

function getDirectional(isUp: boolean, index: number, length: number): number {
  let directional: number = 0

  if(isUp && index > 0){
    directional = -1;
  }
    
  if(!isUp && index < length-1){
    directional = 1;
  }

  return directional
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function treatAuthExpire(e: any) {
  if(e.response.status === 401){
    toast.error('Seu Token expirou...\n Baixe o backup, deslogue, logue, e envie o backup', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  } else {
    toast.error('Update failed!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }
}