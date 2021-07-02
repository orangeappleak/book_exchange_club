import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route
} from 'react-router-dom';

import MainPage from './Components/MainPage';
import TopBooks from './Components/TopBooks';
import Profile from './Components/Profile';
import NavBar from './Components/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
          <NavBar />
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/topBooks">
            <TopBooks />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
      </Router>
    </div>
  );
}

export default App;
