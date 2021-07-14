import './App.css';
import './Components/stylesheets/mobile.css';
import React,{ Suspense, lazy} from 'react';

import store from './store';
import {Provider} from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './firebase';


import UserAccount from  './Components/UserAccount';

const MainPage = lazy(() => import('./Components/MainPage'));
const TopCategories = lazy(() => import('./Components/TopBooks'));
const NavBar = lazy(() => import('./Components/NavBar'));

function App() {
  return (
    <div className="App">

      <Provider store = {store}>
      <Router>
        <Suspense fallback={<LoaderPage />}>

          <LoaderPage />
          <NavBar />
          <Switch>

            <Route exact path="/">
              <MainPage />
            </Route>
            <Route path="/topCategories">
              <TopCategories />
            </Route>
            <Route exact path="/profile">
              <UserAccount />
            </Route>
          </Switch>
        </Suspense>
      </Router>


      <CustomAlert alert_data = "heelor world"/>
      </Provider>

    </div>
  );
}

export function LoaderPage(){

  return(
    <div id="loading-page">
      <div id="gif-wrapper">
        <img alt="cant load data" src="https://i.pinimg.com/originals/ce/0c/4d/ce0c4db42ba14cb241f60862fcb2d773.gif" />
      </div>
    </div>
  )
}

function CustomAlert({alert_data}){

  return <div id="custom-alert-wrapper">
    <div id="custom-alert">
      <h1></h1>
    </div>
  </div>
}

export function customAlert(alert_data){
  let alert_ = document.querySelector('#custom-alert');
  alert_.classList.add('alert');
  alert_.innerHTML = alert_data;
  setTimeout(() => {
   alert_.classList.remove('alert')
   alert_.innerHTML = "";
  }, 5000);
}

export default App;
