import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/broadcasts/";

const getAll = () => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const create = (formData) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
    });
};

const toggle = (id) => {
    const user = authService.getCurrentUser();
    return axios.patch(API_URL + id + "/toggle", {}, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const remove = (id) => {
    const user = authService.getCurrentUser();
    return axios.delete(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const broadcastService = {
    getAll,
    create,
    toggle,
    remove,
};

export default broadcastService;
