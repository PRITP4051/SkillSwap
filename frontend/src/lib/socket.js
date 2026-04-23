import { io } from 'socket.io-client';

let socket = null;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  }

  return window.location.origin;
};

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('skillswap_token');
    socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
