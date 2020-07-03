const {dummy} = require('../utils/list_helpers')

test('dummy return one', () => {
  const blogs = []
  const res = dummy(blogs)
  expect(res).toBe(1)
})