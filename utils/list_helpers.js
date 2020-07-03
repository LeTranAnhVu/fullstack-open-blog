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
    console.log('aaarra', arr)
    if (arr.length == 0) {
      arr.push({author: blog.author, blogs: 1})
    } else {
      const authorIndex = _.findIndex(arr, o => o.author === blog.author)
      if (authorIndex !== -1) {
        arr[authorIndex] = {...arr[authorIndex], blogs: arr[authorIndex].blogs + 1}
      } else {
        arr.push({author: blog.author, blogs: 1})
      }
    }
    return arr

  }, [])


  const author = _.maxBy(obj, 'blogs')
  return author
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}