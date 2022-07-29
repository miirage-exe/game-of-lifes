require('dotenv').config();

const express = require('express')
const http = require('http')
const port = process.env.PORT
const session = require('express-session')
const webSocket = require('./middlewares/webSocket.js')
const { randomUUID } = require('crypto');

const userSession = require('./instances/userSession.js');

const app = express()
const server = http.createServer(app)

// Préréglages de l'application
app.use(express.static('public'));
app.set('view engine', 'ejs')
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Sessions ===================

// Session

const sessionMiddleware = session({
    secret: randomUUID(),
    saveUninitialized: true,
    resave: true,
    extended: true,
    cookie: { secure: false }
})
app.use(sessionMiddleware)

// connect middleware to a Socket.IO middleware
webSocket.use({'server': server, 'session': sessionMiddleware})

require('./components/rooms/room.launcher.js')



// Routes ====================================================================



// Basics =====================
// GET /
app.get('/', (req, res) => {
    res.render('home')
})

// GET /portal
app.get('/portal', (req, res) => {
    res.render('portal')
})

// POST /portal
app.post('/portal', (req, res) => {

    req.session._user? undefined : req.session._user = new userSession()

    res.redirect('/lobby')
})

// GET /home
app.get('/home', (req, res) => {
    res.redirect('/')
})

// GET /workbench
app.get('/workbench', (req, res) => {
    res.render('workbench')
})

// GET /rules
app.get('/rules', (req, res) => {
    res.render('rules')
})

// GET /settings
app.get('/settings', (req, res) => {
    res.render('settings')
})





// Lobby =====================
// GET /lobby
app.get('/lobby', (req, res) => {
    res.render('lobby')
})





// Rooms =====================
// GET /room/join
app.get('/room/join', (req, res) => {
    res.render('room/join')
})

// POST /room/join
app.post('/room/join', (req, res) => {
    if(!req.session._user){
        res.redirect('/portal')
    } else if(!req.body.token){
        res.render('room/join')
    } else {
        res.redirect(`/room/${req.body.token}`)
    }
})

// GET /room/create
app.get('/room/create', (req, res) => {
    res.render('room/create')
})

// GET /room/:token
app.get('/room/:roomToken', (req, res) => {
    if (!req.session._user){
        res.redirect('/portal')
    } else {
        res.render('room/index', {id: req.params.roomToken})
    }
    
})





// Game =====================

app.get('/game/:gameToken', (req, res) => {
    res.render('game')
})





// Démarre le serveur
server.listen(port, () => {
    console.log('App listening on port ' + port)
})