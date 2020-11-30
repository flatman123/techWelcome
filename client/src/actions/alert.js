import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';


export const setAlert = (msg, alertType, timeOut = 3000) => (dispatch, getState) => {
    const id = uuid();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => {
        return dispatch({ type: REMOVE_ALERT, payload: id })
    }, timeOut)
};


// export function setAlert() {
//     return function(dispatch) {
//         const id = uuid();
//         return dispatch({
    //     type: SET_ALERT,
    //     payload: { msg: aalertType, id }
    // });
//     }
// }
