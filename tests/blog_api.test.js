const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
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

test('created a new blog post', async () => {
    const newBlog = {
        title: "newBlog",
        author: "newAuthor",
        url: "newURL",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs[2].title).toBe("newBlog")
})

test('if created without like property, default=0', async () => {
    const newBlog = {
        title: "newBlog",
        author: "newAuthor",
        url: "newURL"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs[2].likes).toBe(0)
})

test('400 if missing title and url', async () => {
    const newBlog = {
        author: "newAuthor",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})