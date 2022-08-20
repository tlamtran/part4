const Blog = require('../models/Blog')
const User = require('../models/User')

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
        likes: 2
    },
    {
        title: "blog3",
        author: "author3",
        url: "url3",
        likes: 3
    }
]

const initialUsers = [
    {
        username: "username1",
        password: "password1",
        name: "user1"
    },
    {
        username: "username2",
        password: "password2",
        name: "user2"
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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map( user => user.toJSON())
}

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb,
    nonExistingId
}