import React,{useEffect, useState} from 'react';

export default function TopBooks(){

    let [categories, updateCategories] = useState({})
    let [pageLoaded, updatePageLoadStatus] = useState(false);


    useEffect(() => {
        let mainData = fetch('https://bec-goodreads-api.herokuapp.com/popularCategories')
        .then(data => {
            return data.json();
        })
        .then(response => {updateCategories(response)})
        .then(() => {
            updatePageLoadStatus(true);
        })
    }, [pageLoaded])

    return(
        pageLoaded ? 
        <div id="top-books-wrapper">
            <h1>Top Books page</h1>
            <CategoriesList categories = {categories}/>
        </div> : <h1>Loading</h1>
    )
}

function CategoriesList({categories}){
    let categories_list = categories.popular_book_categories;
    return(
        <div id="category-list">
            {categories_list.map((el) => {
                return (
                    <div id="category">
                        <h1 id="category-name">{el.category_name}</h1>
                        <img id="category-image" src={el.category_image} />
                    </div>
                )
            })}
        </div>
    )
}