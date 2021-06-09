import './stylesheets/MainPage.css';
import firebase from 'firebase/app';
import ui from './firebase';

import {useEffect,useState} from 'react';

function App() {
  
  const [loggedin, updateLogin] = useState(false);
  const [profile, updateProfile] = useState({
    profile_name: "",
  });

  useEffect(() => {
    console.log(loggedin);
  },[loggedin])

  return (
    <div className="main-page">
      <div className = "animate" id="login-page">
        <div id="main-image">
          <img alt=" " src="https://images.unsplash.com/photo-1601469090980-fc95e8d95544?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE4fHxib29rc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
        </div>
        <div id="login-section">
          <h1>Hello There.</h1>
          
          <p>Welcome to a new way of reading and trading books, Welcome to the<span id="imp"> Book Exchange Club.</span> </p>

          {loggedin ? animatePage() : < LoginPanel updateLogin = {updateLogin} updateProfile = {updateProfile}/>}
        </div>
      </div>
    </div>
  );
}


function animatePage(){
  var animate = document.getElementsByClassName("animate");
  [...animate].forEach(ele => {
    ele.classList.add("loginSuccess")
  });
}

function LoginPanel({updateLogin,updateProfile}){
  return(
    <div id="login-panel">
      {ui.start("#login-panel",{
        callbacks: {
          signInSuccessWithAuthResult(authuser, redirecturl){
            updateLogin(true)
            updateProfile({profile_name: authuser.additionalUserInfo.profile.name})
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
    </div>
  )
}

export default App;
