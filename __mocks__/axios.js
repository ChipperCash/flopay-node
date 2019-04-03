const axios = {
  defaults: {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },

  post: jest.fn(url => {
    if (url === 'login') {
      return Promise.resolve({
        data: {
          access_token: Math.random()
            .toString(36)
            .repeat(5), // random string
          created_at: Math.floor(new Date().getTime() / 1000),
          expires_in: 3600,
          token_type: 'bearer'
        }
      })
    }
  })
}

module.exports = {
  create() {
    return axios
  }
}
