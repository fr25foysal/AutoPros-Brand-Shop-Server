const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5001

// Midlewares
app.use(express.json())
app.use(cors({
  methods: [
    'GET','POST',' PUT', 'OPTIONS','DELETE','PATCH'
  ],
  origin: '*',
  credentials: true
}))

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
  
const brandCollection =client.db('autopros').collection('brands')
const carsCollection = client.db('autopros').collection('cars')
const slidersCollection = client.db('autopros').collection('sliders')
const cartCollection = client.db('autopros').collection('cart')


async function run() {
  try {
    
//  await client.connect();
// get collection from db

    app.get('/brands', async(req,res)=>{
      const brands =await brandCollection.find().toArray()
      res.send(brands)
    })

    app.post('/cars', async(req,res)=>{
      const carData = req.body
      const result =await carsCollection.insertOne(carData)
      res.send(result)
    })

    // Update Product
    app.put('/cars/:name',async(req,res)=>{
      const name = req.params.name 
      const data = req.body
      const filter = {'name' : name}
      const options = {upsert: true}
      const updatedDate = {
        $set:{
          "brand": data.brand,
          "image": data.image,
          "name": data.name,
          "price": data.price,
          "type": data.type,
          "rating": data.rating
        }
      }
      
      const result = await carsCollection.updateOne(filter,updatedDate,options)
      res.send(result) 
    })
// BrandWise Products
    app.get('/:name',async(req,res)=>{
      const name = req.params.name
      const filter = { 'brand' : name }
      const result = await carsCollection.find(filter).toArray()
      res.send(result)
    })

//Brand sliders
    app.get('/sliders/:name',async(req,res)=>{
      const name = req.params.name
      const query = { 'brand' : name }
      // console.log('test');
      const result = await slidersCollection.find({'brand' : `${name}`}).toArray()
      res.send(result)
    })

    // get single data 
    app.get('/:brand/:name',async(req,res)=>{
      const brand = req.params.brand
      const name = req.params.name
      const brandFilter = { 'brand' : brand }
      const filteredBrand = await carsCollection.find(brandFilter).toArray()
      const result = filteredBrand.find(p=> p.name === name)
      res.send(result)

    })

    // Cart Post 
    app.post('/cart',async(req,res)=>{
      const product = req.body
      const result = await cartCollection.insertOne(product)
      res.send(result)
    })

    // ----------------------Stop Here---------------------------------//


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Run app on Port
app.listen(port)
