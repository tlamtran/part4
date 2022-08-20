const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')
const User = require('../models/User')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    for (const user of helper.initialUsers) {
        await api
            .post('/api/users')
            .send(user)
    }

    const firstUser = await User.findOne({username: 'username1'})
    const blogs = helper.initialBlogs
    for (const blog of blogs) {
        const blogWithUserId = new Blog({...blog, user: firstUser._id})
        await blogWithUserId.save()
        firstUser.blogs = firstUser.blogs.concat(blogWithUserId._id)
        await firstUser.save()
    }  
})

describe('blogs and users already exist in database', () => {
    test('blogs returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }) 

    test('returned 3 blogs', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('returned 2 users', async () => {
        const response = await api.get('/api/users')
        const users = response.body
        expect(users).toHaveLength(helper.initialUsers.length)
    })

    test('first user with 3 blogs and second with 0', async () => {
        const response = await api.get('/api/users')
        const users = response.body

        expect(users[0].blogs).toHaveLength(3)
        expect(users[1].blogs).toHaveLength(0)
    })
    
    test('correct content', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body[0].title).toBe("blog1")
    })
    
    test('every blog has unique id and user id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
    
        blogs.forEach( blog => expect(blog.id).toBeDefined())
        blogs.forEach( blog => expect(blog.user).toBeDefined())
    })
})

describe('adding a new blog post', () => {
    test('adding a new blog with user2, correct length/content', async () => {

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token
        
        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send({
                title: "newBlog",
                author: "newAuthor",
                url: "newURL",
                likes: 0
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/users')
        const users = response.body

        expect(users[1].blogs).toHaveLength(1)
        expect(users[1].blogs[0].title).toBe("newBlog")
    })
    
    test('if created without like property, default=0', async () => {

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token
        
        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send({
                title: "newBlog",
                author: "newAuthor",
                url: "newURL"
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/users')
        const users = response.body

        expect(users[1].blogs[0].likes).toBe(0)
    })
    
    test('400 if missing title and url', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token
        
        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send({
                author: "newAuthor",
                likes: 0
            })
            .expect(400)
    })

    test('401, if token not provided', async () => {
        const token = ''

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send({
                title: "newBlog",
                author: "newAuthor",
                url: "newURL",
                likes: 0
            })
            .expect(401)
    })
})

describe('deleting blog', () => {
    test('204 one less blogs', async () => {

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: "username1",
                password: "password1"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token

        const blogToDelete = await Blog.findOne({title: "blog3"})
        const usersBeforeDelete = await helper.usersInDb()
        console.log(usersBeforeDelete[0])
        
        await api 
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'bearer ' + token)
            .expect(204)

        const usersAfterDelete = await helper.usersInDb()
        console.log(usersAfterDelete[0])
        expect(usersAfterDelete[0].blogs).toHaveLength(2)
    })

    test('deleted blog id doesnt exist anymore', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({
                username: "username1",
                password: "password1"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token

        const blogToDelete = await Blog.findOne({title: "blog3"})
        const usersBeforeDelete = await helper.usersInDb()
        console.log(usersBeforeDelete[0])
        
        await api 
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'bearer ' + token)
            .expect(204)
        
        const usersAfterDelete = await helper.usersInDb()
        const ids = usersAfterDelete[0].blogs.map( blog => blog.toString())
        
        expect(ids).not.toContain(blogToDelete.id)
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