import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './stylesheets/SelectedBook.css';

export default function SelectedBookPage(){
    let {book_url} = useParams();
    let [bookData,updateBooksData] = useState({});
    let [pageLoaded,updatePageLoadStatus] = useState(false);


    useEffect(() => {
        if(!pageLoaded)
            fetch("/api/" + book_url)
            .then(data => data.json())
            .then(response => {
                    updateBooksData(response);
            }).then(() => updatePageLoadStatus(true))
    },[pageLoaded])

    return (

        pageLoaded ? 
            <BookInfo / >
            : <span style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <img alt="cant show" style={{
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
                <img alt="cant show" src={bookInfo.book_image} />
               
            </div>
            <div id="seperated-book-info">
                <h1>{bookInfo.book_name}</h1>
                <span id="rating-data">
                    <h2>Book Rating: {bookInfo.book_rating_value}</h2>
                    <h2>No of Ratings: {bookInfo.book_ratings}</h2>

                </span>
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
                <h1 id="book-reviews-heading">See What other people have to say about this book.</h1>
            <div id="book-reviews">
                {reviews.map((review) => {
                    console.log(review)
                    return <div id="review-content">
                            <div id="reviewer-info">
                                <div id="reviewer-image-wrapper">
                                    <img alt="cant show" src={review.book_review.book_reviewer_image} />
                                </div>
                                <span style={{display: 'flex',flexDirection: 'column'}}>

                                <h1>{review.book_review.book_reviewer_name}</h1>
                                <h2>{review.book_review.review_likes}</h2>

                                </span>
                            </div>
                            <div id="reviewer-review">
                                <span id="book_review_stacked" style={{
                                    display: 'inline',
                                }}>{review.book_review.book_review_content_stacked}<br/></span>
                                <span onClick={openReadMore} id="read-more">Read More</span>
                                <span id="book_review_full" style={{
                                    display: 'none'
                                }}>{review.book_review.book_review_content_full}</span>
                            </div>
                        </div>
                })}
            </div>
        </div>)
    }
    


    function openReadMore(el){
        console.log(el);
        if(el.target.innerHTML === "Less"){
            el.target.innerHTML = "Read More";
            el.target.nextSibling.style.display = "none";
            el.target.previousSibling.style.display = "inline";

        }
        else{
            el.target.innerHTML = "Less";
            el.target.nextSibling.style.display = "inline";
            el.target.previousSibling.style.display = "none";
        }

    }
}
