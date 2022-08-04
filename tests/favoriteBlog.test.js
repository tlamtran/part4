const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favorite blog', () => {

    test('empty list of blogs', () => {
        const blogs = []
        const result = favoriteBlog(blogs)
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
        const result = favoriteBlog(blogs)
        expect(result).toEqual(blogs[0])
          
    })

    test('multiple blogs', () => {
        const blogs = [
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
                title: "favorite",
                author: "blog",
                url: "http://abc.com",
                likes: 50,
                id: "asosfhouishgoheowojfnwaoi"
            }
        ]
        const result = favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])

    })
})