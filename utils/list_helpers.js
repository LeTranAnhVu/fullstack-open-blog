const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => blogs.reduce((acc, blog) => acc + parseInt(blog.likes), 0)

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => {
    if (!max) {
      return blog
    }
    if (max.likes < blog.likes) {
      return blog
    }
    return max
  }, null)
}

const mostBlogs = (blogs) => {
  const obj = blogs.reduce((arr, blog) => {
    const authorIndex = _.findIndex(arr, o => o.author === blog.author)
    if (arr.length == 0 || authorIndex === -1) {
      arr.push({author: blog.author, blogs: 1})
    } else {
      arr[authorIndex] = {...arr[authorIndex], blogs: arr[authorIndex].blogs + 1}
    }
    return arr
  }, [])
  const author = _.maxBy(obj, 'blogs')
  return author
}

const mostLikes = (blogs) => {
  const obj = blogs.reduce((arr, blog) => {
    const authorIndex = _.findIndex(arr, o => o.author === blog.author)
    if (arr.length == 0 || authorIndex === -1) {
      arr.push({author: blog.author, likes: blog.likes})
    } else {
      arr[authorIndex] = {...arr[authorIndex], likes: arr[authorIndex].likes + blog.likes}
    }
    return arr
  }, [])
  const author = _.maxBy(obj, 'likes')
  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}