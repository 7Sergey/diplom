"use strict";

const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const UserModel = require('./models/user.model');

//база данных
mongoose.connect('mongodb://admin:admin1@ds147890.mlab.com:47890/data', {useMongoClient: true});  
mongoose.Promise = require('bluebird');

nunjucks.configure('../client/views', {
    autoescape: true,
    express: app
});

app.use('/assets',express.static('../client/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.render('index.html', { date: new Date() }); 
// });




//создание нового пользователя
app.post('/api/new-user', (req, res) => {
        const data = {
            ...req.body, 
            date: new Date()
           // _id:mongoose.Schema.Types.ObjectId,
        }

        UserModel.create(data)
            .then(users=> res.json(users))
            .catch(err => console.log(err))
        // UserModel.update(req.body,{upsert:true} , err =>{
        //     if(err) return console.error("UserModel", err);
        //         res.json(req.body);   
        // });    
     
});

app.post('/api/login', (req, res) => {
    // const data = {
    //     ...req.body, 
    //     date: new Date()
       
   // }

    UserModel.find({username: req.body.username})
        .then(users=> {
           // res.json(req.body)
           console.log(users[0]);
            if (users[0]  && users[0].password == req.body.password){
                res.json({...users[0]._doc, auth: true});
                
            }else {
                res.json({auth: false, message: 'неправильный пароль'})
            }

        })
        .catch(err => console.log(err))
    // UserModel.update(req.body,{upsert:true} , err =>{
    //     if(err) return console.error("UserModel", err);
    //         res.json(req.body);   
    // });    
 
});

io.on('connection', function (socket) {
    socket.emit('connected', "connected");

    socket.join('all');

    socket.on ('msg', content => {
        console.log('MSG', content);
        const obj = {
            date: new Date(),
            content: content,
            username: socket.id
        };
        socket.emit('message', obj);
        socket.to('all').emit('message', obj);
    });

});

  require('./sockets')(io);


server.listen(7777, '0.0.0.0',() => {
    console.log('Server started on port 7777');
});