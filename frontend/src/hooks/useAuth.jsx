import { useState, useEffect } from 'react';
import api from '../../../../frontend/src/api/client';

export default function useAuth() {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    });

    const getMe = async () => {
        try {
            const res = await api.get('/usuarios/me/');
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (error) {
            console.warn('getMe failed', error);
            setUser(null);
            localStorage.removeItem('user');
            return null;
        }
    };

    useEffect(() => {
        const access = localStorage.getItem('access');
        if (access && !user) {
            getMe();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (credentials) => {
        const res = await api.post('/usuarios/login/', credentials);
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post('/usuarios/logout/');
        } catch {
            // ignore backend logout errors
        }
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Helper functions per comprovar rols
    const isProtectora = () => user?.role === 'protectora';
    const isUsuario = () => user?.role === 'usuario';
    const isAdmin = () => user?.role === 'admin';
    const isAuthenticated = () => !!user;

    return { 
        user, 
        login, 
        logout, 
        getMe,
        isProtectora,
        isUsuario,
        isAdmin,
        isAuthenticated
    };
}