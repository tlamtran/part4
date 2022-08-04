const mostBlogs = require('../utils/list_helper').mostBlogs

describe('author with most blogs', () => {
    test('empty list', () => {
        const blogs = []
        const result = mostBlogs(blogs)
        expect(result).toBe(null)
    })

    test('one blog in list', () => {
        const blogs = [
            {
                title: "TEST",
                author: "DaVinci",
                url: "http://test",
                likes: 10,
                id: "62e7eda433fc1ff07668f095"
            }
        ]
        const result = mostBlogs(blogs)
        expect(result).toEqual(
            {
                author: "DaVinci",
                blogs: 1
            }
        )
    })

    test('multiple blogs', () => {
        const blogs = [ // 3 davinci, 1 ling, 4 most 
            {
                title: "TEST",
                author: "DaVinci",
                url: "http://test",
                likes: 10,
                id: "62e7eda433fc1ff07668f095"
            },
            {
                title: "MING",
                author: "LING",
                url: "http://CCP.COM",
                likes: 5,
                id: "abaslklmvkasmpadpawdjpj"
            },
            {
                title: "TEST",
                author: "DaVinci",
                url: "http://test",
                likes: 10,
                id: "62e7eda433fc1ff07668f095"
            },
            {
                title: "TEST",
                author: "DaVinci",
                url: "http://test",
                likes: 10,
                id: "62e7eda433fc1ff07668f095"
            },
            {
                title: "most",
                author: "most",
                url: "url.com",
                likes: 1,
                id: "aspidfjoianwoinwoef"
            },
            {
                title: "most",
                author: "most",
                url: "url.com",
                likes: 1,
                id: "aspidfjoianwoinwoef"
            },
            {
                title: "most",
                author: "most",
                url: "url.com",
                likes: 1,
                id: "aspidfjoianwoinwoef"
            },
            {
                title: "most",
                author: "most",
                url: "url.com",
                likes: 1,
                id: "aspidfjoianwoinwoef"
            }
        ]
        const result = mostBlogs(blogs)
        expect(result).toEqual(
            {
                author: "most",
                blogs: 4
            }
        )
    })
})