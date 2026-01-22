import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/activity-plans/";

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

const exportDocx = (params) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL + "export", {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
        params,
        responseType: 'blob',
    });
};

const activityPlanService = {
    getAll,
    create,
    update,
    remove,
    exportDocx,
};

export default activityPlanService;
