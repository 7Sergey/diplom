"use strict";

const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const server = require('http').Server(app);
const io = require('socket.io')(server, { serveClient: true });
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserModel = require('./models/user.model');
const LessonsModel = require('./models/lessons.model');
const PresentationModel = require('./models/presentation.mode');
const cookieSession = require('cookie-session');

//база данных
mongoose.connect('mongodb://admin:admin1@ds147890.mlab.com:47890/data', { useMongoClient: true });
mongoose.Promise = require('bluebird');

nunjucks.configure('../client/views', {
    autoescape: true,
    express: app
});

app.use('/assets', express.static('../client/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'session',
    keys: ['keyasxasxasx1'], 
    maxAge: 86400000
  }));

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
        .then(users => res.json(users))
        .catch(err => console.log(err))
    // UserModel.update(req.body,{upsert:true} , err =>{
    //     if(err) return console.error("UserModel", err);
    //         res.json(req.body);   
    // });    

});

app.get('/session', function (req, res) {
    if(req.session.user) {
        res.json({ auth: true, ...req.session.user });
    } else {
        res.json({ auth: false });
    }
});

app.get('/logout', function (req, res) {
    req.session.user = null;
    res.json({ auth: false });
});

app.post('/api/login', (req, res) => {
    UserModel.find({ username: req.body.username })
        .then(users => {
            if (users[0]) {
                if (users[0].password == req.body.password) {
                    req.session.user = users[0]._doc;
                    res.json({ ...users[0]._doc, auth: true });
                } else {
                    res.json({ auth: false, message: 'неправильный пароль' })
                }
            } else {
                const newUser = new UserModel(req.body).save();
                return newUser.then(user => {
                    console.log(user)
                    res.json({ auth: true, ...user });
                });
            }
        })
        .catch(err => console.log(err));
});

app.post('/new-presentation', (req, res) => {
    const newPres = new PresentationModel(req.body).save();
    return newPres.then(newPres => {
        res.json({ ...newPres });
    });
});

app.post('/user-presentation', (req, res) => {
    console.log(req.body);
    PresentationModel.find({ userId: req.body._id })
    .then(pres => {
        res.json(pres);
    })
    .catch(err => console.log(err));
});


app.post('/user-lesson', (req, res) => { 
    LessonsModel.find(req.body)
    .then(less => {
        res.json(less);
    })
    .catch(err => console.log(err));
});

app.post('/new-user-lesson', (req, res) => { 
    LessonsModel.update({_id: req.body._id }, {$addToSet: {users: req.body.userId }})
        .then(less => {
            res.json(less);
        })
        .catch(err => console.log(err));
});

app.post('/new-lesson', (req, res) => {
    const newLess = new LessonsModel(req.body).save();
    return newLess.then(newLess => {
        res.json({ ...newLess });
    });
});

app.post('/save-presentation', (req, res) => {
    PresentationModel.update({ _id: req.body._id }, { slides: req.body.slides })
        .then(pres =>  { console.log(pres); })
        .catch(err => Promise.reject({ err }))
});

app.post('/remove-presentation', (req, res) => {
    PresentationModel.findByIdAndRemove(req.body._id).then(pres => res.json(pres));
});

app.post('/get-lesson', (req, res) => {
    LessonsModel.find({ _id: req.body._id })
    .then(less => {
        if(less[0]) {
            res.json(less[0]);
        }
    })
    .catch(err => console.log(err));
});

app.post('/get-presentation', (req, res) => {
    console.log(req.body)
    PresentationModel.find({ _id: req.body._id })
    .then(pres => {
        console.log(pres)
        if(pres[0]) {
            res.json(pres[0]);
        }
    })
    .catch(err => console.log(err));
});

io.on('connection', function (socket) {
    socket.emit('connected', "connected");

    socket.join('all');

    socket.on('msg', content => {
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


server.listen(7777, '0.0.0.0', () => {
    console.log('Server started on port 7777');
});