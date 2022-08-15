const express = require('express')
// const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users',  async (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const room = req.body.room
    
    res.redirect(`chat.html?username=${username}&room=${room}`)
})

module.exports = router