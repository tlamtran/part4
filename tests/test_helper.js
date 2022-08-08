const Blog = require('../models/Blog')

const initialBlogs = [
    {
        title: "blog1",
        author: "author1",
        url: "url1",
        likes: 1
    },
    {
        title: "blog2",
        author: "author2",
        url: "url2",
        likes: 3
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: "willBeRemoved",
        author: "willBeRemoved",
        url: "willBeRemoved",
        likes: 0
    })

    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map( blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    nonExistingId
}