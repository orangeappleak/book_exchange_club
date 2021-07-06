import './stylesheets/TopBooks.css';

import React,{useEffect, useState} from 'react';

import {
    Route,
    Switch,
    useParams,
    useRouteMatch,
    Redirect,
    Link
} from 'react-router-dom';
import { JSDOM } from 'jsdom';

export default function TopCategories(){

    let {path, url} = useRouteMatch()

    let [categories, updateCategories] = useState({})
    let [pageLoaded, updatePageLoadStatus] = useState(false);


    useEffect(() => {

        document.getElementById('loading-page').style.transform = "translate(0%,0%)";
        var local_books_data = sessionStorage.getItem('books-categories');
        console.log(JSON.parse(local_books_data));

        if(local_books_data === null){
            fetch('/popularCategories')
            .then(data => {
                // console.log("data",data.json());

                return data.json();
            })
            .then(response => {
                updateCategories(response);
                sessionStorage.setItem('books-categories',JSON.stringify(response));
            })
            .then(() => {
                updatePageLoadStatus(true);
                document.getElementById('loading-page').style.transform = "translate(0%,-100%)";
            })
        }
        else{
            updatePageLoadStatus(true);
            document.getElementById('loading-page').style.transform = "translate(0%,-100%)";
            updateCategories(JSON.parse(local_books_data));
        }
    }, [pageLoaded])

    return(
        pageLoaded ? <TopBooksWrapper path={path} categories = {categories}/>
         : <span></span>
    )
}

function TopBooksWrapper({path,categories}){
    return(
        <div id="top-books-wrapper">
            <div id="top-books-main">
                <div id="top-books-img">
                    <img src="https://images.unsplash.com/photo-1625198474162-a9e240505312?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" />
                </div>
                <div id="top-books-headings">
                    <h1>These are the top Book Categories. </h1>
                    <h2>These books are chosen by the readers and each book is ranked based on the no of votes that it recieves.
                    The following books in each category are also winners of the 12th annual Goodreads Choice Awards.</h2>
                </div>
            </div>
            

            <Switch>
                <Route exact path={`${path}`}>
                    <h1 id='category-heading'>Categories</h1>
                    <CategoriesList path={path} categories = {categories}/>
                </Route>
                <Route exact path={`${path}/:pageRoute`}>
                    <TopBooksPage />
                </Route>
            </Switch>
        </div>
    )
}

function CategoriesList({path,categories}){
    let categories_list = categories['popular_book_categories'];
    console.log("categories_list",categories_list);
    return(
        <div id="category-list">
            {categories_list.map((el) => {
                return (
                    <Link to ={`${path}/${el.category_route}`}>
                        <div className = {el.category_route} id="category">
                            <div id="category-image">
                                <img src={el.category_image} />
                            </div>
                            <div id="category-name-wrapper">
                                <h1 id="category-name">{el.category_name}</h1>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

function TopBooksPage(){
    let {pageRoute} = useParams();
    let [booksData,updateBooksData] = useState({});
    let [subPageLoaded,updateSubPageLoad] = useState(false);

    useEffect(() => {
        document.getElementById('loading-page').style.transform = "translate(0%,0%)";
        var localBooksData = sessionStorage.getItem(pageRoute);
        if(localBooksData === null){
            fetch(`/popularCategories/${pageRoute}`)
            .then(data => {return data.json()})
            .then(response => {
                updateBooksData(response);
                sessionStorage.setItem(pageRoute,JSON.stringify(response));
            })
            .then(() => {
                updateSubPageLoad(true);
                document.getElementById('loading-page').style.transform = "translate(0%,-100%)";
            })
        }
        else{
            updateSubPageLoad(true);
            document.getElementById('loading-page').style.transform = "translate(0%,-100%)";
            updateBooksData(JSON.parse(localBooksData));
        }
        
    },[subPageLoaded])

    return(
    
    subPageLoaded ? (
        <div id='books-page-loaded'>

            <h1>Best Voted Book for this category</h1>
            <div id="best-voted-book">
                <div id="best-voted-book-image">
                    <div id="book-image-wrapper">
                        <img src={booksData[pageRoute][0].book_image} />
                    </div>
                </div>
                <div id="best-voted-book-data">
                    <div id="book-name-wrapper">
                        <h1>{booksData[pageRoute][0].book_name}</h1>
                    </div>
                    <div id="ratings-wrapper">
                        <h1 id="ratings"><span style={{
                            color: 'yellow',
                            fontFamily: 'Lato',
                            fontWeight: '400',
                            fontSize: '60px'
                        }}>Winner :</span>{booksData[pageRoute][0].book_ratings}</h1>
                    </div>
                    <div id="book-info">
                        <h2>{booksData[pageRoute][0].winner_book_desc}</h2>
                    </div>
                </div>
            </div>
            <h1 id="page-heading">{pageRoute.replaceAll("-"," ")}</h1>
            
            <BooksList booksData = {booksData} pageRoute = {pageRoute}/> 
        </div>
    )
: <span></span>)
}

function BooksList({booksData,pageRoute}){
    return(
        <div id="books-page">
            
            {booksData[pageRoute].slice(1).map((book) => {
                return (
                    <div onMouseEnter= {(el) => {
                        el.target.classList.add('show')
                    }} onMouseLeave={(el) => {
                        el.target.classList.remove('show')
                    }} id="book-data">
                        <div id="book-image-wrapper">
                            <img src={book.book_image} />
                        </div>
                        <div id="book-name-wrapper">
                            <h1>{book.book_name}</h1>
                        </div>
                        <div id="ratings-wrapper">
                            <h1 id="ratings">{book.book_ratings}</h1>
                        </div>
                        
                    </div>
                )
            })}
        </div>
    )
}
