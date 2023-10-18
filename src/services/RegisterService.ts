import axios, { AxiosResponse } from 'axios';

const headers = {
    'Content-Type': 'application/json'
};

export type RegisterForm = {
    name: string,
    nickname: string,
    primaryColor: string
    password: string
    repeatPassword: string
    image: string
    registerToken: string
}

class RegisterService {
    static register(body: RegisterForm): Promise<AxiosResponse> {
        const API_URL = import.meta.env.VITE_API_PATH

        return axios.post(`${API_URL}/register`, body, { headers });
    }
}

export default RegisterService
