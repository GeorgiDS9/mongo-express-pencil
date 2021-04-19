const readXlsxFile = require('read-excel-file/node');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

readExcel();

async function readExcel(){

// Read Questions Excel File
let questionsExcel = await readXlsxFile('/Users/georgi/pencil-db/Questions.xlsx').then(async (rows) => { 
    return rows;   
});

// Read Topics Excel File
readXlsxFile('/Users/georgi/pencil-db/Topics.xlsx').then(async (rows) => {
    // Map for saving the unique topics
    let uniqueTopicMap = new Map()

   // Connect to DB 
   const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const database = await client.db("pencil");

    let idCounter = 1;
   
    // Read Topic Excel rows
    for(let i = 1; i < rows.length; i++){

        let topic = rows[i][0]; //This is topic1 in excel file
        let topic2 = rows[i][1];
        let topic3 = rows[i][2];

        if(!uniqueTopicMap.has(topic)){
            let topicObject = {topicName: topic, topicId: idCounter, parentId: 0 };
            uniqueTopicMap.set(topic,topicObject);
            idCounter++;
            database.collection("topics").insertOne(topicObject, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
        }

        if(!uniqueTopicMap.has(topic2)){
            let parentTopic = uniqueTopicMap.get(topic);
            let topicObject2 = {topicName: topic2, topicId: idCounter, parentId: parentTopic.topicId};
            uniqueTopicMap.set(topic2, topicObject2);
            idCounter++;
            database.collection("topics").insertOne(topicObject2, function(err, res) {
                if (err) throw err;
                console.log("2 document inserted");
            });
        }

        if(!uniqueTopicMap.has(topic3)){
            
            let parentTopic2 = uniqueTopicMap.get(topic2);
            let topicObject3 = {topicName: topic3, topicId: idCounter, parentId: parentTopic2.topicId};
            uniqueTopicMap.set(topic3,topicObject3);
            console.log(topicObject3);
            idCounter++;
            database.collection("topics").insertOne(topicObject3, function(err, res) {
                if (err) throw err;
                console.log("3 document inserted");
            });
        }
    }

    for(let j = 1; j < questionsExcel.length; j++){
        let questionRow = questionsExcel[j];
        let questionId = questionsExcel[j][0];
        let topicIds = [];
        let k =1;
        for(k=1;k<questionRow.length;k++){
            let topicContent = questionRow[k];
            if(topicContent && uniqueTopicMap.has(topicContent)){
                let topicId = uniqueTopicMap.get(topicContent).topicId;
                topicIds.push(topicId);
            }
        }
        let jsonQuestion = {questionNo: questionId,topicIds: topicIds};
        console.log(jsonQuestion);
        database.collection("questions").insertOne(jsonQuestion, function(err, res) {
            if (err) throw err;
            console.log("3 document inserted");
        });
    }
});
}