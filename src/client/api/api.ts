import axios from "axios";

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const login = (username: string, password: string) => {
    return api.post('/login', {username, password});
}

export const register = (username: string, password: string) => {
    return api.post('/register', { username, password });
};

export const uploadFile = (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getFiles = (token: string) => {
    return api.get('/files', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getFileDetail = (fileId: string, token: string) => {
    return api.get(`/files/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
  
export const deleteFile = (fileId: string, token: string) => {
    return api.delete(`/files/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
  
export const renameFile = (fileId: string, newName: string, token: string) => {
    return api.put(`/files/${fileId}`, { name: newName }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
  
export const shareFile = (fileId: string, userId: string, token: string) => {
    return api.post(`/files/${fileId}/share`, { userId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};