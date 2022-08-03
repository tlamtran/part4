const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {

    test('of empty list is zero', () => {
        const blogs = []
        const result = totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('when list has one blog i.e. total likes equals the likes of that', () => {
        const blogs = [
            {
                title: "TEST",
                author: "DaVinci",
                url: "http://test",
                likes: 10,
                id: "62e7eda433fc1ff07668f095"
            }
        ]
        const result = totalLikes(blogs)
        expect(result).toBe(10)
    })


    test('of a bigger is list calculated right', () => {
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
            }
        ]
        const result = totalLikes(blogs)
        expect(result).toBe(15)
    })
})