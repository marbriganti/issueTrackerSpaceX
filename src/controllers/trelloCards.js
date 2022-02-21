
const request = require('request');
const { getHeaders } = require('./trelloAuth');
const { createTrelloList } = require('./trelloLists');
const { createTrelloLabel } = require('./trelloLabel');
const { getTrelloBoardElement } = require('./trelloBoard');
const apiUrl = `${process.env.TRELLO_APIURL}`;
const taskTypes = require("./taskTypes.json");
const supportedCategories = ['Maintenance', 'Research', 'Test'];

const createTask = async (req, res, next) => {
    try {
        const { idBoard } = req.query;
        const { type } = req.body;
        const { trelloapikey, trelloapitoken } = req.headers;
        const listName = req.query.listName || process.env.DEFAULT_LIST || "To Do";

        if (!type) {
            res.status(400);
            res.send(`Missing type`);
        }

        if (!taskTypes[type]) {
            res.status(400);
            res.send(`Type ${type} is not available at the moment`);
        }

        const lists = await getTrelloBoardElement(trelloapikey, trelloapitoken, idBoard, "lists");
        let targetList = JSON.parse(lists).find(x => x.name == listName);
        if (!targetList) {
            const planeList = await createTrelloList(trelloapikey, trelloapitoken, idBoard, listName);
            targetList = JSON.parse(planeList);
        }

        const card = await createCustomTask[type](req.body, req.headers, idBoard, targetList);

        const trelloCard = await createTrelloCard(trelloapikey, trelloapitoken, card);
        res.send(trelloCard);
    } catch (error) {
        console.error(error.message);
        res.status(error.statusCode || 500);
        res.send(`Error: ${error.message}`);
    }
}


const createCustomTask = {
    issue: async (body, headers, idBoard, list) => {
        const { title, description } = body;
        if (!title) {
            const error = new Error(`Missing title`);
            error.statusCode = 400;
            throw error;
        }
        if (!description) {
            const error = new Error(`Missing description`);
            error.statusCode = 400;
            throw error;
        }
        return {
            name: title,
            desc: description,
            idList: list.id,
            pos: 'top'
        };

    },

    task: async (body, headers, idBoard, list) => {
        const { title, category } = body;
        if (!title) {
            const error = new Error(`Missing title`);
            error.statusCode = 400;
            throw error;
        }
        if (!category) {
            const error = new Error(`Missing category`);
            error.statusCode = 400;
            throw error;
        }
        if (!supportedCategories.includes(category)) {
            const error = new Error(`Category ${category} is not supported`);
            error.statusCode = 400;
            throw error;
        }
        const labels = await getTrelloBoardElement(headers.trelloapikey, headers.trelloapitoken, idBoard, "labels");
        let targetLabel = JSON.parse(labels).find(x => x.name == category);
        if (!targetLabel) {
            const planeList = await createTrelloLabel(headers.trelloapikey, headers.trelloapitoken, idBoard, category, "yellow");
            targetLabel = JSON.parse(planeList);
        }

        return {
            name: title,
            idList: list.id,
            pos: 'top',
            idLabels: [targetLabel.id],
        };
    },

    bug: async (body, headers, idBoard, list) => {
        const { description } = body;
        if (!description) {
            const error = new Error(`Missing description`);
            error.statusCode = 400;
            throw error;
        }
        const word = Math.random().toString(36).substring(7);
        const number = Math.floor(Math.random() * 1000000);
        const labels = await getTrelloBoardElement(headers.trelloapikey, headers.trelloapitoken, idBoard, "labels");
        const members = JSON.parse(await getTrelloBoardElement(headers.trelloapikey, headers.trelloapitoken, idBoard, "members"));
        const memberIdx = Math.floor(Math.random() * members.length);
        let targetLabel = JSON.parse(labels).find(x => x.name == "Bug");
        if (!targetLabel) {
            const planeList = await createTrelloLabel(headers.trelloapikey, headers.trelloapitoken, idBoard, "Bug", "red");
            targetLabel = JSON.parse(planeList);
        }
        return {
            name: `bug-${word}-${number}`,
            desc: description,
            idList: list.id,
            pos: 'top',
            idLabels: [targetLabel.id],
            idMembers: [members[memberIdx].id]
        };

    }
}

const createTrelloCard = async (trelloapikey, trelloapitoken, card) => {
    if (!card) {
        throw new Error("Missing label card body");
    }
    if (!card.idList) {
        throw new Error("Missing idList");
    }

    const urlRequest = `${apiUrl}/cards?idList=${card.idList}`;
    const authKeys = {
        apiKey: trelloapikey,
        apiToken: trelloapitoken
    }
    const options = {
        'method': 'POST',
        'url': urlRequest,
        'headers': await getHeaders(authKeys, 'POST', urlRequest, {}),
        'body': JSON.stringify(card)
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
    createTask
}