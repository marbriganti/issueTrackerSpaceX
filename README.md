# issueTrackerSpaceX

Endpoint to create task. You'll need your own APIKEY, the APITOKEN and a idBoard in order to create the cards in trello.

# Instructions

clone the repo
npm install
npm start

# .env

## You should set

PORT="3000"
TRELLO_APIURL="https://api.trello.com/1"

# Trello keys

## 1- You can set the values in .env

TRELLO_APIKEY=<your api key>

TRELLO_TOKEN=<your api token>

## 2- Or you could send them as headers keys in keys trellokey and trelloapitoken

If the keys are not set in the headers, the spaceX API will try to get them from env vars.
e.g.
curl -H "Content-Type: application/json"  
 -H "trelloapikey: {{trelloapikey}}"  
 -H "trelloapitoken: {{trelloapitoken}}"
http://localhost:3000/boardLists?idBoard={{idBoard}}&listName="To%20Do"

# Available endpoints

## boardList (GET)

It is not necessary to use this. You could first use this endpoint to get the idList which you will use in the createTask endpoint
GET: /boardLists
parameters:

- idBoard this is mandatory parameter
- listName this is optional filter parameter

## createTask (POST)

Endpoint to create task in Trello
POST: /createTask
parameters:

- idBoard this is mandatory parameter
- listName this is an optional parameter, if not set it defaults to the "To Do" list (if it doesn't exist in Trello it will be created)

curl \
--request POST \
-H 'Content-Type: application/json' \
-H "trelloapikey: {{trelloapikey}}" \
-H "trelloapitoken: {{trelloapitoken}}" \
http://localhost:3000/createTask?idBoard={{idBoard}} \
-d '{"type": "bug", "description": "The altimeter does not work." }'

remember, if you want set TRELLO_APIKEY and TRELLO_TOKEN in the .evn file (or an env var) you dont have to set trelloapikey and trelloapitoken in headers

curl \
--request POST \
-H 'Content-Type: application/json' \
http://localhost:3000/createTask?idBoard={{idBoard}} \
-d '{"type": "bug", "description": "The altimeter does not work." }'
