import React,{useEffect,useState} from 'react';
import firebase from 'firebase';
import {
    useHistory,
} from 'react-router-dom';

import { ui } from '../firebase';

import './stylesheets/NavBar.css';

import {db} from '../firebase';

import store from '../store';

export default function NavBar(){

    
    let history = useHistory();
    
    var [userDetails, updateUserDetails] = useState({});
    var [loggedIn, updateLogInStatus] = useState(false);
    
    useEffect(() => {
        try{
            var profile_data = localStorage.getItem('profile-data');
            if(profile_data === null){
                updateLogInStatus(false)
            }
            else{
                updateUserDetails(JSON.parse(profile_data));
                addUserFirestore(JSON.parse(profile_data));
                updateLogInStatus(true);
            }

            ui.start('#firebase-login', {
                callbacks: {
                    signInSuccessWithAuthResult: function(authResult, redirectUrl){
                        localStorage.setItem("profile-data",JSON.stringify(authResult.additionalUserInfo.profile));
                        updateLogInStatus(true);
                        store.dispatch({type: 'LOGGED_IN'})
                        return false;
                    },
                },
                signInFlow: 'popup',
                signInOptions: [{
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                        prompt: 'select_account'
                    }

                }
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
                    <h1>Explore</h1>
                    {loggedIn ? <ProfileData updateLogOutStatus = {updateLogInStatus} userDetails = {userDetails}/> : <div id="sign-in">
                        {/* <h1 onClick={() => moveTo('/profile')}>Sign In</h1> */}
                        <div id="firebase-login"></div>
                    </div>}
                  
                </div>
            </div>
        </div>
    )
    function ProfileData({userDetails,updateLogOutStatus}){
        return(
            <div onMouseEnter = {profileDropDown} onMouseLeave = {profileDropDownExit} id="profile">
                <img src={userDetails.picture} alt="cant show"/>
                <div id="profile-dropdown">
                    <h1 id="profile-name">{userDetails.name}</h1>
                    <h1 onClick = {() => moveTo('/profile')}>Profile</h1>
                    <h1 onClick = {() => ProfileLogOut({updateLogOutStatus})}>Log Out</h1>
                </div>
            </div>
        )
    }

    function ProfileLogOut({updateLogOutStatus}){
        localStorage.clear();
        updateLogOutStatus(false);
        store.dispatch({type : "LOGGED_OUT"});
        moveTo('/');
    }
}


function profileDropDown(){
    var ele = document.querySelector('#profile-dropdown');
    ele.classList.add('show');
}

function profileDropDownExit(){
    var ele = document.querySelector('#profile-dropdown');
    ele.classList.remove('show');
}



function addUserFirestore(data){

    var users = db.collection("users");

    users.doc(data.name).get().then((d) => {
        if(typeof d.data() === 'undefined') {
            console.log("user does not exist add the user dumas")
            users.doc(data.name).set({
                userName: data.name,
                userEmail: data.email,
                profileImage: data.picture,
                coverImage: "https://www.crushpixel.com/big-static15/preview4/abstract-yellow-triangle-dicorate-pattern-1831790.jpg",
                bookLists: [],
                likedBooks: [],
                wantToRead: [],
                ownedBooks: []
            });
        }
    });
}

