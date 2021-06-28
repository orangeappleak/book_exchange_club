import React from 'react';

import {
    Router,
    Route,
    Redirect,
    Link,
    useHistory,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import { useEffect,useState } from 'react';
import { LoadingCurtain } from '../App';
import TopCategories from './TopCategories';

import { db } from '../firebase';

import store from '../store';

import './component_styles/UserAccount.css';
import logout from './icons/exit.png';
import ProfileImage from './ProfileImage';

const UserAccount = () => {


    const [localUserData] = useState({userData: JSON.parse(localStorage.getItem('loggedInUserData'))})
    const [loggedOut,updateLogOut] = useState(false);
    const [pageLoaded,updatePageLoadStatus] = useState(false);
    const [noUser,updateUserStatus] = useState(true);

    useEffect(() => {
        checkLogOut(updateLogOut,updateUserStatus);
        loadAllImages(updatePageLoadStatus);
        if(!noUser){
            addUserFirestore(localUserData);
        }
    },[pageLoaded,noUser])
    
    if(pageLoaded){
        return loggedOut ? (
            LogOut({updateLogOut})
        ) :  
            (<div id="user-profile">
                <NavBar />
                <div id="cover-data">
                    
                    <SideNavbar userData = {localUserData.userData} />
                    <div id="user-data">
                        
                        <div id="user-name">
                            <h1>{localUserData.userData.profile_info.name}</h1>
                            <h2>{localUserData.userData.profile_info.email}</h2>
                        </div>

                        <div onClick={() => LogOut({updateLogOut})} id="logout-button">
                            <img src={logout} alt="cant show img" />
                            <h2>Log Out</h2>
                        </div>
                    </div>
                    <div id="cover-img">
                       
                        <img src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg" alt="cant load image"/>
                    </div>
                </div>
                    <div id="sub-cards-wrapper">
                        <div id="dummy">

                        </div>
                        <div id="sub-cards">

                        </div>
                    </div>
                </div>)
    }
    else{
        return <span></span>
    }
}


function NavBar(){


    return(
      <div id="nav-bar">
        <div id="nav-links">
          <h1>Explore</h1>
          <h1>Top picks</h1>
          <Link to="/topCategories">
              <h1>Top Categories</h1>
          </Link>
          <h1>Account</h1>
        </div>
      </div>

    )
}

function SideNavbar({userData}){

    const links = ['Your Books','Rented Books','Fav Books','Books Read','Book Lists'];

    return(
        <div id="SideNavbar"> 
            <div id='profile-img-wrapper'>
                <div id="img-update-url">
                    <input placeholder="enter url"/>
                </div>
                <ProfileImage userData = {userData} />
                <div onClick={() => updateImage(userData)} id="edit-img">
                    <h1>update image</h1>
                </div>
            </div>
            <div id="sidebar-nav-links">
                {links.map(el => (
                    <div id="sidebar-nav-link">
                        <div id="link-wrapper">
                            <a style={{color:'black'}}>{el}</a>
                        </div>
                        <a>{el}</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

function loadAllImages(updatePageStatus){
    document.getElementById("loading-curtain").classList.add('move-in');
    var image_list = [...document.getElementsByTagName('img')];
        image_list.forEach((img) => {
            if(img.complete || img.classList.contains("ignore")) {
                image_list.splice(img);
            }
        })
        if(image_list.length === 0){
            setTimeout(() => {
                document.getElementById("loading-curtain").classList.remove('move-in');
                updatePageStatus(true);
            }, 1200);
        }
}

function addUserFirestore(data){
    var userExists = false;
    var users = db.collection("users");
    users.doc(data.userData.profile_info.name).get()
    .then((d) => {
        
        try{
            if(data.userData.profile_info.name === d.data().userName){
                userExists = true;
            }
            else{
                userExists = false;
            }
        }
        catch(TypeError){
            userExists = false
        }

        if(!userExists){
            console.log("no user found,creating a new user")
            users.doc(data.userData.profile_info.name).set({
                userName: data.userData.profile_info.name,
                email: data.userData.profile_info.email,
                profileImage: data.userData.profile_info.picture,
                coverImage: "https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg",
                booksLists: {
                    yourBooks: {},
                    favBooks: {}
                }
            })
        }
        console.log("user already found");
    });
}


export function checkLogOut(updateLogOut,userStatus){
    var data = localStorage.getItem('loggedInUserData');
    if(data === null){
        userStatus(true);
        LogOut({updateLogOut})
    }
}


export function LogOut({updateLogOut}){
    localStorage.clear();
    document.getElementById("loading-curtain").classList.add("move-in");
    setTimeout(() => {
        updateLogOut(true);
        document.getElementById("loading-curtain").classList.remove("move-in");

    }, 1000);
    return (
        <Redirect to='/' />
    )
}

function updateImage(userData){
    var img_url = document.querySelector("#img-update-url input").value;
    db.collection('users').doc(userData.profile_info.name).update({
        profileImage: img_url,
    })
}



export default UserAccount;