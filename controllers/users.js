const userRouter = require('express').Router()
const User = require('../models/User')
const bcryptjs = require('bcryptjs')

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {title: 1, author: 1, url: 1, id: 1, likes: 1})
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const {username, password, name} = request.body
    
    if (!password || password.length < 3) {
        return response.status(400).send({error: 'password min length 3'})
    }
    const existingUsername = await User.findOne({username})
    if (existingUsername) {
        return response.status(400).json({error: 'username must be unique'})
    }
    
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter