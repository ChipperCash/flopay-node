const axios = {
  defaults: {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },

  post: jest.fn((url, data) => {
    if (url === 'login') {
      return Promise.resolve({
        data: {
          access_token: Math.random()
            .toString(36)
            .repeat(5), // random string
          created_at: Math.floor(new Date().getTime() / 1000),
          expires_in: data.expires_in || 3600,
          token_type: 'bearer'
        }
      })
    } else {
      // Otherwise echo the request
      return { data }
    }
  })
}

module.exports = {
  create() {
    return axios
  }
}
