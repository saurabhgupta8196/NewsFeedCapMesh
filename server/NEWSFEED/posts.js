const Dao = require('../modules/data-access/data-access');
const dao = new Dao();

//required to generate unique Id
const uuidv4 = require('uuid/v4');


class Posts {

    /**
     * @description to insert post in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {Object} data
     * @param {string} userName
     * @returns {Object} result 
     */
    async createPosts(data, userName) {
        data.postid = uuidv4();
        data.timestamp = new Date();
        var filter = { "userName": userName };
        var content = { $push: { "posts": data } };
        var result = await dao.update("newsFeed", filter, content)
        return result
    }

    /**
     * @description to edit post inserted in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {Object} data
     * @param {string} userName
     * @param {string} postId
     * @returns {Object} result 
     */
    async editPosts(data, userName, postId) {
        var filter = { "userName": userName, "posts.postid": postId };
        var content = { $set: { "posts.$.content": data.content } };
        var result = await dao.update("newsFeed", filter, content)
        return result
    }

    /**
     * @description to delete post inserted in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {string} userName
     * @param {string} postId
     * @returns {Object} result 
     */
    async deletePosts(userName, postId) {
        var filter = { "userName": userName };
        var content = { $pull: { "posts": { postid: postId } } };
        var result = await dao.update("newsFeed", filter, content)
        return result
    }

}

module.exports = Posts