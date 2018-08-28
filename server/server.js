const express = require('express')
const path =require("path");
const app = express()

//fetching the updated posts of a particular person who has logged in based on username 
const Dao = require('./modules/data-access/data-access')
const NewsFeed = require('./NEWSFEED/newsFeed');
const newsFeed = new NewsFeed();


//searching person based on username
const Search = require('./NEWSFEED/search');
const search = new Search();


//add, update and delete the posts of a particular user
const Posts = require('./NEWSFEED/posts');
const post = new Posts();

var parser = require('body-parser');
const newsFeedCollection = "newsFeed";              //name of my collection
const dao = new Dao()

//Likes and Unlikes done by user
const likes = require('./NEWSFEED/likes');//puneeth
const connection = new likes();


//add and delete comments
const conn = require('./NEWSFEED/comments')
const connection1 = new conn();

app.use(parser.json());


//fetching the updated posts of a particular person who has logged in based on username
app.get("/rest/api/load", async (req, res) => {
    console.log('Load Invoked');
    let result = await newsFeed.getNewsFeed(newsFeedCollection,"pawan");//take username from session
    res.send(result)
    
})



//add, delete and update the posts


/**
 * @description to insert post in database by a user
*/
app.patch('/rest/api/users/createPosts/update/:userName', async (req, res) => {
    let result;
    let userName = req.params.userName;
    try {
        result = await post.createPosts(req.body,userName);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
});

/**
 * @description to edit post inserted in the database by the user
 */
app.patch('/rest/api/users/editPosts/update/:userName/:postId', async (req, res) => {
    let result;
    let userName = req.params.userName;
    let postId = req.params.postId;
    try {
        result = await post.editPosts(req.body,userName,postId);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})

/**
 * @description to delete post inserted in the database by the user
 */
app.patch('/rest/api/users/deletePosts/update/:userName/:postId', async (req, res) => {
    let result
    let userName = req.params.userName;
    let postId = req.params.postId;
    try {
        result = await post.deletePosts(userName,postId);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})

/**
 * @description to search people in the database by the user
 */
app.patch('/rest/api/users/searchPeople/', async (req, res) => {
    let result;
    try {
        result = await search.searchPeople(req.body.query);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})


//Likes and dislikes
app.post('/getLike', async (req, res) => {
    let result
    try {
        var store=req.body;
        
        result = await connection.getLike(newsFeedCollection,store.name,store.time)
        
    } 
    catch (err) {
        result = {err:err}
    } 
    res.send(result)
})

app.post('/removeLike', async (req, res) => {
    let result
    try {
        var store=req.body;
        result = await connection.removeLike(newsFeedCollection,store.name,store.time)
        console.log(store.name);
    } 
    catch (err) {
        result = {err:err}
    } 
    res.send(result)
})

/***
 * @Description calling getComments() method of Comments class in comments.js file 
 */
app.get('/getComments/:id', async (req, res) => {
    let pId = eval(req.params.id);
    let result = await connection1.getComments(newsFeedCollection, pId);
    res.send(result);
})




/***
 * @Description calling postComments() method of Comments class in comments.js file 
 */
app.use(parser.json());

app.put('/updateComments/:uname/:pid', async (req, res) => {
    let result
    let uId = req.params['uname'];
    let pId = eval(req.params.pid)

    try {
        let result = await connection1.postComments(newsFeedCollection, uId, pId, req.body)
        
        res.send(result)
    }
    catch (err) {
        result = { err: err }
    }


})


app.listen('8080', () => console.log('Listening on port 8080'))