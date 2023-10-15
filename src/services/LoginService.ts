import axios, { AxiosResponse } from 'axios';

const headers = {
    'Content-Type': 'application/json'
};

class LoginService {
    static login(name: string, password: string): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH

        const data = { name: name, password: password };

        return axios.post(`${API_URL}/login`, data, { headers });
    }
}

export default LoginService
