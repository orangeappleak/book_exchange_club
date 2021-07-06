import './App.css';
import React,{ Suspense, lazy} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

const MainPage = lazy(() => import('./Components/MainPage'));
const TopCategories = lazy(() => import('./Components/TopBooks'));
const Profile = lazy(() => import('./Components/Profile'));
const NavBar = lazy(() => import('./Components/NavBar'));

function App() {


  return (
    <div className="App">
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
              <Profile />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export function LoaderPage(){
  return(
    <div id="loading-page">
      <div id="gif-wrapper">
        <img src="https://media4.giphy.com/media/PZVbGp9cCbDJS/giphy.gif" />
      </div>
    </div>
  )
}

export default App;
