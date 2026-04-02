import axios from './axios';
import type {User} from "../models/user";
import type {AuthResponse} from "../models/auth";

export const authApi = {
    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<AuthResponse> => {
        const res = await axios.post('/api/auth/register', data);
        return res.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await axios.post('/api/auth/login', {email, password});
        return res.data;
    },

    verifyEmail: async (token: string): Promise<AuthResponse> => {
        const res = await axios.get(`/api/auth/verify-email?token=${token}`);
        return res.data;
    },

    getMe: async (token: string): Promise<{ success: boolean; user?: User }> => {
        const res = await axios.get('/api/auth/me', {
            headers: {Authorization: `Bearer ${token}`},
        });
        return res.data;
    },

    resendVerification: async (email: string): Promise<AuthResponse> => {
        const res = await axios.post('/api/auth/resend-verification', {email});
        return res.data;
    },
};
