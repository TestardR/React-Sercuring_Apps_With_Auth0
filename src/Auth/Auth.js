import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = 'redirect_on_login';

export default class Auth {
  // We pass React Router's history in, so Auth can perform redirects
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email read:courses';
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      // links to the API Identifier we set in general settings of Auth0
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      // id_token: Gives us a JWT token to authenticate the user when they login in
      // token : Gives us an access token so the user can make API calls
      scope: this.requestedScopes // when a user signs in, they'll be presented with a consent screen so they can consent to us using this data
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize(); // This will redirect the browser to the Auth0 login page
  };

  handleAuthentication = () => {
    // get the data from the URL, parse it to get individual pieces
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // we write the data to our session
        this.setSession(authResult);
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === 'undefined'
            ? '/'
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = authResult => {
    // set the time that the access token will exprire
    // Unix epoch time, we need 1. authResult.expiresIn contains expiration in seconds, 2. * by 1000 to convert in to millisec, 3. Add current Unix epoch time
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    // If there is a value on the "scope" param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || '';

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('scopes', JSON.stringify(scopes));
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    this.userProfile = null;
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: 'http://localhost:3000'
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScopes(scopes) {
    const grantedScopes = (
      JSON.parse(localStorage.getItem('scopes')) || ''
    ).split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }
}
