import axios from 'axios';
import e from 'express';

export const setAuthToken = token => {
    if (localStorage.token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

