const express = require("express")
const mysql = require("mysql")
const jwt = require("jsonwebtoken")

const privateKey = "TUGASSOA"

const pool = mysql.createPool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
})

function executeQuery(query){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, conn
        ){
            if(err){
                reject(err)
            }else{
                conn.query(query, function(err, result){
                    conn.release()
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            }
        })
    })
}

app.get('/', function(req,res){
    return res.status(200).send("Hello Success Cloud Run")
})

app.get('/sme', async function(req,res){
    const sme = await executeQuery()
})

const app = express()
app.use(express.urlencoded({extended:true}))

const port=8080;
app.listen(port, function(){
    console.log(`listening on port ${port}`)
})