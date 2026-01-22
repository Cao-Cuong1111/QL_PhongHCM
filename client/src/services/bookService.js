import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api/books/";

const getAllBooks = (params) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
        params,
    });
};

const getBook = (id) => {
    const user = authService.getCurrentUser();
    return axios.get(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const createBook = (data) => {
    const user = authService.getCurrentUser();
    return axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const updateBook = (id, data) => {
    const user = authService.getCurrentUser();
    return axios.put(API_URL + id, data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const deleteBook = (id) => {
    const user = authService.getCurrentUser();
    return axios.delete(API_URL + id, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
};

const bookService = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};

export default bookService;
