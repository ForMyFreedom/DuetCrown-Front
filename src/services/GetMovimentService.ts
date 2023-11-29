import axios, { AxiosResponse } from 'axios';
import { AUTH_CODE } from '../components/Navbar/Navbar';

class GetMovimentService {
    static get(): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH
        const token = localStorage.getItem(AUTH_CODE);

        return axios.get(`${API_URL}/moviment`, { 
            headers: {Authorization: `Bearer ${token}`}
        });
    }
}

export default GetMovimentService
