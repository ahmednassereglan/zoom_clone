// Importing
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server , {
    debug: true
})

// app config
const port = process.env.PORT || 3030 ;
app.set('view engine','ejs');



// App using
// app.use(express.json());
app.use(express.static('public'));
app.use('/peerjs',peerServer)



//DB config


// routes
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);

});

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room', (roomId , userId) => {
        socket.join(roomId); 
        socket.broadcast.to(roomId).emit('user-connected', userId);
        console.log('a user connected');
        console.log(`Success joined room ${roomId}`);
        socket.on('message' , (message) =>{
            io.to(roomId).emit('createMessage', message);
        })
    })
  });



// listen
server.listen(port, () => {
    console.log(`App listening on port ${port}! and The server http://localhost:${port}`)
});

// error handler
app.use((err, req, res, next)=> {
    console.log(err)
})