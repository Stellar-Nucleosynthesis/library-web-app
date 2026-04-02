import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {User} from '@/models/user.ts';
import {authApi} from '@/service/authService.ts';
import {AuthContext} from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setAuthData = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('lrc_token', newToken);
        localStorage.setItem('lrc_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const clearAuth = useCallback(() => {
        localStorage.removeItem('lrc_token');
        localStorage.removeItem('lrc_user');
        setToken(null);
        setUser(null);
    }, []);

    const logout = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    const login = useCallback(
        async (email: string, password: string) => {
            const response = await authApi.login(email, password);

            if (response.success && response.token && response.user) {
                setAuthData(response.token, response.user);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        },
        [setAuthData]
    );

    useEffect(() => {
        let cancelled = false;

        const initAuth = async () => {
            const storedToken = localStorage.getItem('lrc_token');
            const storedUser = localStorage.getItem('lrc_user');

            if (!storedToken || !storedUser) {
                if (!cancelled) setIsLoading(false);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser) as User;

                if (!cancelled) {
                    setToken(storedToken);
                    setUser(parsedUser);
                }

                const res = await authApi.getMe(storedToken);

                if (cancelled) return;

                if (res.success && res.user) {
                    setUser(res.user);
                    localStorage.setItem('lrc_user', JSON.stringify(res.user));
                } else {
                    clearAuth();
                }
            } catch {
                if (!cancelled) {
                    clearAuth();
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        const timerId = globalThis.setTimeout(() => {
            void initAuth();
        }, 0);

        return () => {
            cancelled = true;
            globalThis.clearTimeout(timerId);
        };
    }, [clearAuth]);

    const isAdmin = user?.role === 'admin';

    const value = useMemo(
        () => ({
            user,
            token,
            isLoading,
            isAdmin,
            login,
            logout,
            setAuthData,
        }),
        [user, token, isLoading, isAdmin, login, logout, setAuthData]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
