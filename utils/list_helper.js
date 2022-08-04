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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}