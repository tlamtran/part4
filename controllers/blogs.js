const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')


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
    const user = request.user

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
    const user = request.user
    const blogID = request.params.id

    const blog = await Blog.findById(blogID)
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(blogID)
        user.blogs = user.blogs.filter( blog => blog.toString() !== blogID)
        user.save()
        response.status(204).end()
    }
    else {
        return response.status(401).json({error: 'wrong user, no permission to delete'})
    }
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