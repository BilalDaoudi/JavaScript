const express = require("express")
const jwt = require('jsonwebtoken')
const app = express()
const fs = require('fs')
let cert = fs.readFileSync('fich.key')

app.get('/api',(req,res)=>{
    res.json({
        message : 'SALAM'
    })
})


app.listen('90',()=> console.log('connect with port 90 ...'))

app.post('/api/login',(req,res)=>{
    const user = {
        id : 1,
        username : 'admin',
        password : '1234567890'
    }
    jwt.sign({user},cert,(err,token)=>{
        if (err){
            res.json({
                message : 'erreur token !!!!!'
            })
        }
        res.json({
            token
        })
    })
})

app.post('/api/post',verifyToken,(req,res)=>{
    jwt.verify(req.token,cert,(err,Data)=>{
        if(err){
            res.sendStatus(403)
        }
        res.json({
            message:'post crea',
            Data
        })
    })
})

function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token = token
        next()

    }
    else{
        res.sendStatus(403)
    }
}