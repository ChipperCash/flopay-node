import { Input, Request, path } from './mmo'

describe('Receive MMO', () => {
  describe('Request', () => {
    let req: Request
    let input: Input

    let amt: number
    let cur: string
    let cno: string
    let cco: string
    let ref: string
    let prv: string
    let pfn: string
    let rem: string
    let sde: string
    let ste: string

    beforeEach(() => {
      amt = Math.round(Math.random() * 100)
      cur = 'GHS'
      cno = '+233123456789'
      cco = 'GH'
      ref = Math.random().toString(36)
      prv = 'MTN'
      pfn = 'Jill Konadu'
      rem = ref
      sde = new Date().toLocaleString()
      ste = new Date().toLocaleTimeString()

      input = {
        amount: amt,
        currency: cur,
        customerNo: cno,
        countryCode: cco,
        reference: ref,
        provider: prv,
        customerName: pfn,
        remarks: rem,
        scheduleDate: sde,
        scheduleTime: ste
      } as Input

      req = new Request(input)
    })

    it('creates a new request', () => {
      expect(req.body).toEqual({
        amount: amt,
        currency: cur,
        customer_no: cno,
        country_code: cco,
        reference: ref,
        provider: prv,
        customer_name: pfn,
        remarks: rem,
        schedule_date: sde,
        schedule_time: ste,
        service_code: 'cashout'
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
