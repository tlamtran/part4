const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    const blogs = helper.initialBlogs
        .map( blog => new Blog(blog))
    const promiseArray = blogs.map( blog => blog.save())
    await Promise.all(promiseArray)
    console.log('saved')
})

test('blogs returned as JSON', async () => {
    console.log('entered test1')
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}) 

test('returned two blogs', async () => {
    console.log('entered test2')
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('correct content', async () => {
    console.log('entered test3')
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe("blog1")
})

afterAll(() => {
    mongoose.connection.close()
})