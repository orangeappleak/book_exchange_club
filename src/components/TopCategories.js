import React,{useState,useEffect} from 'react';
var cors = require('cors');



export default function TopCategories(){


    useEffect(() => {
        fetch('https://movie-flask-api-0510.herokuapp.com/topmovies',{mode:'no-cors'})
        .then((data) => {console.log(JSON.parse(data))})
    },[])




    return(
        <div id="top-categories">
            <h1>Top Categories</h1>
        </div>
    )
}