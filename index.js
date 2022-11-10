const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const asterWeddingCollection = client.db('asterWedding').collection('wedding')
        const reviewCollection = client.db('asterReview').collection('reviews')

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
        app.get('/section-two', async (req, res) => {
            const query = {};
            const cursor = asterWeddingCollection.find(query);
            const sectionTwo = await cursor.toArray();
            res.send(sectionTwo)
        })

        app.get('/service-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const details = await asterWeddingCollection.findOne(query);
            res.send(details)
        })

        app.get('/review', async (req, res) => {
            console.log(req.query.reviewId)
            let query = {};
            if (req.query.reviewId) {
                query = {
                    reviewId: req.query.reviewId
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        app.get('/my-review', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const myReview = await cursor.toArray();
            res.send(myReview);
        })

        // delete review
        app.delete('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })

        // add service
        app.post('/add-services', async (req, res) => {
            const wedding = req.body;
            const result = await asterWeddingCollection.insertOne(wedding)
            res.send(result)
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