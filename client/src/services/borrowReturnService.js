import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/borrow/";

const getAllBorrows = (params) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
        params,
    });
};

const borrowBook = (data) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL + "borrow", data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const returnBook = (id, data) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL + "return/" + id, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const borrowReturnService = {
    getAllBorrows,
    borrowBook,
    returnBook,
};

export default borrowReturnService;
