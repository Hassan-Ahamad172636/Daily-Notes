import apiService from "../apiService"

export const signUP = async (data) => {
    return await apiService.postApi('/user/create', data)
}

export const login = async (data) => {
    return await apiService.postApi('/user/login', data)
}