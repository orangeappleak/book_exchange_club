import React from 'react';
import store from '../store';
import {updateUserData, userLoggedIn} from '../actions';
import * as actions from '../constants/actionType';

import { useState,useEffect } from 'react';

import firebase from 'firebase/app';
import ui from '../firebase';

import './component_styles/LoginPage.css';

import {
    Redirect
} from "react-router-dom";


function LoginPage(){
    const [profile, updateProfile] = useState({
      profile_info: "",
      loggedIn: false,
    });

    useEffect(() => {
      //if(document.getElementById('loading-curtain').classList != null) document.getElementById('loading-curtain').classList.remove('move-in');
      {ui.start("#login-panel",{
        callbacks: {
          signInSuccessWithAuthResult(authuser){
            updateProfile({
              profile_info: authuser.additionalUserInfo.profile,
              loggedIn: true,
              })
            return false
          }
        },
        signInOptions: [
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
          }
        ],
        signInFlow: 'popup'
      })}
    }, []);

    return (
      <div className="main-page">
        <div className = "animate" id="login-page">
          <div id="main-image">
            <img alt=" " src="https://images.unsplash.com/photo-1601469090980-fc95e8d95544?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE4fHxib29rc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
          </div>
          <div id="login-section">
            <h1>Hello There.</h1>
            
            <p>Welcome to a new way of reading and trading books, Welcome to the<span id="imp"> Book Exchange Club.</span> </p>
  
            {profile.loggedIn ?  <LoginSucces profile={profile}/> : <LoginPanel />}
          </div>
        </div>
      </div>
    );
  }

  function LoginSucces({profile}){
    localStorage.setItem('loggedInUserData',JSON.stringify(profile))
    document.getElementById("loading-curtain").classList.add('move-in');
    return <Redirect to="/profile" />
  }

  
  function LoginPanel(){
    return(
      <div id="login-panel">
        {/* This is where the firebase ui resides */}
      </div>
    )
  }

export default LoginPage;