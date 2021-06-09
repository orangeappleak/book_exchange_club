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
      <div id="login-page">
        <div id="main-image">
          <img alt=" " src="https://images.unsplash.com/photo-1601469090980-fc95e8d95544?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE4fHxib29rc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
        </div>
        <div id="login-section">
          <h1>Hello There.</h1>
          
          <p>Welcome to a new way of reading and trading books, Welcome to the<span id="imp"> Book Exchange Club.</span> </p>
          {loggedin ?<p>Logged in as: <span id="imp">{profile.profile_name}</span></p> :<div id="login-panel">
            {ui.start('#login-panel',{
              callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl){
                  updateLogin(true);
                  updateProfile({
                    profile_name: authResult.additionalUserInfo.profile.name
                  });
                  return false;
                }
              },
              signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
              ],
              signInFlow: 'popup'
            })}
          </div> }
        </div>
      </div>
    </div>
  );
}

export default App;
