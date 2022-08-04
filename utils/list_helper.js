const dummy = (blogs) => {
    return(1)
}

const totalLikes = (blogs) => {
    return(
        blogs.map( blog => blog.likes)
             .reduce( (x, y) => x + y, 0)
    )
}

const favoriteBlog = (blogs) => {
    if (blogs.length >= 1) {
        return blogs.reduce( (x, y) => x.likes >= y.likes ? x : y)
    }
    else return null
}

const mostBlogs = (blogs) => {
    const blogsSortedByAuthor = blogs.sort( (a, b) => a.author.localeCompare(b.author) ) 

    if (blogs.length > 1) {
        let authorMostBlogs = ''
        let numberOfBlogs = 0

        let memoryAuthor = blogs[0].author
        let memoryBlog = 0
        blogsSortedByAuthor.forEach( blog => {
            if (blog.author === memoryAuthor) memoryBlog += 1
            else { // 2 1 3
                memoryAuthor = blog.author
                memoryBlog = 1
            }
            if (memoryBlog > numberOfBlogs) {
                authorMostBlogs = memoryAuthor
                numberOfBlogs = memoryBlog
            }
        })

        return(
            {
                author: authorMostBlogs,
                blogs: numberOfBlogs
            }
        )
    } 
    else if (blogs.length === 1) {
        return(
            {
                author: blogs[0].author,
                blogs: 1
            }
        )
    }
    else return null
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}