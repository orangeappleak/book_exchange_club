import * as actions from './constants/actionType';


export const updateUserData = (userData,loginStatus) => ({
    type: actions.LOGIN,
    payload: {
        userData: userData,
        loggedIn: loginStatus
    }
})