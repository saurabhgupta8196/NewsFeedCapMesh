const Dao = require('../modules/data-access/data-access');
const dao = new Dao();

class Search
{
    /**
 * @description to search people in the database by the name
 * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
 * @param {string} userName
 * @returns {Object} result 
 */

 async searchPeople( query) {
        var filter = {"name":  {$regex: /^query/i} }
        let result = await dao.find("newsFeed", filter);
        return (result);
    }

}

module.exports = Search