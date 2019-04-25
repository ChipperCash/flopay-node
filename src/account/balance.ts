import snake from 'lodash.snakecase'

export interface Input {}
export interface Output {
  success: boolean
  accounts: Account[]
}

export interface Account {
  type: string
  balance: number
  overdraft: number
  currency: string
}

export class Request {
  private _input: Input
  private _raw: { [k: string]: any }
  private _output: Output

  constructor (input: Input = {}) {
    this._input = input
  }

  /**
   * The HTTP method to use when performing
   * the request.
   *
   * @property method
   */
  get method (): string {
    return 'GET'
  }

  /**
   * The relative URL endpoint to use when
   * performing the request.
   *
   * @property to
   */
  get to (): string {
    return 'balance'
  }

  /**
   * @property body
   */
  get body (): object {
    return Object.entries(this._input).reduce(
      (b, [k, v]) => {
        b[snake(k)] = v
        return b
      },
      {} as { [k: string]: any }
    )
  }

  /**
   * Sets the output of the request.
   * The raw response is set to `this._raw`, while
   * the processed (mainly, converting keys from
   * snake_case to camelCase) is set to `this._output`.
   *
   * @param {object} data Response
   */
  set response (data: { [k: string]: any }) {
    this._raw = data

    const success = data.success
    const accounts = data.accounts.map((account: { [k: string]: any }) => {
      return {
        type: account.account_type,
        balance: account.balance,
        overdraft: account.overdraft,
        currency: account.currency
      } as Account
    })

    this._output = {
      success,
      accounts
    }
  }

  /**
   * The raw response that was received after
   * the request was successfully performed.
   *
   * @property response
   */
  get response (): { [k: string]: any } {
    return this._raw
  }

  /**
   * The transformed response.
   *
   * @property output
   */
  get output (): Output {
    return this._output
  }
}
