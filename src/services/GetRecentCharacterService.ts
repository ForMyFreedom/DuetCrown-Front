import axios, { AxiosResponse } from 'axios';
import { responseHandler } from '../utils';

class GetRecentCharacterService {
    static get(id: string, token: string): Promise<AxiosResponse|undefined> {
        const API_URL = import.meta.env.VITE_API_PATH
        return responseHandler(
            ()=> axios.get(`${API_URL}/character/recent/${id}`, { 
                headers: {Authorization: `Bearer ${token}`}
            }),
        )
    }
}

export default GetRecentCharacterService
