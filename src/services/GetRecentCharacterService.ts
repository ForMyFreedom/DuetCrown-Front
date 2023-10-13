import axios, { AxiosResponse } from 'axios';

class GetRecentCharacterService {
    static get(id: string, token: string): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH

        return axios.get(`${API_URL}/character/recent/${id}`, { 
            headers: {Authorization: `Bearer ${token}`}
        });
    }
}

export default GetRecentCharacterService
