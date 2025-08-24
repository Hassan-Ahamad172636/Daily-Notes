import apiService from "../apiService";

export const create = (data) => {
    return apiService.postApi('/schedule/create', data)
}
export const update = (id, data) => {
    return apiService.patchApi('/schedule/update/' + id, data)
}
export const get = (queryParams = "") => {
  return apiService.getApi('/schedule/get' + (queryParams ? `?${queryParams}` : ""));
};

export const remove = (id) => {
    return apiService.deleteApi('/schedule/delete/' + id)
}