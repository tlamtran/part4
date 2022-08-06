const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
        .map( blog => new Blog(blog))
    const promiseArray = blogs.map( blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}) 

test('returned two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('correct content', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe("blog1")
})

test('every blog has unique id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
    blogs.forEach( blog => expect(blog.id).toBeDefined())
})

afterAll(() => {
    mongoose.connection.close()
})