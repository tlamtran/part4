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
        let authorMostLikes = ''
        let numberOfLikes = 0

        let memoryAuthor = blogs[0].author
        let memoryLikes = 0
        blogsSortedByAuthor.forEach( blog => {
            if (blog.author === memoryAuthor) memoryLikes += 1
            else { // 2 1 3
                memoryAuthor = blog.author
                memoryLikes = 1
            }
            if (memoryLikes > numberOfLikes) {
                authorMostLikes = memoryAuthor
                numberOfLikes = memoryLikes
            }
        })

        return(
            {
                author: authorMostLikes,
                blogs: numberOfLikes
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

const mostLikes = (blogs) => {
    const blogsSortedByAuthor = blogs.sort( (a, b) => a.author.localeCompare(b.author) ) 

    if (blogs.length > 1) {
        let authorMostLikes = ''
        let numberOfLikes = 0

        let memoryAuthor = blogs[0].author
        let memoryLikes = 0
        blogsSortedByAuthor.forEach( blog => {
            if (blog.author === memoryAuthor) memoryLikes += blog.likes
            else {
                memoryAuthor = blog.author
                memoryLikes = blog.likes
            }
            if (memoryLikes > numberOfLikes) {
                authorMostLikes = memoryAuthor
                numberOfLikes = memoryLikes
            }
        })

        return(
            {
                author: authorMostLikes,
                likes: numberOfLikes
            }
        )
    } 
    else if (blogs.length === 1) {
        return(
            {
                author: blogs[0].author,
                likes: blogs[0].likes
            }
        )
    }
    else return null
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}