const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const mongoConnection = require('../mongoConnect')

const oneBlog = {
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}
const initBlogs = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}, {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
}, {
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
}, {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
}, {
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}
]


const blogsInDb = async () => {
  return await Blog.find({})
}

const createUser = async () => {
  const userPayload = {
    'username': 'brian',
    'name': 'brian le',
    'password': '1234'
  }
  await api.post('/api/users')
    .send(userPayload)
}

const tokenOfLoginUser = async () => {
  const loginPayload = {
    'username': 'brian',
    'password': '1234'
  }
  const res = await api.post('/api/login')
    .send(loginPayload)
  return res.body.token
}

describe('api test', () => {
  beforeAll(async () => {
    await mongoConnection.initialize()
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initBlogs)
    await User.deleteMany({})
    await createUser()
  })

  test('blog-list-test: should return correct amount of  blog and json type', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(5)
  })

  test('blog-list-test: should return id instead of _id', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body[0].id).toBeDefined()
    expect(res.body[0]._id).toBeUndefined()
  })

  test('blog-list-test: should create new blog and return new blog', async () => {
    const token = await tokenOfLoginUser()

    const res = await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(oneBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveProperty('title', oneBlog.title)

  })

  test('blog-list-test: should create new blog with 0 likes default', async () => {
    const token = await tokenOfLoginUser()
    delete oneBlog.likes
    const res = await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(oneBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveProperty('likes', 0)
  })

  test('blog-list-test: should not create new blog when user not not login', async () => {
    const token = 'dfajshdfjhasdhfahdfa'
    const res = await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(oneBlog)
      .expect(401)
  })

  const badBlogs = [
    {
      url: 'https://reactpatterns.com/',
    },
    {
      title: 'React patterns',
    }
  ]
  test.each(badBlogs)('blog-list-test: cannot create new blog with empty title or url', async (blogInput) => {
    const token = await tokenOfLoginUser()
    const res = await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(blogInput)
      .expect(400)
  })

  test('blog-list-test: delete a blog by id', async () => {
    const blog = await blogsInDb()
    const deleteId = blog[0].id
    // delete
    await api
      .delete(`/api/blogs/${deleteId}`)
      .expect(204)

    // check remain blogs
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(4)
  })

  test('blog-list-test: cannot delete a blog by wrong id', async () => {
    // delete
    await api
      .delete(`/api/blogs/invalidId`)
      .expect(400)

    // check remain blogs
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(5)
  })

  test('blog-list-test: find a blog by id', async () => {
    const blogs = await blogsInDb()
    const res = await api
      .get(`/api/blogs/${blogs[0].id}`)
      .expect(200)

    expect(res.body).toHaveProperty('id', blogs[0].id)
  })

  const badfindId = [
    ['5a422a851b54a6762fffffff', 404],
    ['sadhfgajhsdf', 404]
  ]
  test.each(badfindId)('blog-list-test: cannot find a blog by id', async (id, status) => {
    const res = await api
      .get(`/api/blogs/${id}`)
      .expect(status)
  })

  test('blog-list-test: update a blog by id', async () => {
    const blogs = await blogsInDb()
    const data = {...blogs[0].toJSON(), title: 'changed'}
    const res = await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send(data)
      .expect(200)

    expect(res.body).toHaveProperty('id', blogs[0].id)
    expect(res.body).toHaveProperty('title', 'changed')
    expect(res.body).toHaveProperty('author', blogs[0].author)
    expect(res.body).toHaveProperty('url', blogs[0].url)

  })


  test.each(badfindId)('blog-list-test: cannot update a blog by id', async (id, status) => {
    const blogs = await blogsInDb()
    const data = {...blogs[0].toJSON(), title: 'changed'}
    const res = await api
      .put(`/api/blogs/${id}`)
      .send(data)
      .expect(status)
  })


  afterAll(async (done) => {
    await mongoose.connection.close()
    done()
  })

})