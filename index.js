const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


console.log(process.env.DB_PASS)


// middleWare//
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgorb8t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const serviceCollection = client.db('categorydata').collection('toysData');
        const AddCollection = client.db('categorydata').collection('addedToy');


        app.get('/category', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AddCollection.findOne(query);
            res.send(result);
        })
        app.get('/addedToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AddCollection.findOne(query);
            res.send(result);
        })

        app.get('/addedToy', async (req, res) => {
            const result = await AddCollection.find().limit(20).toArray();
            res.send(result);
        })

        app.get('/toy', async (req, res) => {
            console.log(req.query.email);

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await AddCollection.find(query).toArray();
            res.send(result);
        })


        // app.patch('/toy/:id', async (req, res) => {
        //     const updatedToy = req.body;
        //     console.log(updatedToy)
        // })
        app.put('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const UpdatedToy = req.body;
            const Toy = {
                $set: {
                    email: UpdatedToy.email, name: UpdatedToy.name, SellerName: UpdatedToy.SellerName, SubCategory: UpdatedToy.SubCategory, price: UpdatedToy.price, ratings: UpdatedToy.ratings, AvailableQuantity: UpdatedToy.AvailableQuantity, Description: UpdatedToy.Description, pictureUrl: UpdatedToy.pictureUrl
                }
            }
            const result = await AddCollection.updateOne(filter, Toy, options);
            res.send(result)
        })


        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AddCollection.deleteOne(query);
            res.send(result);
        })

        // addedToys//
        app.post('/addedToy', async (req, res) => {
            const added = req.body;
            console.log(added);
            const result = await AddCollection.insertOne(added);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Doll House Server Is running')
})

app.listen(port, () => {
    console.log(`Doll House Server Is running on ${port}`)
})