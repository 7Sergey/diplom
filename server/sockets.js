"user strict";

const mongoose = require('mongoose');

module.exports = io => {
    io.on('connection', function (socket) {
        socket.on('join lesson', (lesson) => {
            socket.join(lesson._id);
            io.sockets.in(lesson._id).emit('join lesson', `Connected lesson: ${lesson._id}`);
        })
        socket.on('active slide', (lesson, active) => {
            io.sockets.in(lesson._id).emit('active slide', active);
        });
        socket.on('disconnect', () => { console.log('disconnect') });
    });
};