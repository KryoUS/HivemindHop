const express = require('express');
// const https = require('https'); //This will be needed later if Blizzard logins are to be used
const app = express();
const server = require('http').createServer(app); 
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

//Body Parser and Cors for API
app.use( bodyParser.json() );
app.use( cors() );

//Socket.IO
const io = require('socket.io')(server);
//Socket Connection to being heartbeat to front-end
//TODO Moved to an API call. (Think http://discord.gg/pZjmFUzu1fGr28kUAAAD)
io.on('connection', (socket) => {
    console.log('A User Connected');
    let roomID = '';
    let inRoom = false;

    //Update Learning for passing information in a room versus solo
    socket.on('updateState', data => {
        inRoom === false && socket.emit('updateState', data);
        inRoom === true && io.to(`/${roomID}`).emit('updateState', data);
    });

    //Listener for Creating/Joining a Room through Socket
    socket.on('enterRoom', roomName => {
        console.log(`Creating Room: ${roomName}`)
        socket.join(`/${roomName}`, () => {
            console.log(`Joining Room: ${roomName}`);
            inRoom = true;
            roomID = roomName;
            let members = io.sockets.adapter.rooms[`/${roomName}`].sockets;
            //Send members of room to front-end as an array
            io.to(`/${roomName}`).emit('members', Object.keys(members));
        });
    })

    //Listener for a user Leaving the room
    socket.on('leaveRoom', roomName => {
        //Inform members of the room that a user is about to leave
        io.to(`/${roomName}`).emit('removeMember', socket.id);
        //Leave the room. (This will default the user back to the default room "/")
        socket.leave(`/${roomName}`);
    })

    //Listener for when the user disconnects from the server so Socket stops the hearbeat to front-end
    socket.on('disconnect', () => {
        console.log('A User Disconnected');
    });
});

//Set port and begin server
let port = process.env.PORT || 3060;
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});