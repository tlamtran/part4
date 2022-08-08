const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('blogs already exist in database', () => {
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
})

describe('creating a new blog post', () => {
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
})

describe('deleting blog', () => {
    test('204 one less blogs', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[1]

        await api 
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAfterDelete = await helper.blogsInDb()
        expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('deleted blog doesnt exist anymore', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[1]
        
        await api 
            .delete(`/api/blogs/${blogToDelete.id}`)
        
        const blogsAfterDelete = await helper.blogsInDb()
        const titlesRemaining = blogsAfterDelete.map( blog => blog.title)
        expect(titlesRemaining).not.toContain(blogToDelete.title)
    })
})

describe('updating a blog', () => {
    test('same length and id', async () => {
        const blogs = await helper.blogsInDb()
        const blogsID = blogs.map( b => b.id)
        const blogToBeUpdated = blogs[0]

        const updatedCopy = {...blogToBeUpdated, likes: 999}

        await api
            .put(`/api/blogs/${blogToBeUpdated.id}`)
            .send(updatedCopy)
            .expect(200)

        const blogsAfterUpdate = await helper.blogsInDb()
        const blogsAfterUpdateID = blogsAfterUpdate.map(b => b.id)
        expect(blogsAfterUpdate).toHaveLength(blogs.length)
        expect(blogsAfterUpdateID).toEqual(blogsID)
        
    })

    test('likes have changed correctly', async () => {
        const blogs = await helper.blogsInDb()
        const blogToBeUpdated = blogs[0]

        const updatedCopy = {...blogToBeUpdated, likes: 999}

        await api
            .put(`/api/blogs/${blogToBeUpdated.id}`)
            .send(updatedCopy)
            .expect(200)

        const blogsAfterUpdate = await helper.blogsInDb()
        const updatedBlog = blogsAfterUpdate[0]
        expect(updatedBlog.title).toBe('blog1')
        expect(updatedBlog.likes).toBe(999)
    })
})

afterAll(() => {
    mongoose.connection.close()
})