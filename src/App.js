import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useParams,
  useRouteMatch
} from 'react-router-dom';

import MainPage from './Components/MainPage';
import TopCategories from './Components/TopBooks';
import Profile from './Components/Profile';
import NavBar from './Components/NavBar';

function App() {


  return (
    <div className="App">
      <Router>
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
