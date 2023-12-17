import axios, { AxiosResponse } from 'axios';
import { responseHandler } from '../utils';

class VerifyConnectionsService {
    static verify(token: string): Promise<AxiosResponse|undefined> {
        const API_URL = import.meta.env.VITE_API_PATH
        return responseHandler(
            ()=> axios.get(`${API_URL}/verify-connections`, {
                headers: {Authorization: `Bearer ${token}`}
            })
        )
    }
}


export default VerifyConnectionsService
