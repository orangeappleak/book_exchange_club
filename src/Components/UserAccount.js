import React,{useState,useEffect} from 'react';

import {connect} from 'react-redux';
import {db} from '../firebase';

import {Link, Route, Switch} from 'react-router-dom';

import SelectedBookPage from './SelectedBook';


import './stylesheets/UserAccount.css';
import { customAlert } from '../App';
function UserAccount(props){

    var logInStatus = props.loggedIn;

    const [pageLoaded,updatePageLoad] = useState(false);
    
    const [firebaseLocalData,updateFirebaseLocalData] = useState(JSON.parse(localStorage.getItem('firebase-local-data')));
    const [bookLists,updateShitData] = useState(['wantedToRead','ownedBooks','readBooks','rentedBooks']);
    
    useEffect(() => {

        const localUserStats = JSON.parse(localStorage.getItem('profile-data'));
        if(logInStatus){ 

            getFirebaseBookData(localUserStats.name);
        
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




    return (logInStatus) ? (pageLoaded) ?  <ProfilePage bookLists={bookLists}/> : <h1>loading</h1> : <h1>not logged in dumas</h1>
}


function ProfilePage({bookLists}){

    const userData = JSON.parse(localStorage.getItem('firebase-local-data'));
    return (
    <div id="profile-page">

        
        <CoverImage userData = {userData} />
        <ProfileData userData = {userData} />
        <BooksList userData = {userData} bookLists = {bookLists}/>

        
        
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

function BooksList({bookLists}){

    let profile_name = JSON.parse(localStorage.getItem('profile-data')).name;

    const [changeDetected,updateChangeStatus] = useState(false);

    useEffect(() => {
        console.log("running update");

        
        db.collection('users').doc(profile_name).collection('booksList').get()
        .then((bookDocs) => {
            bookDocs.forEach((bookDoc) => {

                db.collection('users').doc(profile_name).collection('booksList').doc(bookDoc.id)
                .collection('book_data').onSnapshot((snapShot) => {
                    let metaData = snapShot.metadata['hasPendingWrites'];
                    let docChanges = snapShot.docChanges();
                    docChanges.forEach((change) => {

                        console.log("THE CHANGE TYPE IS",change.type);
                        updateChangeStatus(true);

                        if(metaData === true){
                            if(change.type === "added") {
                                getFirebaseBookData(profile_name);
                                updateChangeStatus(false);
                            };
                        }
                        else if(metaData === false){
                            updateChangeStatus(true);
                            console.log("THIS IS WHERE THE META DATA IS FALSE",metaData);
                            if(change.type === "added"){
                                console.log("added from some where else");
                            }
                            else if(change.type === 'removed'){
                                getFirebaseBookData(profile_name);
                                updateChangeStatus(false);
                            }
                        }
                        else{
                            console.log("RUNNING THE ELSE");
                            updateChangeStatus(false);

                        }
                    })
    
                    },(error) => {
                        console.log("ERRRR",error)
                    });
                });
            });  
    }, [changeDetected]);


    return(
        (changeDetected) ?
        <div id="shit">
                {bookLists.map((bookListId) => {
            return (
                <BookListCard bookListId = {bookListId} />

            )
        })}
        </div> : <h1>Getting your lists</h1>
    )
}

function BookListCard({bookListId}){

    const bookListData = JSON.parse(localStorage.getItem(bookListId));

    return <div className="bookslist">
       
       <div id="book-list-name">
            <h1>{bookListId}</h1>
       </div>
        {(bookListData.length === 0) ? <h1>add some books to display here</h1> : bookListData.map((book) =>
            {
                let url = book['book-data'].book_url;
                return <div id="profile-books">
                    <div id='book-card'>
                        <div id="book-image">
                            <div id="book-options">
                                <h1 onClick = {() => {
                                   removeBook(bookListId,url);
                                }}>remove</h1>
                                <Link to={`showBook/${book['book-data'].book_url}`}>
                                    <h1>go to book page</h1>
                                </Link>
                            </div>
                            <img src={book['book-data'].book_image} />
                        </div>
                        <h1>{book['book-data'].book_name}</h1>
                    </div>
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

function removeBook(bookListId,book_url){

    let userName = document.getElementById('userName').innerHTML;
    db.collection('users').doc(userName).collection('booksList').doc(bookListId).collection('book_data').
    doc(book_url).delete().then(() => {
        customAlert("Book has been removed successfully");
    })
}

const mapStateToProps = (state) => {
    return{
        loggedIn: JSON.parse(localStorage.getItem('logInStatus')),
    }
}

export function getFirebaseBookData(profile_name){

    db.collection('users').doc(profile_name).collection('booksList').get().then((bookDocs) => {
        bookDocs.forEach((bookDoc) => {
            db.collection('users').doc(profile_name).collection('booksList').doc(bookDoc.id).collection('book_data').get()
            .then((books) => {
                localStorage.setItem(bookDoc.id,JSON.stringify([]));
                books.forEach((book)=> {
                    if(book.id != "init_book"){
                        localStorage.setItem(bookDoc.id,JSON.stringify([
                            ...JSON.parse(localStorage.getItem(bookDoc.id)),
                            book.data(),
                        ]));
                    }
                })
            })
        })
    })
}



export default connect(mapStateToProps)(UserAccount)
