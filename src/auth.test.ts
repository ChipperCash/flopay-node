import * as auth from './auth'

describe('Auth', () => {
  describe('Constants', () => {
    it('has path', () => {
      expect(auth.path).toBe('login')
    })
  })

  describe('Request', () => {
    it('grant type is client_credentials', () => {
      expect(auth.Request.grantType).toBe('client_credentials')
    })

    it('serializes to JSON string', () => {
      const cred = { id: 'client-id', secret: 'client-secret' } as auth.Cred
      const req = new auth.Request(cred)
      const json = JSON.parse(req.serializeJSON())

      expect(json.grant_type).toBe(auth.Request.grantType)
      expect(json.client_id).toBe(req.cred.id)
      expect(json.client_secret).toBe(req.cred.secret)
    })
  })

  describe('Auth', () => {
    it('acquires authorization token', () => {
      expect.assertions(4)

      const token = 'access-token'
      const type = 'token-type'
      const acquired = Math.floor(new Date().getTime() / 1000)
      const secs = 3600

      const res: auth.Response = {
        access_token: token,
        token_type: type,
        created_at: acquired,
        expires_in: secs
      }

      const a = new auth.Auth(res)
      expect(a.token).toBe(token)
      expect(a.type).toBe(type)
      expect(a.expires.getTime()).toBe(new Date(acquired * 1000 + 3600).getTime())
      expect(a.expired).toBe(false)
    })

    it('expiry', async () => {
      const token = 'access-token'
      const type = 'token-type'
      const acquired = Math.floor(new Date().getTime() / 1000)
      const secs = Math.floor(Math.random() * 5)

      const res: auth.Response = {
        access_token: token,
        token_type: type,
        created_at: acquired,
        expires_in: secs
      }

      const a = new auth.Auth(res)
      await (async () => {
        return new Promise(resolve => setTimeout(resolve, secs * 1000))
      })()
      expect(a.expired).toBe(true)
    })
  })
})
