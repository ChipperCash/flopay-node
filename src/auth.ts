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

  /**
   * Returns a JSON string representation of the
   * Request.
   *
   * @method serializeJSON
   * @return {String} The Request as a JSON string
   */
  serializeJSON (): string {
    return JSON.stringify({
      grant_type: Request.grantType,
      client_id: this.cred.id,
      client_secret: this.cred.secret
    })
  }
}

export interface Response {
  access_token: string
  token_type: string
  created_at: number
  expires_in: number
}

//  is a valid authentication/authorization for interacting
// with the API. According to the documentation, the granted
// access token is valid for 3600 seconds (1 hour), Thus,
// `expires` is one hour into the future since the token was
// granted.
export class Auth {
  readonly token: string
  readonly type: string
  readonly expires: Date

  constructor (authRes: Response) {
    this.token = authRes.access_token
    this.type = authRes.token_type
    this.expires = new Date(authRes.created_at * 1000 + authRes.expires_in)

    console.log(this.token, this.type)
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
