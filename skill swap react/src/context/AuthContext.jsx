import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem('skillswap_auth');
        if (storedUserId) {
            setCurrentUser(storedUserId);
        }
        setLoading(false);
    }, []);

    const login = (userId) => {
        localStorage.setItem('skillswap_auth', userId);
        setCurrentUser(userId);
    };

    const logout = () => {
        localStorage.removeItem('skillswap_auth');
        setCurrentUser(null);
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
