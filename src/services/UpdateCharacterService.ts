import axios, { AxiosResponse } from 'axios';
import { Player } from '../UserDomain';

class UpdateCharacterService {
    static update(id: string, token: string, body: Player): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH

        return axios.put(`${API_URL}/character/${id}`, body, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }
}

export default UpdateCharacterService
