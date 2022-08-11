const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/User')
const { application } = require('express')

const api = supertest(app)

beforeEach( async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('creating invalid user', () => {
    test('invalid username', async () => {
        const newUser = {
            username: "us",
            password: "password",
            name: "newUser"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('minimum allowed length (3)')
        const userDbAfter = await helper.usersInDb()
        expect(userDbAfter).toHaveLength(helper.initialUsers.length)
    })

    test('username not unique', async () => {
        const newUser = {
            username: helper.initialUsers[0].username,
            password: "password",
            name: "newUser"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/) 

        expect(response.body.error).toContain('username must be unique')
    })
    
    test('invalid password', async () => {
        const newUser = {
            username: "username",
            password: "pa",
            name: "newUser"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('password min length 3')
    })
})

afterAll( () => {
    mongoose.connection.close()
})