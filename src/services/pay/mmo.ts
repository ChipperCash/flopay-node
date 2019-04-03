import camelize from 'lodash.camelcase'
import snake from 'lodash.snakecase'
import { Req } from '../../client'

export const path = 'transfer.json'

export class Request implements Req {
  private _input: Input
  private _output: Output
  private _raw: object // the raw response received

  constructor (input: Input) {
    this._input = input
  }

  get output (): Output {
    return this._output
  }

  get to (): string {
    return path
  }

  get response (): object {
    return this._raw
  }

  /**
   * Returns JSON object of the request's input, ready
   * to be sent as the body of an HTTP request.
   *
   * @return {Object}
   */
  get body (): Object {
    const b = Object.entries(this._input).reduce(
      (b, [k, v]) => {
        b[snake(k)] = v
        return b
      },
      {} as { [s: string]: any }
    )

    return b
  }

  /**
   * Sets the output of the request.
   * The response received after performing the request is
   * converted to the expected output type. It als sets the
   * raw response that was received.
   *
   * @param {Object} data Response
   */
  set response (data: object) {
    this._raw = data
    const o = Object.entries(data).reduce(
      (o, [k, v]) => {
        o[camelize(k)] = v
        return o
      },
      {} as { [k: string]: any }
    )

    this._output = o as Output
  }
}

// Input represents the set of required and optional
// parameters to send when making a payment to a Mobile
// Money Account (from another Mobile Money account).
// While `provider` is optional, it's recommended that you
// set it since the heuristic used to automatically detect
// fails if the recipient's number is ported. That is, it
// could be a VODAFONE user even though their number starts
// with 024, which belongs to MTN.
export interface Input {
  // required
  senderAmount: number // Amount to send, for e.g. 12.34
  senderCurrency: string // Currency of the amount to send, for e.g. GHS
  recipientAmount: number // Amount received
  recipientCurrency: string // Currency of amount received
  recipientNo: string // Mobile Money Account number of recipient
  countryCode: string // Country code of sender, for e.g. GHS
  serviceCode: string // The kind of payment modes/services provided in the country, e.g. cashin

  // optionals
  reference?: string // A reference code that uniquely identifies this transaction to the client
  callbackURLs?: string[] // Allows to customize callbacks per request. Defaults to global if none given
  recipientName?: string // Name of the recipient or description of the transaction
  provider?: string // Mobile Money Operator of the recipient. Due to porting it's a good idea to specify.
  live?: boolean // Production?
}

// Output is the output recieved after a successful
// or failed call to the Flopay API.
export interface Output {
  success: boolean
  response: Response
}

// Response maps onto the structure of the expected
// JSON response for both failed and successful MMO
// operation. See https://developer.flopay.io/pay-out/mobile-wallet
// for more information.
export interface Response {
  reference: string
  provider: string
  recipient: string
  amount: number
  currency: string
  message: string
}
