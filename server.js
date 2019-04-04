const express = require("express")
const bodyParser = require("body-parser")

const redis = require("redis")
const client = redis.createClient()
const bluebird = require("bluebird")

const app = express()

const peopleData = require("./data/people")

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

/* -------------------------------------------------------------------------------- */

client.on("error", (err)=>{
    console.log("Error "+ err)
})

/* -------------------------------------------------------------------------------- */

app.use(bodyParser.json())


/* --------------------------------- Routes --------------------------------------- */
app.get('/', (req,res) => {
    res.json({page:`loading route '/' `})
})

app.get('/api/people/history', (req,res) => {

    /**  Will return array of last 20 users in cache from recently viewed list **/
    /**  Will return user information **/
    
    let people = peopleData.returnPeopleData()
    res.json(people) 
    
})

app.get('/api/people/:id', (req,res) => { 
    let personID = req.params.id 
})


app.listen(3000, () => {
    console.log("Running routes in localhost")
})