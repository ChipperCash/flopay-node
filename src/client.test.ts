import { Client, ApiVersion, InvalidCredError, Req } from './client'

describe('Client', () => {
  it('statics', async () => {
    expect(Client.baseURL).toBe('https://api.flopay.io')
    expect(Client.version).toBe(ApiVersion.One)
  })

  describe('Make', () => {
    describe('makes a new client', () => {
      let id: string
      let secret: string
      let client: Client

      beforeEach(() => {
        id = 'client-id'
        secret = 'client-secret'
        client = new Client(id, secret)
      })

      it('sets the credentials', () => {
        expect(client.cred.id).toBe(id)
        expect(client.cred.secret).toBe(secret)
        expect(client.authorized).toBe(false)
      })

      it('configures the HTTP transport', () => {
        expect(client.transport.defaults).toMatchObject({
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
      })
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
      expect(fc.transport.defaults.headers['Authorization']).toBeUndefined()

      await fc.authorize()
      expect(fc.authorized).toBe(true)
      expect(fc.transport.defaults.headers['Authorization']).toBe(`Bearer ${fc.accessToken}`)
    })
  })

  describe('Do', () => {
    let client: Client

    beforeEach(() => {
      client = new Client('client-id', 'client-secret')
    })

    describe('Methods', () => {
      describe('POST', () => {
        it('performs the request', async () => {
          const req: Req = {
            to: 'path',
            method: 'POST',
            body: {
              string: 'one',
              number: 2,
              array: [1, 2, 3],
              object: {}
            } as { [k: string]: any }
          }

          await client.do(req)
          expect(req.response).toEqual(req.body)
        })
      })

      describe('GET', () => {
        it('performs the request', async () => {
          const req: Req = {
            to: 'path',
            method: 'GET',
            body: { query: 'param' }
          }

          await client.do(req)
          expect(req.response).toEqual(req.body)
        })
      })
    })

    it('renews auth token before call', async () => {
      const client = new Client('client-id', 'client-secret')
      expect(client.authorized).toBe(false)

      await client.do({
        to: 'path',
        method: 'POST',
        body: {}
      } as Req)

      // client's authorization was renewed
      expect(client.authorized).toBe(true)
    })
  })
})
