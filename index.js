const express = require('express');
const mongoose = require('mongoose');
const generateModel = require('./generateModel');
const generateController = require('./generateController');
require('colors');
// const User = require('./model/user.model');
const { notFound, errorHandler } = require('./generators/bobby');
mongoose.connect('mongodb://localhost:27017/bobby', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },()=>console.log('db connected'.yellow));
  
const app = express()
app.use(express.json());


app.use('/project',require('./routes/projects.route'))
// app.use('/user',require('./routes/user.route'))

app.post('/micro',async (req,res)=>{
    generateModel(req)
    generateController(req)
    res.status(201).json(req.body)
})


app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3600;
app.listen( 3600 ,() => {
    console.log(`app is running on port ${PORT}`.blue.bold);
})