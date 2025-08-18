import apiService from "../apiService";

export const addNamaz = (data) => {
    return apiService.patchApi('/namaz/add', data);
}

export const getNamazHistory = () => {
    return apiService.getApi('/namaz/get-history');
}

export const getTodayNamaz = () => {
    return apiService.getApi('/namaz/get-today');
}