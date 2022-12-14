import React from 'react'
import { ParallaxLayer,Parallax } from '@react-spring/parallax';
import "./stylesheets/MainPage.css";
import { useEffect } from 'react';
import { useState } from 'react';

import { Link } from 'react-router-dom';

export default function MainPage(){
    return(
        <Parallax id="main-page" pages={8}>
            <ParallaxLayer id="main-page-image-wrapper" speed={0.5} offset={0}>
                <img src="https://images.unsplash.com/photo-1626766489590-fea858a7665f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1491&q=80"/>
            </ParallaxLayer>
            <ParallaxLayer id="main-page-heading" speed={1.5} offset={0}>
                <h1>Welcome to the Book Exchange Club</h1>
                <p>Find new books that you want to read by swapping the older books that you have already finished reading.</p>
            </ParallaxLayer>
            <ParallaxLayer speed={1.2} offset={0.7}>
                <div id="most-read-books-section">
                    <h1>Most Read Books</h1>
                    <MostReadBooks />
                </div>
                <div id="articles">
                    <h1>ARTICLES</h1>
                    <ArticleList />
                </div>
            </ParallaxLayer>
        </Parallax>
    )
}

function MostReadBooks(){

    const [gotMostReadBooks,updateGotMostReadBooks] = useState(false);
    const [mostReadBooksData,updateGotMostReadBooksData] = useState({});
    const [booksToShow,updateBooksToShow] = useState(5);
    
    useEffect(() => {

        if(localStorage.getItem('mostReadBooks') === null){
            fetch('/api/mostRead').then(data => {return data.json()})
            .then((response) => {
                console.log("THIS IS THE RESPONSE",response);
                updateGotMostReadBooksData(response);
                localStorage.setItem("mostReadBooks",JSON.stringify(response));
            }).then(() => updateGotMostReadBooks(true))
        }
        else{
            updateGotMostReadBooksData(JSON.parse(localStorage.getItem('mostReadBooks')));
            updateGotMostReadBooks(true);
        }
    },[gotMostReadBooks,booksToShow])

    return (gotMostReadBooks) ? 
    <div id="most-read-books-dummy">
        <div id="most-read-books-wrapper">
            <MostReadBooksCard data = {mostReadBooksData.mosReadBooks} booksToShow = {booksToShow}/> 
        </div>
        <div id="show-more-less">
            <h1 onClick = {(el) => {
                if(booksToShow <= 50){
                    updateBooksToShow(booksToShow + 10);
                }
            }}>Show More</h1>
            <h1 onClick = {(el) => {
                updateBooksToShow(10);
            }}
            >Show Less</h1>

        </div>

        

    </div>
    : <h1>getting most read books</h1>
}

function MostReadBooksCard({data,booksToShow}){
    let data_part_one = data.slice(0,booksToShow);
    return data_part_one.map((book) => {
        var sliced_image_part = book.book_image.split('/')[8].split('.')[0];
        var actual_image_url = book.book_image.split('/').slice(0,8).join('/') +'/'+sliced_image_part+".jpg";
        return <div id="most-read-book-card">
            <h1>{book.book_name}</h1>
            <Link to={`showBook/${book.book_url.split('/')[3]}`}>
                <img src={actual_image_url} />
            </Link>
        </div>
    })
}

function ArticleList(){

    const [articleData,updateArticleData] = useState({});
    const [gotArticles,updateGotArticles] = useState(false);

    useEffect(() => {
        fetch('/api/articles').then((data) => {return data.json()})
        .then((response) => {
            updateArticleData(response);
        }).then(() => updateGotArticles(true));
    },[gotArticles])

    return (gotArticles) ? articleData.articles.map((article) => {
        return <ArticleCard articleData={article} />
    }) : <h1>getting articles pls be patient</h1>
}

function ArticleCard({articleData}){

    return <div id="article-body">
        <div id="article-image-wrapper">
            <img src={articleData.article_image} />
        </div>
        <div id="article-info">
            <div id="article-info1">
                <h1>{articleData.article_title}</h1>
                <p>{articleData.article_body}</p>
            </div>
            <div id="article-timestamp">
                <small>{articleData.article_timeStamp}</small>
            </div>
        </div>
    </div>
}
