import axios, { AxiosResponse } from 'axios';
import { Player } from '../UserDomain';
import { responseHandler } from '../utils';

class UpdateCharacterService {
    static update(id: string, token: string, body: Player): Promise<AxiosResponse|undefined> {
        const API_URL = import.meta.env.VITE_API_PATH
        return responseHandler(
            ()=> axios.put(`${API_URL}/character/${id}`, body, {
                headers: {Authorization: `Bearer ${token}`}
            }),
            'Update successful!'
        )
    }
}


export default UpdateCharacterService
