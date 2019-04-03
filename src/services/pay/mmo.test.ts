import { Input, Request, path } from './mmo'

describe('MMO', () => {
  describe('Request', () => {
    let req: Request
    let input: Input

    let amt = Math.round(Math.random() * 100)
    let cur = 'GHS'
    let rno = '+233123456789'
    let rfn = 'Junior Konadu'
    let cco = 'GH'
    let sco = 'cashin'
    let prv = 'MTN'
    let ref = Math.random().toString(36)

    beforeEach(() => {
      amt = Math.round(Math.random() * 100)
      cur = 'GHS'
      rno = '+233123456789'
      rfn = 'Junior Konadu'
      cco = 'GH'
      sco = 'cashin'
      prv = 'MTN'
      ref = Math.random().toString(36)

      input = {
        senderAmount: amt,
        senderCurrency: cur,
        recipientAmount: amt,
        recipientCurrency: cur,
        recipientNo: rno,
        countryCode: cco,
        serviceCode: sco,
        reference: ref,
        recipientName: rfn,
        provider: prv,
        live: true
      } as Input

      req = new Request(input)
    })

    it('creates a request', () => {
      expect(req.body).toEqual({
        sender_amount: amt,
        sender_currency: cur,
        recipient_amount: amt,
        recipient_currency: cur,
        recipient_no: rno,
        country_code: cco,
        service_code: sco,
        reference: ref,
        recipient_name: rfn,
        provider: prv,
        live: true
      })

      expect(req.to).toBe(path)
    })

    it('sets response', () => {
      const res = {
        success: true,
        response: {
          reference: 'FLP*******',
          provider: 'mtn',
          recipient: '233*******',
          amount: 1,
          currency: 'Ghs',
          message: 'Transaction is queued successfully'
        }
      }

      req.response = res
      expect(req.response).toEqual(res)
      expect(req.output).toEqual(res)
    })
  })
})
