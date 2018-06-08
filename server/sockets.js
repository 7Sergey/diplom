"user strict";

const MessageModel = require('./models/messages.model');
const mongoose = require('mongoose');

module.exports = io => {
    io.on('connection', function (socket) {
        socket.emit('connected', "you connected");
    
        socket.join('all');
    
        socket.on ('msg', content => {
           const obj = {
     //           _id:mongoose.Schema.Types.ObjectId,
                date: new Date(),
                content: content,
                username: socket.id
            };

            MessageModel.create(obj, err =>{
                if(err) return console.error("MessageModel", err);

                socket.emit('message', obj);
                socket.to('all').emit('message', obj);
            });    
        });   

        //история
        // socket.on('receiveHistory', () => {
        //     MessageModel
        //         .find{()}
        //         .sort({date: -1})
        //         .limit(50)
        //         .sort({date: 1})
        //         .lean()
        //         .exec( (err, messages) => {
        //             if (!err) {
        //                 socket.emit('history', messages);
        //                 socket.to('all').emit('history', messages);
        //             }
        //         })
        // })
    });
};