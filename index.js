// require/ import all essential things

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config()
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

// importing finished here ---
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.jcnea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("travel_land");
        const tourCollections = database.collection("tours");
        const blogsCollections = database.collection("blogs");
        const travelTipsCollections = database.collection("travelTips");
        const allbookings = database.collection("allbookings");
        // console.log("all routes should be working");
        //POST api for services
        app.post('/services', async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await tourCollections.insertOne(newService);
            res.json(result);
        })
        //GET API for services
        app.get('/services', async (req, res) => {
            const all = tourCollections.find({});
            const data = await all.toArray();
            res.send(data);
        })
        // GET API FOR  DYNAMIC
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await tourCollections.findOne(query);
            res.send(data);

        })
        // GET api for blogs
        app.get('/blogs', async (req, res) => {
            const all = blogsCollections.find({});
            const data = await all.toArray();
            res.send(data);
        })
        // GET API for travel tips
        app.get('/tips', async (req, res) => {
            const all = travelTipsCollections.find({});
            const data = await all.toArray();
            res.send(data);

        })
        // POST API for all bookings
        app.post('/allbooks', async (req, res) => {
            const newData = req.body;
            const result = await allbookings.insertOne(newData);

            res.send(result);
        })
        // GET api for all bookings
        // app.get("/allbooks", async (req, res) => {
        //     const all = allbookings.find({ email: "imtiazahmed026@gmail.com" });
        //     const data = await all.toArray();
        //     console.log(data);
        //     res.send(data);
        //     // res.json(count);
        // })
        app.get("/allbooks", async (req, res) => {
            const email = req.query;
            console.log(typeof email);
            console.log("gelo");
            const searchEmail = email.email;
            let all;
            searchEmail === 'false' ?
                all = allbookings.find({})
                :
                all = allbookings.find({ email: searchEmail });
            const data = await all.toArray();
            console.log(data);
            res.send(data);
            // res.json(count);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.err);
//get api
app.get('/hello', (req, res) => {
    res.send("hello");
})
app.get('/', (req, res) => {
    res.send("hello 1");
})



















app.listen(port, () => {
    console.log("hitting the server");
})