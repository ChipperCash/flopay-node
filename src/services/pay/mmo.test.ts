import { Input, InvalidCustomerNumber, Request } from './mmo'

describe('Pay MMO', () => {
  describe('Request', () => {
    let req: Request
    let input: Input

    let amt: number
    let cur: string
    let rno: string
    let rfn: string
    let cco: string
    let sco: string
    let prv: string
    let ref: string

    beforeEach(() => {
      amt = Math.round(Math.random() * 100)
      cur = 'GHS'
      rno = '0123456789'
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
        live: true,
        callbackURLs: ['https://chipper.cash/callback']
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
        live: true,
        callback_urls: ['https://chipper.cash/callback']
      })

      expect(req.to).toBe('transfer.json')
      expect(req.method).toBe('POST')
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

    describe('Invalid customer number', () => {
      it('throws InvalidCustomerNumber', () => {
        const req = new Request(input)
        const res = {
          success: false,
          response: {
            message_type: 'invalid_customer_num',
            message: `The recipient number is invalid, ${input.recipientNo} is not a valid number.`
          }
        }

        expect(() => {
          req.response = res
        }).toThrowError(InvalidCustomerNumber)
      })

      it('throws generic error for unknown message type', () => {
        const req = new Request(input)
        const res = {
          success: false,
          response: {
            message_type: 'unknown_type',
            message: 'unknown error type'
          }
        }

        expect(() => {
          req.response = res
        }).toThrow(Error)
      })
    })
  })
})
