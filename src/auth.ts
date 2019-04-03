// URL endpoint
export const path = 'login'

export interface Cred {
  id: string
  secret: string
}

// Request consists of a client ID, client secret,
// and a grant type that can be used to acquire an access
// token. See https://developer.flopay.io/authentication
// for more information on this.
export class Request {
  static grantType: string = 'client_credentials'
  readonly cred: Cred

  constructor (cred: Cred) {
    this.cred = cred
  }

  get body (): Object {
    return this.asJSON()
  }

  /**
   * Returns a JSON string representation of the
   * Request.
   *
   * @method asJSON
   * @return {Object} Request, as JSON
   */
  asJSON (): Object {
    return {
      grant_type: Request.grantType,
      client_id: this.cred.id,
      client_secret: this.cred.secret
    }
  }
}

// Response maps onto the structure of the expected
// JSON response for a successful authentication
// request to the Flopay v1 API. See https://developer.flopay.io/authentication
// for more information.
export interface Response {
  access_token: string
  token_type: string
  created_at: number
  expires_in: number
}

// Auth is a valid authentication/authorization for interacting
// with the API. According to the documentation, the granted
// access token is valid for 3600 seconds (1 hour), Thus,
// `expires` is one hour into the future since the token was
// granted.
export class Auth {
  readonly token: string
  readonly type: string
  readonly expires: Date

  /**
   * Returns an authentication that can be used by the
   * Flopay API client. Note that there's not checks to
   * ensure that it is valid i.e. hasn't expired. This
   * This means that the client using it should perform
   * the check before any calls to the API are made.
   *
   * @method new
   * @param {Response} authRes
   * @return {Auth} Authentication to be used with a client
   */
  constructor (authRes: Response) {
    this.token = authRes.access_token
    this.type = authRes.token_type
    this.expires = new Date(authRes.created_at * 1000 + authRes.expires_in)
  }

  /**
   * True if the auth's token hasn't expired.
   * False otherwise.
   *
   * @property expired
   */
  get expired (): boolean {
    return new Date() >= this.expires
  }
}

export class ExpiredError extends Error {
  constructor (message: string) {
    super(message)
  }
}
