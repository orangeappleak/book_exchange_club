import React,{useEffect,useState} from 'react';
import {
    useHistory,
} from 'react-router-dom';

import { ui } from '../firebase';

import './stylesheets/NavBar.css';

import {db} from '../firebase';
import firebase from 'firebase';

import store from '../store';

import { getFirebaseBookData } from './UserAccount';

export default function NavBar(){

    
    let history = useHistory();

    var [initState,updateInitState] = useState(true);
    
    var [userDetails, updateUserDetails] = useState({});
    var [loggedIn, updateLogInStatus] = useState(false);
    var [bookData,updateBooksData] = useState({})
    
    useEffect(() => {
        try{

            var profile_data = localStorage.getItem('profile-data');
            if(profile_data != null){
                var profile_name = JSON.parse(profile_data).name;
                updateUserDetails(JSON.parse(profile_data));
                addUserFirestore(JSON.parse(profile_data));
                updateLogInStatus(true);
                getFirebaseBookData(profile_name);
                
            }

            let client_width = document.body.clientWidth;

            if(client_width>400 && client_width<600){
                ui.start('#firebase-login-mobile', {
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
                })
            }
            else {
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
            })}

            }
        catch(Error){
        }
    }, [loggedIn,initState]);
    

    function moveTo(path){
        try{
            document.getElementById('mobile-nav-bar').classList.remove('show');
        }catch(Error){}
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
                        <div id="firebase-login"></div>
                    </div>}
                  
                </div>
            </div>

            <div id="mobile-nav-bar-wrapper">
                <div id="menu-info">
                    <img height="30px" onClick ={() => {
                        document.getElementById('mobile-nav-bar').classList.add("show");
                    }} src="https://img.icons8.com/fluent/96/000000/menu--v2.png"/>
                    <h1 style={{
                        color: 'white',
                        fontFamily: 'BTM',
                        fontSize: '20px',
                        letterSpacing: '1.5px',
                    }}>Bec</h1>
                </div>
                <div id="mobile-nav-bar">
                    <h1 style={{
                        fontSize: '40px',
                        fontFamily: 'BTM',
                        letterSpacing: '5px',
                    }}>Menu</h1>
                    <div id="nav-links">
                        <h1 onClick = {() => moveTo('/')}>Home</h1>
                        <h1 onClick ={() => moveTo('/topCategories')}>Top Books</h1>
                        <h1>Explore</h1>
                        {loggedIn ? <ProfileData mobile={true} updateLogOutStatus = {updateLogInStatus} userDetails = {userDetails}/> : <div id="sign-in">
                            <div id="firebase-login-mobile"></div>
                        </div>}
                    </div>
                    <div id="close-menu">
                    <h1 onClick ={() => {
                        document.getElementById('mobile-nav-bar').classList.remove("show");
                        }}>close</h1>
                    </div>
            </div>
        
            </div>
        </div>
    )





    function ProfileData({userDetails,updateLogOutStatus,mobile}){

        if(mobile){
            return(
                <div onMouseEnter = {profileDropDown} onMouseLeave = {profileDropDownExit} id="profile">
                    <img onClick ={() => moveTo('/profile')} src={userDetails.picture} alt="cant show"/>
                    <h1 style={{
                        border: '2px solid white',
                        padding: ' 10px 20px',
                        fontSize: '18px',
                        color: 'black',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        margin: '25px',
                    }} id='log-out' onClick = {() => ProfileLogOut({updateLogOutStatus})}>Log Out</h1>
                </div>
            )
        }
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
            users.doc(data.name).collection('booksList').doc('wantedToRead').set({data: 'data'});
            users.doc(data.name).collection('booksList').doc('ownedBooks').set({data: 'data'});
            users.doc(data.name).collection('booksList').doc('readBooks').set({data: 'data'});
            users.doc(data.name).collection('booksList').doc('rentedBooks').set({data: 'data'});

            users.doc(data.name).collection('booksList').doc('wantedToRead').collection('book_data').doc("init_book").set({initData: 'init'});
            users.doc(data.name).collection('booksList').doc('ownedBooks')
            users.doc(data.name).collection('booksList').doc('readBooks')
            users.doc(data.name).collection('booksList').doc('rentedBooks')

            users.doc(data.name).set({
                userName: data.name,
                userEmail: data.email,
                profileImage: data.picture,
                coverImage: "https://www.crushpixel.com/big-static15/preview4/abstract-yellow-triangle-dicorate-pattern-1831790.jpg",
            });
        }
    });
}

