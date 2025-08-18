// src/services/apiService.js

import axiosInstance from "../util/axiosInstance";

const apiService = {
  getApi: async (endpoint, params = {}) => {
    const response = await axiosInstance.get(endpoint, { params });
    return response.data;
  },

  postApi: async (endpoint, data = {}) => {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  },

  putApi: async (endpoint, data = {}) => {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  },

  patchApi: async (endpoint, data = {}) => {
    const response = await axiosInstance.patch(endpoint, data);
    return response.data;
  },

  deleteApi: async (endpoint, params = {}) => {
    const response = await axiosInstance.delete(endpoint, { params });
    return response.data;
  },
};

export default apiService;
