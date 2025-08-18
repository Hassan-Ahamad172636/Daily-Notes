import apiService from "../apiService";

export const createTransactions = (data) => {
    return apiService.postApi('/transaction/craete', data)
}

export const getAllTransactions = () => {
    return apiService.getApi('/transaction/getAll')
}