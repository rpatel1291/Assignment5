const bluebird = require("bluebird")
const express = require("express")
const app = express()
const redis = require("redis")
const client = redis.createClient()

const peopleData = require("./data/people")

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const setOperations = [
    {key:"drink", value:"coffee"},
    {key:"food", value:"taco"},
    {key:"cake", value:"lemon"}
]

const makeTestPromise = () => {
    return new Promise((fulfull, reject) => {
        setTimeout(() => {
            fulfull({status:"good"})
        },1000)
    })
}

app.get("/", async(req,res,next) => {
    let cacheHomePageExists = await client.getAsync("homePage")
    
    if(cacheHomePageExists){
        res.send(cacheHomePageExists)
    }else{
        next()
    }
})

app.get("/", async(req, res) => {
    let batchOperation = client.multi()
    setOperations.forEach(op =>{
        batchOperation = batchOperation.set(op.key,op.value)
    })
    let batchResult = await batchOperation.execAsync()
    console.log(batchResult)
    res.json(batchResult)
    let cacheHomePage = await client.setAsync("homePage", JSON.stringify(batchResult))
})

app.listen(3000, () => {
    console.log("Routes running on http://localhost:3000/")
})

/*
const express = require("express")
const bodyParser = require("body-parser")

const redis = require("redis")
const client = redis.createClient()
const cache = require("express-redis-cache")()

const app = express()

const peopleData = require("./data/people")

const bluebird = require("bluebird")
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const {promisify} = require("util")
const getAsync = promisify(client.get).bind(client)

let history
/* -------------------------------------------------------------------------------- 

client.on("connect", ()=>{
    console.log("Connected")
})

/* -------------------------------------------------------------------------------- 

app.use(bodyParser.json())


/* --------------------------------- Routes --------------------------------------- 

// /api/people/history/
app.get('/api/people/history', history=[],async (req,res) => {
    if(history.length === 0){
        res.json({history:history})
    }else{
        last20 = []
        for(let i =0; i<20; i++){
            last20.append(history[-1+i])
        }
        res.json({history:last20})
    }
})


// /api/people/:id
app.get('/api/people/:id', (req,res) => {

    // let personID = parseInt(req.params.id)
    // client.get('history', (err, result) => {
    //     if(!result){
    //         peopleData.getById(personID).then(person => {
    //             client.lpush('history', JSON.stringify(person.toString()))
    //         })
    //         peopleData.getById(personID).then(person =>{
    //             res.json(person)
    //         })
    //     }
    //     else{
    //         client.lrange('history',0,-1,(err, result)=>{
    //             console.log(result)
    //             if(err){
    //                 res.json(err)
    //             }
    //         })
    //     }
    //     if(err){
    //         res.json(err)
    //     }
    // })
    
})


app.listen(3000, () => {
    console.log("Running routes in localhost")
})
*/