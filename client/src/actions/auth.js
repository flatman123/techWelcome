import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_FAIL, REGISTER_SUCCESS, REGUSTER_FAIL } from './types';

// Register User
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const servResponse = await axios.post('/api/users', body, config);

        // If successfull response, payload should equal user's TOKEN
        dispatch({
            type: REGISTER_SUCCESS,
            payload: servResponse.data  
        })
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL
        });
    };
}

