import React from 'react';
import {
    Link,
    BrowserRouter as Router,
    Redirect,
    useHistory
} from 'react-router-dom';


import './stylesheets/NavBar.css';

export default function NavBar(){

    let history = useHistory();


    function moveTo(path){
        history.replace(path);
    }

    return(
        <div id="nav-bar-wrapper">
            <div id="nav-bar">
                <h1 id="logo">BEC</h1>
                <div id="nav-links">
                    <h1 onClick = {() => moveTo('/')}>Home</h1>
                    <h1 onClick ={() => moveTo('/topBooks')}>Top Books</h1>
                </div>
            </div>
        </div>
    )
}

