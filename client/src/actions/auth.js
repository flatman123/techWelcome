import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR } from './types';
import { setAuthToken } from '../utils/setAuthToken';


// Load User ( Login in User)
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    };

    try {
        const servResponse = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: servResponse.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};



// Register User
// Thunk is used to pass in parameters, while also making an api request.
export const register = ({ name, email, password }) => async dispatch => {
    // Assemble headers and body for api request
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const servResponse = await axios.post('/api/users', body, config);

        // If successfull response, payload should equal user's TOKEN
        dispatch({
            type: REGISTER_SUCCESS,
            payload: servResponse.data  
        });
    } catch (err) {
        const errors = err.response.data.errors
        console.log(err)
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        });
    };
}

