import apiService from "../apiService";

export const createTransactions = (data) => {
    return apiService.postApi('/transaction/craete', data)
}

export const updateTransactions = (id, data) => {
    return apiService.patchApi('/transaction/update/' + id, data)
}

export const removeTransactions = (id) => {
    return apiService.deleteApi('/transaction/delete/' + id)
}

export const getAllTransactions = () => {
    return apiService.getApi('/transaction/getAll')
}