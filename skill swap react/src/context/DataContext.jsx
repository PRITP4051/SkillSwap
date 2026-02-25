import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers, skills as initialSkills, swapRequests as initialRequests } from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [swapRequests, setSwapRequests] = useState([]);
    const [chats, setChats] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize from localStorage or mock data
        const storedUsers = localStorage.getItem('skillswap_users');
        const storedSkills = localStorage.getItem('skillswap_skills');
        const storedRequests = localStorage.getItem('skillswap_requests');
        const storedChats = localStorage.getItem('skillswap_chats');
        const storedBookings = localStorage.getItem('skillswap_bookings');

        if (storedUsers) setUsers(JSON.parse(storedUsers));
        else {
            setUsers(initialUsers);
            localStorage.setItem('skillswap_users', JSON.stringify(initialUsers));
        }

        if (storedSkills) setSkills(JSON.parse(storedSkills));
        else {
            setSkills(initialSkills);
            localStorage.setItem('skillswap_skills', JSON.stringify(initialSkills));
        }

        if (storedRequests) setSwapRequests(JSON.parse(storedRequests));
        else {
            setSwapRequests(initialRequests);
            localStorage.setItem('skillswap_requests', JSON.stringify(initialRequests));
        }

        if (storedChats) setChats(JSON.parse(storedChats));
        else {
            setChats([]);
            localStorage.setItem('skillswap_chats', JSON.stringify([]));
        }

        if (storedBookings) setBookings(JSON.parse(storedBookings));
        else {
            setBookings([]);
            localStorage.setItem('skillswap_bookings', JSON.stringify([]));
        }

        setLoading(false);
    }, []);

    // Helpers to update state & localStorage
    const updateUser = (updatedUser) => {
        const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(newUsers);
        localStorage.setItem('skillswap_users', JSON.stringify(newUsers));
    };

    const addSkill = (newSkill) => {
        const newSkills = [...skills, newSkill];
        setSkills(newSkills);
        localStorage.setItem('skillswap_skills', JSON.stringify(newSkills));
    };

    const addSwapRequest = (request) => {
        const newRequests = [...swapRequests, request];
        setSwapRequests(newRequests);
        localStorage.setItem('skillswap_requests', JSON.stringify(newRequests));
    };

    const addMessage = (chatId, message) => {
        const existingChat = chats.find(c => c.id === chatId);
        let newChats;
        if (existingChat) {
            newChats = chats.map(c =>
                c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
            );
        } else {
            newChats = [...chats, { id: chatId, messages: [message] }];
        }
        setChats(newChats);
        localStorage.setItem('skillswap_chats', JSON.stringify(newChats));
    };

    const addBooking = (booking) => {
        const newBookings = [...bookings, booking];
        setBookings(newBookings);
        localStorage.setItem('skillswap_bookings', JSON.stringify(newBookings));
    };

    const getUserById = (id) => users.find(u => u.id === id);

    if (loading) return null;

    return (
        <DataContext.Provider value={{
            users, updateUser, getUserById,
            skills, addSkill,
            swapRequests, addSwapRequest,
            chats, addMessage,
            bookings, addBooking
        }}>
            {children}
        </DataContext.Provider>
    );
};
