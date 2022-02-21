const request = require('request');
const { getHeaders } = require('./trelloAuth');
const apiUrl = `${process.env.TRELLO_APIURL}`;

/**
 * Creates a labe in trello
 * @param {*} trelloapikey 
 * @param {*} trelloapitoken 
 * @param {*} idBoard 
 * @param {*} name 
 * @param {*} color 
 * @returns 
 */
const createTrelloLabel = async (trelloapikey, trelloapitoken, idBoard, name, color) => {
    if (!name) {

        throw new Error("Missing label name");
    }
    if (!color) {
        throw new Error("Missing label color");
    }
    if (!idBoard) {
        throw new Error("Missing idBoard");
    }
    const urlRequest = `${apiUrl}/labels?name=${name}&color=${color}&idBoard=${idBoard}`;
    const authKeys = {
        apiKey: trelloapikey,
        apiToken: trelloapitoken
    }
    const options = {
        'method': 'POST',
        'url': urlRequest,
        'headers': await getHeaders(authKeys, 'POST', urlRequest, {}),
    };
    options.headers["Content-Type"] = 'application/json';
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
    createTrelloLabel
}
