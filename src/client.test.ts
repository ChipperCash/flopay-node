import { Client, ApiVersion, InvalidCredError } from './client'

describe('Client', () => {
  it('statics', async () => {
    expect(Client.baseURL).toBe('https://api.flopay.io')
    expect(Client.version).toBe(ApiVersion.One)
  })

  describe('Make', () => {
    describe('makes a new client', () => {
      const id = 'client-id'
      const secret = 'client-secret'
      const client = new Client(id, secret)

      expect(client.cred.id).toBe(id)
      expect(client.cred.secret).toBe(secret)
      expect(client.authorized).toBe(false)
    })

    describe('Using FLOPAY_CLIENT_{ID, SECRET} env vars', () => {
      const clientId = process.env.FLOPAY_CLIENT_ID
      const clientSecret = process.env.FLOPAY_CLIENT_SECRET

      afterEach(() => {
        process.env.FLOPAY_CLIENT_ID = clientId
        process.env.FLOPAY_CLIENT_SECRET = clientSecret
      })

      it('throws exception if env vars not defined', () => {
        // delete expected env vars if they're set.
        delete process.env.FLOPAY_CLIENT_ID
        delete process.env.FLOPAY_CLIENT_SECRET
        expect(() => Client.fromEnv()).toThrowError(InvalidCredError)
      })

      it('makes a new client', () => {
        // overwrite env vars
        process.env.FLOPAY_CLIENT_ID = 'client-id'
        process.env.FLOPAY_CLIENT_SECRET = 'client-secret'

        const c = Client.fromEnv()
        expect(c.cred.id).toBe('client-id')
        expect(c.cred.secret).toBe('client-secret')
        expect(c.authorized).toBe(false)
      })
    })
  })

  describe('Authorize', () => {
    it('successfully authorizes client', async () => {
      const fc = new Client('client-id', 'client-secret')
      expect(fc.authorized).toBe(false)

      await fc.authorize()
      expect(fc.authorized).toBe(true)
    })
  })
})
