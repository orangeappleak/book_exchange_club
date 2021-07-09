import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoaderPage } from '../App';

import './stylesheets/SelectedBook.css';

export default function SelectedBookPage(){
    let {book_url} = useParams();
    let [bookData,updateBooksData] = useState({});
    let [pageLoaded,updatePageLoadStatus] = useState(false);


    useEffect(() => {
        console.log(bookData.bookData);
        fetch("/api/" + book_url)
        .then(data => data.json())
        .then(response => {
            updateBooksData(response);
            updatePageLoadStatus(true);
        })
    },[pageLoaded])

    return (

        pageLoaded ? 
            <BookInfo / >
            : <span style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <img style={{
                    borderRadius: '20px',
                }} src="https://www.keyboor.com/images/loading1.gif" />
            </span>
        )


    function BookInfo(){

        let bookInfo = bookData.bookData[0];
        let authorInfo = bookInfo.about_author;
        let author_profile_image = authorInfo.author_profile_image.replace("background-image:","");
        let genres = bookData.bookData[0].book_genres;
        console.log(author_profile_image);

        return (<div className="book-info" id={book_url}>
            <div id="image-wrapper">
                <img src={bookInfo.book_image} />
               
            </div>
            <div id="book-info">
                <h1>{bookInfo.book_name}</h1>
                <div id="book-info-and-genres">
                    <h2>{bookInfo.books_desc}</h2>
                    <div id="genres">
                        <h1>Genres</h1>
                        <div id="genre-list">
                            {genres.map((genre) => {
                                return <h2 id="genre-name">{genre}</h2>
                            })}
                        </div>
                    </div>
                </div>
                <div id="about-author">
                    <h1>About Author</h1>
                    <div id="author-profile">
                        <div id="author-basic-desc">
                            <h2 id="author-name">Name : {authorInfo.author_name}</h2>
                            <h2 id="author-followers">Follower Count : {authorInfo.author_follower_count}</h2>
                        </div>
                        {/* <img style={{
                            backgroundImage: author_profile_image,
                        }} /> */}
                    </div>
                    <h2 id="author-desc">{authorInfo.author_profile_desc}</h2>
                </div>
            </div>
        </div>)
    }
}
