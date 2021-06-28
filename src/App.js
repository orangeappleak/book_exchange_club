import './App.css';
import {useState,useEffect} from 'react';

// components
import UserAccount from './components/UserAccount';
import LoginPage from './components/LoginPage';
import TopCategories from './components/TopCategories';

import {noUser} from './components/UserAccount';


import{
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    var userLoggedIn = JSON.parse(localStorage.getItem('loggedInUserData'));
    console.log(loggedIn);
    if(userLoggedIn === null){
      <Redirect to="/" />
      setLoggedIn(false);
    }
    else{
      console.log(loggedIn);
      setLoggedIn(true);
      <Redirect to="/profile" />
    }

  },[loggedIn]);
  
  return (
    <div id="all">

      <LoadingCurtain />
      <Router>
        <Route exact path="/">
           <LoginPage />
        </Route>
        <Route exact strict path="/profile">
          <UserAccount />
        </Route>
        <Route exact path="/topCategories">
          <TopCategories />
        </Route>
      </Router>

    </div>
  );
}

function UserLoggedIn(){
  return (
    <Switch>
      <Route path="/">
        <LoginPage />
      </Route>
      <Route path='/profile'>
        <UserAccount />
      </Route>
    </Switch>
  )
}

export function LoadingCurtain(){
  return (
    <div id="loading-curtain" class="">
      <img className="ignore" src="https://media2.giphy.com/media/xT77Y1T0zY1gR5qe5O/200.gif" alt="" />
    </div>
  )
}

export default App;
