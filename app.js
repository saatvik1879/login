const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const userRoutes = require('./Routers/users')

mongoose.connect('mongodb+srv://saatvik1879:'+process.env.MONGO_ATLAS_PW+'@cluster0.ben46ro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users',userRoutes);

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500).json({
        error:{
            message:error.message
        }
    });
})

module.exports = app;