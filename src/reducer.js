const initState = {
    logInStatus: '',
}

export default (state = initState,action) => {
    switch (action.type){
        case 'LOGGED_IN':
            localStorage.setItem('logInStatus',true);
            return {"logInStatus" : "true"}
        case 'LOGGED_OUT':
            localStorage.setItem('logInStatus',false);
            return {"logInStatus": "false"}
        default:
            return state;
    }
}