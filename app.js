const express = require ('express');
var MongoClient = require('mongodb').MongoClient;
require ('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json('Please use /search endpoint with "q" parameter');
});

// Create "/search" endpoint, method: GET
app.get('/search', async(req, res) => {
  try {
    //1. Query params
    let queryParams = req.query.q;
    
    //2. Connect to db
    const client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    const database = await client.db("pencil");

    //3. Fetch data from Topics collection
    const query = { topicName: queryParams };
    const topicResult = await database.collection("topics").findOne(query);
    console.log(topicResult);

    if(topicResult){
      //4. Fetch data from Questions collection
      const topicId = topicResult.topicId;
      const parentId = {rootTopicId: topicResult.parentId};
      const questions = await database.collection("questions").find( { topicIds: { $all: [topicId] }}).toArray();
      let matchQuestions = [];
      matchQuestions.push(parentId);
      for(let i = 0; i < questions.length; i++){
        matchQuestions.push(questions[i].questionNo);
      }
      res.status(200).json(matchQuestions);
    } else {
      res.status(404).json("Data not found");
    }    
  }
  catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});