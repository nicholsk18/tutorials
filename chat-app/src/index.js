const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const userRouter = require('./routers/user')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(userRouter)

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // connect room
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome'))
        // socket.broadcast.to.emit -> send to everyone but to specific client and only to specific room
        socket.broadcast.to(user.room).emit("message", generateMessage('Admin', `${user.username} has joined!`))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


        callback()

        // io.to.emit -> emits event to everyone in specific room

    })

    socket.on('sendMsg', (msg, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter()
        
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

        // sends it to everyone
        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    // sends location to users
    socket.on('sendLocation', (cords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    // for when user disconects send to all
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})