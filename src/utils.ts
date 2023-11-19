import { AxiosResponse } from "axios";
import { toast } from 'react-toastify';

export function isEqualArray<T>(array1: T[], array2: T[]):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function isEqualObject<T>(array1: T, array2: T):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
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