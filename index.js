const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware

app.use(cors());
app.use(express.json());


// database

const uri = `mongodb+srv://${process.env.WEDDING_USER}:${process.env.WEDDING_PASSWORD}@aster.gyayqwe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const asterWeddingCollection = client.db('asterWedding').collection('wedding');


        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = asterWeddingCollection.find(query);
            const services = await cursor.limit(size).toArray();
            res.send(services)
        })
        app.get('/all-services', async (req, res) => {
            const query = {};
            const cursor = asterWeddingCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices)
        })


    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Aster Wedding Server Running')
})

app.listen(port, (req, res) => {
    console.log(`server running on' ${port}`)
})