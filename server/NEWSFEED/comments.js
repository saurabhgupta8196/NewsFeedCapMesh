
const express = require('express');
const app = express();

const Dao = require('../modules/data-access/data-access');
const dao = new Dao();

class Comments {

/*******************
 * @Description retrives particular comments of the post based on postId
 * @author Dnyanda Deshpande, A Haritha, Aditya Gupta
 * @params {database collection} collections
 * @params {integer} id
 * @params {object} result array of comments based on postId
 */
    async getComments(collections, id) {
        let query = [{ $match: { "posts.postid": id } }, { $project: { "posts.comments": 1, "posts.postid": 1 ,_id:0} }]
        let result = await dao.aggregate(collections, query);
        result=result[0].posts;
        result=result.filter(t=>{
            if(t.postid==id){
                return t;
            }
            else return 0;
        })
        return (result);
    }


/*******************
 * @Description adds particular comments of the post based on postId and userId
 * @author Dnyanda Deshpande, A Haritha, Aditya Gupta, Pawan Parihar
 * @params {database collection} collections
 * @params {integer} u
 * @params {integer} p
 * @params {Object} req
 * @params {object} result adds data in comments array based on postId and userId
 */

    async postComments(collections, uId, pId, requestBody) {
        let query = { $and: [{ "userName": uId }, { "posts.postid": pId }] };
        
        let newquery = { $push: { "posts.$.comments": { "commentBy": requestBody.commentBy, "content": requestBody.content, "timestamp": new Date() } } }
        let result = await dao.update("newsFeed", query, newquery);
        return (result)
    }
}

module.exports = Comments;
