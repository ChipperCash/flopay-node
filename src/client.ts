import { default as axios, AxiosInstance } from 'axios'
import * as auth from './auth'

export enum ApiVersion {
  One = 'v1'
}

// A Flopay API v1 client.
// It is initialized without a valid authentication,
// which means that `authorize` should be the first
// call made before using it to interact with the API.
export class Client {
  static readonly baseURL: string = 'https://api.flopay.io'
  static readonly version: ApiVersion = ApiVersion.One
  readonly cred: auth.Cred
  readonly transport: AxiosInstance
  private auth: auth.Auth

  constructor (id: string, secret: string, timeout = 2000) {
    this.cred = { id, secret } as auth.Cred
    this.transport = axios.create({
      baseURL: `${Client.baseURL}/${Client.version}/`,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      timeout
    })
  }

  /**
   * Makes a new client using the FLOPAY_CLIENT_{ID, SECRET}
   * environment variables as the client credentials. If
   * the variables are not found, an exception is thrown.
   *
   * @method fromEnv
   * @return {Client}
   */
  static fromEnv () {
    const id = process.env.FLOPAY_CLIENT_ID
    const secret = process.env.FLOPAY_CLIENT_SECRET
    if (id === undefined || secret === undefined) {
      throw new InvalidCredError()
    }

    return new Client(id, secret)
  }

  /**
   * Acquires a valid access token for this client.
   * The granted token is valid for 3600s from now.
   * It's safe to be re-called when the token has
   * expired an a new one is needed. It could also
   * be called to acquire a new token even before the
   * current one has expired.
   *
   * @method authorize
   */
  async authorize () {
    const req = new auth.Request(this.cred)
    const { data } = await this.transport.post(auth.path, req.body)
    this.auth = new auth.Auth(data as auth.Response)
    this.transport.defaults.headers['Authorization'] = `Bearer ${this.auth.token}`
  }

  /**
   * True if the client is authorized, and the
   * acquired authorization can be used to make requests.
   * False otherwise.
   *
   * @property authorized
   */
  get authorized (): boolean {
    return !!this.auth && !this.auth.expired
  }

  get accessToken (): string {
    return this.auth && this.auth.token
  }

  /**
   * Performs a request and sets the response received
   * on the given request. Sometimes (roughly hourly),
   * these call will take slightly longer because the
   * client re-authorizes (acquires a new token). Hopefully
   * this shouldn't be noticeable. But if it is then
   * maybe we can get rid of the compulsory renewal.
   *
   * @method do
   * @param {String} to Relative endpoint
   * @param {Req} req The request to perform
   */
  async do (req: Req) {
    if (!this.authorized) {
      // Looks like our current authorization is no longer good.
      // Getting a new one before making the request. Not slow.
      await this.authorize()
    }

    const { to, body } = req
    const { data } = await this.transport.post(to, body)
    req.response = data
  }
}

// Req is any request that can be performed by the client.
// It specific the endpoint (as relative path), the body
// as an Object, and waits for the response to be set
// after the request has been performed.
export interface Req {
  to: string // endpoint
  body: { [k: string]: any } // request body, as JSON
  response?: { [k: string]: any } // request response, as JSON
}

export class InvalidCredError extends Error {
  constructor () {
    super(
      `FLOPAY_CLIENT_{ID, SECRET} env vars expected but not found. Please set them and try again. Or use the other constructor that accepts the client id and client secret as arguments.`
    )
  }
}
