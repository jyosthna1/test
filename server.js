const express = require("express");
const dotEnv = require("dotenv");

const {MongoClient} = require("mongodb")

const app = express();

dotEnv.config()

MongoClient.connect(process.env.MONGO_URL)

.then(() =>{
    console.log("MongoDB Connected Successfully")
})
.catch((error)=>{
    console.log("Error",error)
})
const port = 5173

app.listen(port, () =>{
    console.log(`server started and running at ${port}`)
})

