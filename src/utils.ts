import { AxiosResponse } from "axios";
import { StringRelation } from "./UserDomain";
import { toast } from 'react-toastify';

export function isEqualArray<T>(array1: T[], array2: T[]):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function isEqualObject<T>(array1: T, array2: T):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function changeOrderInArray<T>(isUp: boolean, index: number, setItens: React.Dispatch<React.SetStateAction<T[]>>) {
    setItens(prevItens => {
      let directional: number = 0

      if(isUp && index > 0){
        directional = -1;
      }
        
      if(!isUp && index < prevItens.length-1){
        directional = 1;
      }
        
      if(directional == 0){ return prevItens }

      const newItens = [...prevItens];
      const aux = newItens[index+directional];
      newItens[index+directional] = newItens[index];
      newItens[index] = aux;
      return newItens;
    });
}

export function changeOrderInStringRelation(isUp: boolean, index: number, itens: StringRelation, setItens: React.Dispatch<React.SetStateAction<StringRelation>>) {
    let directional: number = 0
    
    if(isUp && index > 0){
      directional = -1;
    }
  
    if(!isUp && index < Object.keys(itens).length-1){
      directional = 1;
    }
  
    if(directional == 0){ return }
  
    setItens(prevItens => {
      const newItens = {...prevItens};
      const entries = Object.entries(newItens);
      const aux = entries[index+directional];
      entries[index+directional] = entries[index];
      entries[index] = aux;
      return Object.fromEntries(entries);
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