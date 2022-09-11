// Importing
const express = require('express');
const { v4: uuidv4 } = require('uuid');



// app config
const app = express();
const server = require('http').Server(app);
app.set('view engine','ejs');
const port = process.env.PORT || 3030 ;


// middleware
// app.use(express.json());
app.use(express.static('public'));



//DB config


// routes
// app.get('/', (req, res) => {
//     res.render('room');
//     res.redirect(`/${uuidv4()}`);

// });

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);

});

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});



// listen
server.listen(port, () => {
    console.log(`App listening on port ${port}! and The server http://localhost:${port}`)
});

// error handler
app.use((err, req, res, next)=> {
    console.log(err)
})