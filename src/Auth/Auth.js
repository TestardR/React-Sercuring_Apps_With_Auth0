import auth0 from 'auth0-js';

export default class Auth {
  // We pass React Router's history in, so Auth can perform redirects
  constructor(history) {
    this.history = history;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      // id_token: Gives us a JWT token to authenticate the user when they login in
      // token : Gives us an access token so the user can make API calls
      scope: 'openid profile email' // when a user signs in, they'll be presented with a consent screen so they can consent to us using this data
    });
  }
}
