const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5001

// Midlewares
app.use(express.json())
app.use(cors())

// Ping the app
app.get('/',(req,res)=>{
    res.send('Backend Ping Succesful after deploy')
    console.log('Backend Ping Succesful');
})

// mongo 



const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@cluster0.thkxg3l.mongodb.net/?retryWrites=true&w=majority`;

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
    
    await client.connect();
// get collection from db
const brandCollection =client.db('autopros').collection('brands')
const carsCollection = client.db('autopros').collection('cars')

    app.get('/brands', async(req,res)=>{
      const brands =await brandCollection.find().toArray()
      res.send(brands)
    })

    app.post('/cars', async(req,res)=>{
      const carData = req.body
      const result =await carsCollection.insertOne(carData)
      res.send(result)
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


// Run app on Port
app.listen(port)
