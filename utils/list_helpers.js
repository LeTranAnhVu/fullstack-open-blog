const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => blogs.reduce((acc, blog) => acc + parseInt(blog.likes), 0)


module.exports = {
  dummy,
  totalLikes
}