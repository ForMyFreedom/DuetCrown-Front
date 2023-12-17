import axios, { AxiosResponse } from 'axios';

class GetBlankCharacterService {
    static get(): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH
        return axios.get(`${API_URL}/blankChar`);
    }
}

export default GetBlankCharacterService
