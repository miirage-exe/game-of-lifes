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






// Basics =====================

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/home', (req, res) => {
    res.redirect('/')
})

app.get('/workbench', (req, res) => {
    res.render('workbench')
})

app.get('/rules', (req, res) => {
    res.render('rules')
})

app.get('/settings', (req, res) => {
    res.render('settings')
})

// Lobby =====================

app.get('/lobby', (req, res) => {
    res.render('lobby')
})

// Rooms =====================

app.get('/room/join', (req, res) => {
    res.render('room/join')
})

app.get('/room/create', (req, res) => {
    res.render('room/create')
})

app.get('/room/:roomToken', (req, res) => {
    res.render('room/index', {id: req.params.roomToken})
})

// Game =====================

app.get('/game/:gameToken', (req, res) => {
    res.render('game')
})





// Démarre le serveur
server.listen(port, () => {
    console.log('App listening on port ' + port)
})