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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}