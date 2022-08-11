const loginRouter = require('express').Router()
const User = require('../models/User')
const bcryptjs = require('bcryptjs')

loginRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('blogs', {title: 1, author: 1, url: 1, id: 1})
    res.json(users)
})

loginRouter.post('/', async (req, res) => {
    const {username, password, name} = req.body
    
    if (!password || password.length < 3) {
        return res.status(400).send({error: 'password min length 3'})
    }
    const existingUsername = await User.findOne({username})
    if (existingUsername) {
        return res.status(400).json({error: 'username must be unique'})
    }
    
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = loginRouter