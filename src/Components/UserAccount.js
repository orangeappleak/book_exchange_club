import React,{useState,useEffect} from 'react';

import {connect} from 'react-redux';
import {db} from '../firebase';

import './stylesheets/UserAccount.css';

function UserAccount(props){

    var logInStatus = props.loggedIn;

    const [pageLoaded,updatePageLoad] = useState(false);
    
    const [firebaseLocalData,updateFirebaseLocalData] = useState(JSON.parse(localStorage.getItem('firebase-local-data')));
    
    useEffect(() => {
        const localUserStats = JSON.parse(localStorage.getItem('profile-data'));
        if(logInStatus){    
            if(firebaseLocalData === null){
                db.collection('users').doc(localUserStats.name).get().then((data)=>{
                    localStorage.setItem('firebase-local-data',JSON.stringify(data.data()));
                }
                ).then(() => updatePageLoad(true));
            }
            else{
                updateFirebaseLocalData(JSON.parse(localStorage.getItem('firebase-local-data')));
                updatePageLoad(true); 
            }
        }
    },[logInStatus,pageLoaded])




    return (logInStatus) ? (pageLoaded) ? <ProfilePage /> : <h1>lodaing</h1> : <h1>not logged in dumas</h1>
}


function ProfilePage(){
    const userData = JSON.parse(localStorage.getItem('firebase-local-data'));
    return (
    <div id="profile-page">

    <h1>Hello There {userData.userName}
        <br/>
        Welcome to your profile, 
        all your books and book lists can be accessed from here.</h1>
        
        <CoverImage userData = {userData} />
        
    </div>)
}


function CoverImage({userData}){

    const [coverImageUrl,updateCoverImage] = useState(userData.coverImage);

    useEffect(() => {
        db.collection('users').doc(userData.userName)
        .onSnapshot(async () => {
            const image = await db.collection('users')
            .doc(userData.userName)
            .get().then((ele) => {
                return ele.data().coverImage;
            });

            updateCoverImage(image);
        }
    )},[coverImageUrl]);

    return <div id="cover-image-wrapper">
        
        <ProfileData userData = {userData} />
        <img alt="cant show" src={coverImageUrl} />
        <div id="edit-cover-image">
            <input  placeholder="enter image url to change" />
            <div onClick={() => {updateCoverImageUrl(userData.userName)}} id="save-cover-image">
                <h1>Update</h1>
            </div>
        </div>
    </div>
}

function ProfileData({userData}){
    return <div id="profile-data-wrapper">
        
        <div id="profile-data">
            <div id="profile-image">
                <img alt="cant show" src={userData.profileImage} />
            </div>
            <h1 id="userName">{userData.userName}</h1>
            <h1 id="userEmail">{userData.userEmail}</h1>
        </div>
    </div>
}


function updateCoverImageUrl(userName){
    var coverImageUrl = document.querySelector('#edit-cover-image input').value;
    db.collection('users').doc(userName).update({
        coverImage: coverImageUrl,
    }).then(() => {
        var localCoverImage = JSON.parse(localStorage.getItem('firebase-local-data')).coverImage;
        console.log(localCoverImage);
        localStorage.setItem('firebase-local-data',JSON.stringify({
            ...JSON.parse(localStorage.getItem('firebase-local-data')),
            coverImage: coverImageUrl,
        }));
        document.querySelector('#edit-cover-image input').value = ""});
}

const mapStateToProps = (state) => {
    return{
        loggedIn: JSON.parse(localStorage.getItem('logInStatus')),
    }
}



export default connect(mapStateToProps)(UserAccount)
