import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/registrations/";

const getAll = (params) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
        params,
    });
};

const create = (data) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const deleteReg = (id) => {
    const user = authService.getCurrentUser();
    return axios.delete(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const updateStatus = (id, status) => {
    const user = authService.getCurrentUser();
    return axios.patch(API_URL + id + "/status", { status }, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const registrationService = {
    getAll,
    create,
    deleteReg,
    updateStatus,
};

export default registrationService;
