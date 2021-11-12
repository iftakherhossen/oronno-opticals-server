const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express()

const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wk6ov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected!')
        const database = client.db('oronnoOpticals');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');

        // GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // GET Single Products API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const productById = await productsCollection.findOne(query);
            res.send(productById);
        })

        // Use POST to get data by keys
        app.post('/products/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } };
            const products = await productsCollection.find(query).toArray();
            res.json(products);
        })

        // GET Limited Products API
        app.get('/limitedProducts', async (req, res) => {
            const cursor = productsCollection.find({});
            const limitedProducts = await cursor.limit(6).toArray();
            res.send(limitedProducts);
        })

        // GET Users API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // POST Users API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET Orders API by Email Address
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const order = await cursor.toArray();
            res.json(order);
        })

        // POST Orders API
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result)
        })

        // DELETE Single Order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // GET Reviews API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // POST Reviews API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result)
        })

        // GET Users API for Admin Role
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     if (user?.role === 'admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin })
        // })

        // Update Users
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result)
        // })

        // PUT & Verify Admin API
        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const requester = user.email;
        //     if (requester) {
        //         const requesterAccount = await usersCollection.findOne({ email: requester })
        //         if (requesterAccount.role === 'admin') {
        //             const filter = { email: user.email };
        //             const updateDoc = { $set: { role: 'admin' } };
        //             const result = await usersCollection.updateOne(filter, updateDoc);
        //             res.json(result);
        //         }
        //     }
        //     else {
        //         res.status(403).json({ message: 'You do not have any access to make an admin!' })
        //     }
        // })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Oronno Opticals Server')
})

app.listen(port, () => {
    console.log('listening to the port', port)
})