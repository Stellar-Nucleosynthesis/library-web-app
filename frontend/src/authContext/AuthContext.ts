import {createContext} from 'react';
import type {User} from '../models/user';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setAuthData: (token: string, user: User) => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(undefined);