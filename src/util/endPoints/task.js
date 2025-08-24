import apiService from "../apiService"

export const create = (data) => {
    return apiService.postApi('/task/create', data)
}
export const update = (id, data) => {
    return apiService.patchApi('/task/update/' + id, data)
}
export const get = () => {
    return apiService.getApi('/task/get')
}
export const remove = (id) => {
    return apiService.deleteApi('/task/delete/' + id)
}

export const isCompleted = (id) => {
    return apiService.patchApi('/task/isCompleted/' + id)
}