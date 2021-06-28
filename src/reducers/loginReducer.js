import {
    LOGIN,
    LOGOUT
} from '../constants/actionType';

import * as actions from '../constants/actionType';


export default (state = [], action) => {
    switch (action.type){
        case actions.LOGIN:
           return [{
            userData: action.payload.userData,
            loggedIn: action.payload.loggedIn,
        }]
        case LOGOUT: 
            console.log("user logged out the state is = ",state);
        default:
            return state;
    }
};