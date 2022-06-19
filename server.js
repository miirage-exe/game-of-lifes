require('dotenv').config();

const express = require('express')
const http = require('http')
const port = process.env.PORT
const { randomUUID } = require('crypto');

const app = express()
const server = http.createServer(app)

// Préréglages de l'application
app.use(express.static('public'));
app.set('view engine', 'ejs')
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());



app.get('/', (req, res) => {
    res.render('home')
})

// Démarre le serveur
server.listen(port, () => {
    console.log('App listening on port ' + port)
})