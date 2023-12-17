import axios, { AxiosResponse } from 'axios';
import { responseHandler } from '../utils';

class DestroyConnectionService {
    static destroy(token: string): Promise<AxiosResponse|undefined> {
        const API_URL = import.meta.env.VITE_API_PATH
        return responseHandler(
            ()=> axios.delete(`${API_URL}/destroy-connection`, {
                headers: {Authorization: `Bearer ${token}`}
            })
        )
    }
}


export default DestroyConnectionService
