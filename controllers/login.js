const loginRouter = require('express').Router()
const User = require('../models/User')
const bcryptjs = require('bcryptjs')

loginRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

loginRouter.post('/', async (req, res) => {
    const {username, password, name} = req.body
    
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