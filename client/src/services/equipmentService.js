import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/equipment/";

const getAll = (params) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
        params,
    });
};

const getOne = (id) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const create = (data) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const update = (id, data) => {
    const user = authService.getCurrentUser();
    return axios.put(API_URL + id, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const remove = (id) => {
    const user = authService.getCurrentUser();
    return axios.delete(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const equipmentService = {
    getAll,
    getOne,
    create,
    update,
    remove,
};

export default equipmentService;
