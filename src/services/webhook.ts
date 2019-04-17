import camelize from 'lodash.camelcase'

export enum Event {
  TransactionPosted = 'transaction_posted'
}

// Data represents the structure of the payload
// received for a successfully initiated Mobile Money
// payment request.
export interface Data {
  event_name: string
  client: { [k: string]: any }
  transaction: { [k: string]: any }
}

export interface Client {
  till: string
  name: string
  company: string
  msisdn: string
  bankAccountNo: string
}

// Transaction represents the structure of the embedded
// transaction object of the webhook response.
export interface Transaction {
  amount: string // amount that was requested and received from the customer
  currency: string // currency of the transaction
  recipientNo: string // customer's Mobile Money Account number
  date: string // date of the transaction, e.g. "16 Apr 2019"
  time: string // time of the transaction, e.g. "18:48:31"
  status: string // status of the transaction, e.g. "failed"
  serviceCode: string // service code, i.e. "cashout" or "cashin"
  providerCode: string // code of the customer's Mobile Money Operator
  reference: string // reference that was set on the original request
  remarks: string // Comment on transaction status
  chargedAmount: string // Amount charged by Flopay on the received amount
  netAmount: string // Amount credited to your account, after the charge
  id: string // Flopay assigned ID
  providerReference: string
  callbackURLs: string[] | string
  extraData: object
  success: boolean
}

export class Webhook {
  private _eventName: Event
  private _client: Client
  private _transaction: Transaction

  constructor (wd: Data) {
    this.eventName = wd.event_name
    this.client = wd.client
    this.transaction = wd.transaction
  }

  /**
   * @property {String} type
   */
  get type (): string {
    return this._transaction.serviceCode
  }

  /**
   * @property {Boolean} succeeded
   */
  get succeeded (): boolean {
    return this._transaction.status === 'paid' && !!this._transaction.success
  }

  /**
   * @property {String} eventName
   */
  get eventName (): string {
    return this._eventName
  }

  set eventName (name: string) {
    // Ignoring all other events in favor of what
    // we're currently seeing.
    console.log(name)
    this._eventName = Event.TransactionPosted
  }

  /**
   * @property {Object} client
   */
  get client (): object {
    return this._client
  }

  /**
   * Camelizes keys of the given client data before
   * setting it on the webhook.
   *
   * @method setClient
   * @param {Client} client data
   */
  set client (data: object) {
    const o = Object.entries(data).reduce(
      (b, [k, v]) => {
        b[camelize(k)] = v
        return b
      },
      {} as { [k: string]: any }
    )

    this._client = o as Client
  }

  /**
   * @property {Object} transaction
   */
  get transaction (): object {
    return this._transaction
  }
  /**
   * Camelizes keys of the given transaction data before
   * setting it on the webhook.
   *
   * @method setTransaction
   * @param {Transaction} Transaction data, with snakecase keys
   */
  set transaction (data: object) {
    const o = Object.entries(data).reduce(
      (b, [k, v]) => {
        if (k === 'callback_urls') {
          b['callbackURLs'] = v
        } else {
          b[camelize(k)] = v
        }
        return b
      },
      {} as { [k: string]: any }
    )

    this._transaction = o as Transaction
  }
}
