const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    else return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({username: 'usernames'})
        .populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const token = getTokenFrom(request)
    const verifiedToken = jwt.verify(token, process.env.SECRET)
    if (!verifiedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(verifiedToken.id)

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        user: user._id,
        likes: body.likes 
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true})
    response.json(updatedBlog)
})


module.exports = blogsRouter