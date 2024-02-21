const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
  
app.use(express.json());

console.log(process.env.DB_USER)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eogwfq1.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASS)}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;


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
   

     const clothesCollection = client.db("fashionFusion").collection("clothes");
     const cartCollection = client.db("fashionFusion").collection("cart");



  app.get('/clothes', async (req, res) => {
    const result = await clothesCollection.find().toArray();
    res.send(result);
  });




  app.post('/clothes', async (req, res) => {
    const item = req.body;
    const result = await clothesCollection.insertOne(item);
    res.send(result);
  });

  app.get('/clothes/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await clothesCollection.findOne(query);
    res.send(result);
  })


  app.post('/cart', async (req, res) => {
      
    const cartItem = req.body;
    console.log(cartItem)
    const result = await cartCollection.insertOne(cartItem);
  
    res.send(result);
  });


  app.get('/cart', async (req, res) => {
    const cursor = cartCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  });
  


 
  app.put('/clothes/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updateProduct = req.body;

    const product = {
      $set: {
        image: updateProduct.image,
        name: updateProduct.name,
        brandName: updateProduct.brandName,
        price: updateProduct.price,
        type: updateProduct.type,
        rating: updateProduct.rating,
        description: updateProduct.description
      }
    }

    const result = await clothesCollection.updateOne(filter, product, options);
    res.send(result);
  })


     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  

  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('FashionFusion is connecting')
})

app.listen(port, () => {
  console.log(`Fashion Fusion is sitting on port ${port}`);
})