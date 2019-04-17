import { Webhook, Data, Client, Transaction } from './webhook'

describe('Webhook', () => {
  describe('Initialize', () => {
    let wd: Data = {
      event_name: 'transaction_posted',
      client: {
        till: '000894',
        name: 'Critical Ideas Inc.',
        company: 'Chipper Cash',
        msisdn: '0201320188',
        bank_account_no: null
      },
      transaction: {
        amount: '1.0',
        currency: 'GHS',
        recipient_no: '0559630374',
        date: '17 Apr 2019',
        time: '13:22:20',
        status: 'failed',
        service_code: 'cashout',
        provider_code: 'MTN',
        reference: 'TEST--83d2bb04-a049-4f1e-b232-699fe4fbeca0',
        remarks: 'Payment queued successfully',
        charged_amount: '0.01',
        net_amount: '0.99',
        id: '-2709699660799714739',
        provider_reference: 'NA',
        callback_urls: 'none',
        extra_data: {},
        success: false
      }
    }

    it('works', () => {
      const webhook = new Webhook(wd)
      const eventName = webhook.eventName
      const client = webhook.client as Client
      const transaction = webhook.transaction as Transaction

      expect(webhook.succeeded).toBe(false)
      expect(webhook.type).toBe('cashout')
      expect(eventName).toBe(wd.event_name)

      expect(client.till).toBe(wd.client.till)
      expect(client.name).toBe(wd.client.name)
      expect(client.company).toBe(wd.client.company)
      expect(client.msisdn).toBe(wd.client.msisdn)
      expect(client.bankAccountNo).toBe(wd.client.bank_account_no)

      expect(transaction.amount).toBe(wd.transaction.amount)
      expect(transaction.currency).toBe(wd.transaction.currency)
      expect(transaction.recipientNo).toBe(wd.transaction.recipient_no)
      expect(transaction.date).toBe(wd.transaction.date)
      expect(transaction.time).toBe(wd.transaction.time)
      expect(transaction.status).toBe(wd.transaction.status)
      expect(transaction.serviceCode).toBe(wd.transaction.service_code)
      expect(transaction.providerCode).toBe(wd.transaction.provider_code)
      expect(transaction.reference).toBe(wd.transaction.reference)
      expect(transaction.remarks).toBe(wd.transaction.remarks)
      expect(transaction.chargedAmount).toBe(wd.transaction.charged_amount)
      expect(transaction.netAmount).toBe(wd.transaction.net_amount)
      expect(transaction.id).toBe(wd.transaction.id)
      expect(transaction.providerReference).toBe(wd.transaction.provider_reference)
      expect(transaction.callbackURLs).toBe(wd.transaction.callback_urls)
      expect(transaction.extraData).toBe(wd.transaction.extra_data)
      expect(transaction.success).toBe(wd.transaction.success)
    })
  })
})
