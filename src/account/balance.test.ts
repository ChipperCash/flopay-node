import { Request } from './balance'

describe('Account Balance', () => {
  describe('Request', () => {
    it('creates a request', () => {
      const req = new Request({ query: 'param' })

      expect(req.method).toBe('GET')
      expect(req.to).toBe('balance')
      expect(req.body).toEqual({ query: 'param' })
    })

    it('sets the response', () => {
      const success = Math.random() > 0.5
      const type = 'U*****'
      const balance = 1000.0
      const overdraft = 100.0
      const currency = 'USD'
      const res = {
        success,
        accounts: [
          {
            account_type: type,
            balance,
            overdraft,
            currency
          }
        ]
      }

      const req = new Request()
      req.response = res
      expect(req.response).toEqual(res)
      expect(req.output.success).toBe(success)

      expect(req.output.accounts).toEqual([
        {
          type,
          balance,
          overdraft,
          currency
        }
      ])
    })
  })
})
