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

        let bookInfo = bookData.book_data[0];
        let authorInfo = bookInfo.about_author;
        let genres = bookData.book_data[0].book_genres;
        let reviews = bookData.book_data[0].community_reviews;


        return (
            <div id="book-info-wrapper">


          
        <div className="book-info" id={book_url}>
            <div id="image-wrapper">
                <img src={bookInfo.book_image} />
               
            </div>
            <div id="seperated-book-info">
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
                    </div>
                    <h2 id="author-desc">{authorInfo.author_profile_desc}</h2>
                </div>
            </div>
        </div>
            <div id="book-reviews">
                {reviews.map((review) => {
                    console.log(review)
                    return <div id="review-content">
                            <div id="reviewer-info">
                                <img src={review.book_review.book_reviewer_image} />
                                <h1>{review.book_review.book_reviewer_name}</h1>
                            </div>
                        </div>
                })}
            </div>
        </div>)
    }
}
