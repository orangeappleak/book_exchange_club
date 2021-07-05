import React,{useEffect,useState} from 'react';
import firebase from 'firebase';
import {
    Link,
    BrowserRouter as Router,
    Redirect,
    useHistory
} from 'react-router-dom';

import { ui } from '../firebase';

import './stylesheets/NavBar.css';
import { auth } from 'firebaseui';

export default function NavBar(){

    let history = useHistory();

    var [userDetails, updateUserDetails] = useState({});
    var [loggedIn, updateLogInStatus] = useState(false);

    useEffect(() => {
        console.log(loggedIn);
        try{
            var profile_data = localStorage.getItem('profile-data');
            console.log("profile-data",profile_data);

            if(profile_data === null){
                updateLogInStatus(false)
            }
            else{
                updateUserDetails(JSON.parse(profile_data));
                updateLogInStatus(true);
            }

            ui.start('#firebase-login', {
                callbacks: {
                    signInSuccessWithAuthResult: function(authResult, redirectUrl){
                        localStorage.setItem("profile-data",JSON.stringify(authResult.additionalUserInfo.profile));
                        updateLogInStatus(true);
                        return false;
                    },
                },
                signInFlow: 'popup',
                signInSuccessUrl : '/',
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                ],
            });
        }
        catch(Error){}

    }, [loggedIn]);
    
    


    function moveTo(path){
        history.replace(path);
    }

    return(
        <div id="nav-bar-wrapper">
            <div id="nav-bar">
                <h1 id="logo">BEC</h1>
                <div id="nav-links">
                    <h1 onClick = {() => moveTo('/')}>Home</h1>
                    <h1 onClick ={() => moveTo('/topCategories')}>Top Books</h1>

                    {loggedIn ? <ProfileData updateLogOutStatus = {updateLogInStatus} userDetails = {userDetails}/> : <div id="sign-in">
                        {/* <h1 onClick={() => moveTo('/profile')}>Sign In</h1> */}
                        <div id="firebase-login"></div>
                    </div>}
                  
                </div>
            </div>
        </div>
    )
}

function ProfileData({userDetails,updateLogOutStatus}){
    console.log("user",userDetails);
    return(
        <div onMouseEnter = {profileDropDown} onMouseLeave = {profileDropDownExit} id="profile">
            <img src={userDetails.picture} />
            <div id="profile-dropdown">
                <h1 id="profile-name">{userDetails.name}</h1>
                <h1>Profile</h1>
                <h1 onClick = {() => {
                    profileLogOut(updateLogOutStatus);
                }}>Log Out</h1>
            </div>
        </div>
    )
}

function profileDropDown(){
    var ele = document.querySelector('#profile-dropdown');
    ele.classList.add('show');
}

function profileDropDownExit(){
    var ele = document.querySelector('#profile-dropdown');
    ele.classList.remove('show');
}

function profileLogOut(logOutStatus){
    localStorage.clear();
    logOutStatus(false)
}

