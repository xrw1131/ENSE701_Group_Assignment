const express = require('express')
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser:dbUser@cluster0.kwhhqy3.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const dbName = "ENSE";
// connect to mongodb and test whether it functions well
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("ENSE").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);
//Server Setting

const app = express()
app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({extended: true}));
var server = app.listen(3000, function () {
    // var host = server.address().address
    // var port = server.address().port
    // console.log("http://", host, port)
    console.log('Server running at http://127.0.0.1:3000/');
})
module.exports = app


app.post("/insertNewPaper", function (req, res) {
    console.log(req.body)

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db("ENSE");
            // Reference the "people" collection in the specified database
            const col = db.collection("newAddDocument");
            // Create a new document
            let personDocument = {
                "authors": req.body.authors,
                "doi": req.body.doi,
                "jName": req.body.jName,
                "number": req.body.number,
                "pages": req.body.pages,
                "title": req.body.title,
                "volume": req.body.volume,
                "yop": req.body.yop

            }
            // Insert the document into the specified collection
            const p = await col.insertOne(personDocument);
            // Find and return the document
            const filter = {"title": req.body.title};
            const document = await col.findOne(filter);
            console.log("Document found:\n" + JSON.stringify(document));
        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
    res.end('200');

});

app.get("/test",function (req, res){
    console.log(req.body)
    res.end('200');
})
