import camelize from 'lodash.camelcase'
import snake from 'lodash.snakecase'
import { Req } from '../../client'

export const path = 'receive.json'

export class Request implements Req {
  private _input: Input
  private _output: Output
  private _raw: { [k: string]: any }

  constructor (input: Input) {
    this._input = input
  }

  /**
   * @property
   */
  get to (): string {
    return path
  }

  /**
   * @property
   */
  get output (): Output {
    return this._output
  }

  /**
   * Returns JSON object of the request's input, ready
   * to be sent as the body of an HTTP request.
   *
   * @property body
   */
  get body (): Object {
    return Object.entries(this._input).reduce(
      (b, [k, v]) => {
        b[snake(k)] = v
        return b
      },
      { service_code: 'cashout' } as { [k: string]: any }
    )
  }

  /**
   * @property
   */
  get response (): object {
    return this._raw
  }

  /**
   * Sets the output of the request.
   * The response received after performing the request is
   * converted to the expected output type. It also sets
   * the raw response that was received.
   *
   * @param {object} data Response
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
// parameters to send when requesting for funds from
// a certain Mobile Money Account.
// While `provider` is optional, it's recommended that
// you set it since the heuristic used to automatically
// detect fails if the payee's number is ported. For
// example, the 024 prefix will be wrongly identified
// as MTN even after the owner has ported to a different
// network.
export interface Input {
  // required
  amount: number // 	Amount to receive
  currency: string // Currency of amount, e.g. GHS
  customerNo: string // Mobile Money Account to receive from
  countryCode: string // Country code of Mobile Money Account, e.g. GH
  reference: string // Alphanumeric, uniquely identifies transaction to client

  // optional
  provider?: string // Mobile Money Operator of payee. Due to porting it's a good idea to specify
  customerName?: string // 	Name of payee or description of transaction
  remarks?: string // Remarks on the transaction
  scheduleDate?: string // 	Day to execute, if not immediately
  scheduleTime?: string // Time to execute, if not immediately
  live?: boolean // Production?
  dummy?: boolean // Default: true. Set to false to receive callbacks
  callbackURLs?: string[] // Allows to customize callbacks per request. Defaults to global if none given
}

// Output is what we received after a successful
// or failed call to the Flopay API.
export interface Output {
  success: boolean
  response: Response
}

// Response maps onto the structure of the expected
// JSON response for both failed and successful
// requests. See https://developer.flopay.io/accept-payment/mobile-wallet
// for more information.
export interface Response {
  reference: string
  provider: string
  recipient: string
  amount: number
  currency: string
  message: string
}
