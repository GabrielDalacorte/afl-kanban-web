import { getToken } from './storage';

export const configBackendConnection = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    headersDefault: {
        'Content-Type': 'application/json',
    },
};
const ApiIndex = "api/v1";

export const endpoints = {
    loginToken: `${ApiIndex}/rest-auth/login/`,
    boardsAPI: `${ApiIndex}/boards/`,
    columnsAPI: `${ApiIndex}/columns/`,
    cardsAPI: `${ApiIndex}/cards/`,
};
    
export const getAuthHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    } as { [key: string]: string };
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
}