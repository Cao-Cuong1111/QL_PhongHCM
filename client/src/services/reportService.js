import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/reports/";

const getSummary = () => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL + "summary", {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const reportService = {
    getSummary,
};

export default reportService;
