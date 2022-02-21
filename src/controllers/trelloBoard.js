
//https://api.trello.com/1/boards/{idBoard}/lists

const request = require('request');
const { getHeaders } = require('./trelloAuth');
const apiUrl = `${process.env.TRELLO_APIURL}`;


/**
 * (helper) Gets "elements" of a board 
 * @param {*} trelloapikey 
 * @param {*} trelloapitoken 
 * @param {*} idBoard 
 * @param {*} element (type of elements: "lists", "labels")
 * @returns 
 */
const getTrelloBoardElement = async (trelloapikey, trelloapitoken, idBoard, element) => {
    if (!element) {
        return [];
    }
    const urlRequest = `${apiUrl}/boards/${idBoard}/${element}`;
    const authKeys = {
        apiKey: trelloapikey,
        apiToken: trelloapitoken
    }
    const options = {
        'method': 'GET',
        'url': urlRequest,
        'headers': await getHeaders(authKeys, 'GET', urlRequest, {}),
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error);
            if (!error && response && response.statusCode != 200) {
                reject({ message: response.body, statusCode: response.statusCode });
                return;
            }
            resolve(body);
        });
    });

}



module.exports = {

    getTrelloBoardElement
}