import React,{useState,useEffect} from 'react';

import {connect} from 'react-redux';
import {db} from '../firebase';

import './stylesheets/UserAccount.css';

function UserAccount(props){

    var logInStatus = props.loggedIn;

    const [pageLoaded,updatePageLoad] = useState(false);
    const [gotData,updateGotData] = useState(false);

    
    const [firebaseLocalData,updateFirebaseLocalData] = useState(JSON.parse(localStorage.getItem('firebase-local-data')));
    const [shitData,updateShitData] = useState(JSON.parse(localStorage.getItem('bookData')));
    
    useEffect(() => {

        const localUserStats = JSON.parse(localStorage.getItem('profile-data'));
        if(logInStatus){    

            db.collection('users').doc(localUserStats.name).collection('booksList').onSnapshot(function(snapshot){
                let changes = snapshot.docChanges();
                changes.forEach((change)=>{
                    if(change.type === 'modified'){
                        console.log("change-type-in-userAccount",change.type);
                        updateShitData(JSON.parse(localStorage.getItem('bookData')));
                        console.log("UPDATED SHIT DATA",shitData);
                        
                    }
                })
                
            });

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
    },[])




    return (logInStatus) ? (pageLoaded) ? <ProfilePage shitData={shitData}/> : <h1>lodaing</h1> : <h1>not logged in dumas</h1>
}


function ProfilePage({shitData}){
    const userData = JSON.parse(localStorage.getItem('firebase-local-data'));
    return (
    <div id="profile-page">

        
        <CoverImage userData = {userData} />
        <ProfileData userData = {userData} />
        <BooksList userData = {userData} shitData = {shitData}/>
        
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

    const [profileImage,updateProfileImage] = useState(userData.profileImage);

    useEffect(() => {
        db.collection('users').doc(userData.userName)
        .onSnapshot(async () => {
            const image = await db.collection('users')
            .doc(userData.userName)
            .get().then((ele) => {
                return ele.data().profileImage;
            });

            updateProfileImage(image);
        }
    )},[profileImage]);
    return <div id="profile-data-wrapper">
        <div id="profile-page-heading-wrapper">
        <h1>Hello There 
            <br/><span style={{
                fontWeight: '900',
                margin: "50px 0",
            }}>{userData.userName}</span>
            <br/>
            Welcome to your profile, 
            all your books and book lists can be accessed from here.</h1>
        </div>
        
        <div id="profile-data">
            <div id="profile-image">
                <img alt="cant show" src={profileImage} />
                <div id="edit-profile-image">
                    <input placeholder="enter the url" />
                    <div onClick={() => updateProfileImageUrl(userData.userName)} id="save-profile-image">
                        <h1>Save</h1>    
                    </div>
                </div>
            </div>
            <h1 id="userName">{userData.userName}</h1>
            <h1 id="userEmail">{userData.userEmail}</h1>
        </div>
    </div>
}

function BooksList({userData,shitData}){

    
    useEffect(() => {
        console.log("SHIT DATA",shitData);
    },[shitData])


    return (shitData === null) ? <h1>getting data</h1> : <div id="book-lists">
        {Object.entries(shitData).map((list) => {
            return <BookListCard bookslist={list} />
        })}
    </div>
}

function BookListCard({bookslist}){
    console.log(bookslist)
    

    return <div className="bookslist" id={bookslist[0]}>
        <h1>{bookslist[0]}</h1>
        {(bookslist[1].booksData.length === 0) ? <h1>nothing to show</h1>   :bookslist[1].booksData.map((book) =>
            {
                return <div id="profile-books">
                    <h1>{book.book_name}</h1>
                </div>
            }
        )}
    </div>
}



function updateCoverImageUrl(userName){
    var coverImageUrl = document.querySelector('#edit-cover-image input').value;
    db.collection('users').doc(userName).update({
        coverImage: coverImageUrl,
    }).then(() => {
        var localCoverImage = JSON.parse(localStorage.getItem('firebase-local-data')).coverImage;
        localStorage.setItem('firebase-local-data',JSON.stringify({
            ...JSON.parse(localStorage.getItem('firebase-local-data')),
            coverImage: coverImageUrl,
        }));
        document.querySelector('#edit-cover-image input').value = ""});
}

function updateProfileImageUrl(userName){
    var profileImageUrl = document.querySelector('#edit-profile-image input').value;
    db.collection('users').doc(userName).update({
        profileImage: profileImageUrl,
    }).then(() => {
        localStorage.setItem('firebase-local-data',JSON.stringify({
            ...JSON.parse(localStorage.getItem('firebase-local-data')),
            profileImage: profileImageUrl,
        }));
        document.querySelector('#edit-profile-image input').value = ""});

}

const mapStateToProps = (state) => {
    return{
        loggedIn: JSON.parse(localStorage.getItem('logInStatus')),
    }
}



export default connect(mapStateToProps)(UserAccount)
