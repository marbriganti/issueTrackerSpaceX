
const request = require('request');
const { getHeaders } = require('./trelloAuth');
const { getTrelloBoardElement } = require('./trelloBoard');
const apiUrl = `${process.env.TRELLO_APIURL}`;

/**
 * (resolver) Gets from trello board list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getBoardLists = async (req, res, next) => {
    try {
        const { idBoard, listName } = req.query;
        const { trelloapikey, trelloapitoken } = req.headers;
        const lists = await getTrelloBoardElement(trelloapikey, trelloapitoken, idBoard, "lists");
        const result = !!listName ? JSON.parse(lists).filter(x => x.name == listName) : JSON.parse(lists);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500);
        res.send(error.message);
    }
}

/**
 * Creates a new Trello list in trello
 * @param {*} trelloapikey 
 * @param {*} trelloapitoken 
 * @param {*} idBoard 
 * @param {*} name 
 * @returns 
 */
const createTrelloList = async (trelloapikey, trelloapitoken, idBoard, name) => {
    if (!name) {
        throw new Error("Missing list name");
    }
    if (!idBoard) {
        throw new Error("Missing idBoard");
    }
    const urlRequest = `${apiUrl}/lists?name=${name}&idBoard=${idBoard}`;
    const authKeys = {
        apiKey: trelloapikey,
        apiToken: trelloapitoken
    }
    const options = {
        'method': 'POST',
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
    getBoardLists,
    createTrelloList
}