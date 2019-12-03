const path = require('path'); //construct paths in a way htats safe to run on any operation system
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const userRoutes = require('./routes/users');
const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://heroku_nk4gm6kg:snk334ghp7a5ucfckp0b720fif@ds349618.mlab.com:49618/heroku_nk4gm6kg", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
    .then(()=>{
        console.log('Connected to Database!');
    })
    .catch(()=>{
        console.log('Connection failed!');
    });
app.use(bodyParser.json());

app.use((req,res,next)=>{

    res.setHeader('X-Auth-Token', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin,X-Requested-With, Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});




app.use('/api/user',userRoutes);
app.use('/', express.static(path.join(__dirname,'..','dist')));
app.use((request, response) => {
	response.sendFile(path.join(__dirname,'..', 'dist', 'index.html'));
});
// app.get('*', (request, response) => {
// 	response.sendFile(path.join(__dirname,'..', 'dist/pos', 'index.html'));
// });

module.exports = app;
