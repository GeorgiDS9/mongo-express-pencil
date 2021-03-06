Node.js application built using the Express framework connected to MongoDB Atlas (cloud) database

Main steps:

- install node.js: https://nodejs.org/en/download/
- create mongo database using MongoDB Atlas: https://docs.atlas.mongodb.com/
- check dependencies in the package.json:
  "dependencies": {
  "dotenv": "^8.2.0",
  "express": "^4.17.1",
  "mongodb": "^3.6.6",
  "nodemon": "^2.0.7",
  "read-excel-file": "5.1.0"
  }
- nodemon: https://www.npmjs.com/package/nodemon
- dotenv: https://www.npmjs.com/package/dotenv
- run "npm install" in the terminal to generate node_modules
- create .gitignore file and add node_modules, .DS_Store and .env to it.
- run "git init", create remote respository and link to remote repository

app.js

- first require the packages we installed and store them in variables at the top.
- create express app and listen to port 3000 (or your choice of port): https://www.npmjs.com/package/express
- create mongodb connection to MongoDB Atlas: https://docs.atlas.mongodb.com/
- create "/search" endpoint, method: GET, to return array of question numbers when a topic is queried, inlcuding the root topic

readExcel.js

- install read-excel-file package: https://www.npmjs.com/package/read-excel-file
- require the relevant packages at the top of the page and store them in variables
- populate Atlas db with the data from the rows in the two excel files (Topics and Questions)

Example of query:
http://localhost:3000/search?q=Chloroplasts

Query result for the "Chloroplasts" topic (including the parent/root id):

[
{
"rootTopicId": 2
},
15,
48,
87,
190
]
